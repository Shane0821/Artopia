"use client"

import React, { useState, useEffect } from 'react';

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"

import { readContract } from '@wagmi/core'
import imgABI from '/abi/imagenft.json'
import promptABI from '/abi/promptnft.json'

function page({ params }: { params: { addr: string } }) {
    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const tokenURIOfOwnerByIndex = async (usr: string, idx: number, tag: string) => {
        if (tag != "prompt" && tag != "art") return undefined
        // note: need to check if tag is valid (prompt or art)
        const contract = (tag === "prompt") ? process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT : process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT
        const abi = (tag === "prompt") ? promptABI : imgABI

        const tokenId: BigInt = await readContract({
            address: contract,
            abi: abi,
            functionName: 'tokenOfOwnerByIndex',
            chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
            args: [usr, idx]
        })
        const promptId = Number(tokenId)

        const tokenURI: string = await readContract({
            address: contract,
            abi: abi,
            functionName: 'tokenURI',
            chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
            args: [promptId]
        })
        return tokenURI
    }


    useEffect(() => {
        const loadPrompt = async(usr: string) => {
            console.log(usr)

            const balance: BigInt = await readContract({
                address: process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT,
                abi: promptABI,
                functionName: 'balanceOf',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [usr]
            })
            const cntPrompt = Number(balance)

            if (cntPrompt > 0) {
                for await (const tokenURI of Array.from({ length: cntPrompt }, 
                                                        (_, index) => tokenURIOfOwnerByIndex(usr, index, "prompt"))) {
                    console.log("prompt:", tokenURI)
                }    
            }
        }
    
        const loadArt = async(usr: string) => {
            const balance: BigInt = await readContract({
                address: process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT,
                abi: imgABI,
                functionName: 'balanceOf',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [usr]
            })
            const cntArt = Number(balance)
            
            if (cntArt > 0) {
                for await (const tokenURI of Array.from({ length: cntArt }, 
                                                        (_, index) => tokenURIOfOwnerByIndex(usr, index, "art"))) {
                    console.log("art:", tokenURI)
                }    
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