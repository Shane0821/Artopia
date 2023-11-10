"use client"

import React, { useState, useEffect } from 'react';

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"

import { readContract } from '@wagmi/core'
import imgABI from '/abi/imagenft.json'
import promptABI from '/abi/promptnft.json'
import { METHODS } from 'http';

interface promptDataType {
    prompt: string,
    negative_prompt: string
}

function page({ params }: { params: { addr: string } }) {
    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [promptURIList, setPromptURIList] = useState<promptDataType[]>([])
    const [artURIList, setArtURIList] = useState<string[]>([])

    const imgIpfsOfOwnerByIndex = async (usr: string, idx: number) => {
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

            // get ipfs uri
            const response = await fetch(metaURI, {
                method: 'GET'
            })
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
                throw new Error(message);
            }
            const data = await response.json();
            return 'https://ipfs.io/ipfs/' + data.image
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
            console.log("prompt uri list", promptURIList)
            setPromptURIList(promptURIList)
        }

        const loadArt = async (usr: string) => {
            if (!usr) return

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
            var artURIList = []
            if (cntArt > 0) {
                for await (const ipfsURI of Array.from({ length: cntArt },
                    (_, index) => imgIpfsOfOwnerByIndex(usr, index))) {
                    if (ipfsURI != undefined) {
                        artURIList.push(ipfsURI)
                    }
                }
            }
            console.log("art uri list", artURIList)
            setArtURIList(artURIList)
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