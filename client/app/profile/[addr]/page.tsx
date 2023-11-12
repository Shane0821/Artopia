"use client"

import React, { useState, useEffect } from 'react';

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"

import { readContract } from '@wagmi/core'
import imgABI from '@abi/imagenft.json'
import promptABI from '@abi/promptnft.json'


interface promptDataType {
    prompt: string,
    negative_prompt: string
}

interface artDataType {
    name: string,
    description: string,
    cid: string,
    promptcid: string,
    model: string,
    steps: number,
    guidanceScale: number,
    seed: number,
    sampler: string,
    createdAt: string
}

function page({ params }: { params: { addr: string } }) {
    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [promptURIList, setPromptURIList] = useState<promptDataType[]>([])
    const [artList, setArtList] = useState<artDataType[]>([])

    const artOfOwnerByIndex = async (usr: string, idx: number) => {
        try {
            // get token id
            const tokenId: BigInt = await readContract({
                address: process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT,
                abi: imgABI,
                functionName: 'tokenOfOwnerByIndex',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [usr, idx]
            })
            const promptId = Number(tokenId)

            // get metadata uri
            const tokenURI: string = await readContract({
                address: process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT,
                abi: imgABI,
                functionName: 'tokenURI',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [promptId]
            })
            const metaURI = 'https://ipfs.io/ipfs/' + tokenURI.split("ipfs://")[1]

            // get info from metadata
            const response = await fetch(metaURI, {
                method: 'GET'
            })
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
                throw new Error(message);
            }
            const data = await response.json();

            let imgData: artDataType = {
                name: "",
                description: "",
                cid: "",
                promptcid: "",
                model: "",
                steps: 0,
                guidanceScale: 0,
                seed: 0,
                sampler: "",
                createdAt: ""
            };
            imgData.name = data.name
            imgData.description = data.description
            imgData.cid = data.image.split("ipfs://")[0] // should be 1

            data.attributes?.forEach((attribute: any) => {
                switch (attribute.trait_type) {
                    case 'Model':
                        imgData.model = attribute.value;
                        break;
                    case 'Prompt':
                        imgData.promptcid = attribute.value.split("ipfs://")[0]; // // should be 1
                        break;
                    case 'Steps':
                        imgData.steps = attribute.value;
                        break;
                    case 'GuidanceScale':
                        imgData.guidanceScale = attribute.value;
                        break;
                    case 'Seed':
                        imgData.seed = attribute.value;
                        break;
                    case 'Sampler':
                        imgData.sampler = attribute.value;
                        break;
                    case 'CreatedAt':
                        imgData.createdAt = attribute.value;
                        break;
                }
            })
            return imgData
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    const promptOfOwnerByIndex = async (usr: string, idx: number) => {
        try {
            // get token id
            const tokenId: BigInt = await readContract({
                address: process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT,
                abi: promptABI,
                functionName: 'tokenOfOwnerByIndex',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [usr, idx]
            })
            const promptId = Number(tokenId)

            // get metadata uri
            const tokenURI: string = await readContract({
                address: process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT,
                abi: promptABI,
                functionName: 'tokenURI',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [promptId]
            })
            const metaURI = 'https://ipfs.io/ipfs/' + tokenURI.split("ipfs://")[1]

            // get prompt from metadata
            const response = await fetch(metaURI, {
                method: 'GET'
            })
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
                throw new Error(message);
            }
            const data = await response.json();
            return data.textData
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    useEffect(() => {
        if (!isConnected) return

        const loadPrompt = async (usr: string) => {
            if (!usr) return
            try {
                // get prompt nft count
                const balance: BigInt = await readContract({
                    address: process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT,
                    abi: promptABI,
                    functionName: 'balanceOf',
                    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                    args: [usr]
                })
                const cntPrompt = Number(balance)

                // fetch all
                var promptURIList: promptDataType[] = []
                if (cntPrompt > 0) {
                    for await (const prompt of Array.from({ length: cntPrompt },
                        (_, index) => promptOfOwnerByIndex(usr, index))) {
                        if (prompt != undefined) {
                            promptURIList.push(prompt)
                        }
                    }
                }
                console.log("prompt list", promptURIList)
                setPromptURIList(promptURIList)
            } catch (error) {
                console.error(error);
            }
        }

        const loadArt = async (usr: string) => {
            if (!usr) return
            try {
                // get art nft count
                const balance: BigInt = await readContract({
                    address: process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT,
                    abi: imgABI,
                    functionName: 'balanceOf',
                    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                    args: [usr]
                })
                const cntArt = Number(balance)

                // fetch all
                var artList = []
                if (cntArt > 0) {
                    for await (const ipfsURI of Array.from({ length: cntArt },
                        (_, index) => artOfOwnerByIndex(usr, index))) {
                        if (ipfsURI != undefined) {
                            artList.push(ipfsURI)
                        }
                    }
                }
                console.log("art uri list", artList)
                setArtList(artList)
            } catch (error) {
                console.error(error);
            }
        }

        loadPrompt(params.addr);
        loadArt(params.addr)
    }, [isConnected]);

    return (
        <div>
            <div>
                prompt
            </div>

            <div>
                art
            </div>
        </div>
    )
}

export default page