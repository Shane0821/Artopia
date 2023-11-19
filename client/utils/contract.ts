import { readContract, writeContract, waitForTransaction } from '@wagmi/core'

import imgABI from '@abi/imagenft.json'
import promptABI from '@abi/promptnft.json'
import auctionfactoryABI from '@abi/auctionfactory.json'

const promptContractAddr = process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT
const artContractAddr = process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT
const auctionFactoryAddr = process.env.NEXT_PUBLIC_AUCTION_FACTORY_CONTRACT
const chainId: number = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

// prompt
export const getPromptCountByUser = async(usr: string) => {
    try {
        const balance: BigInt = await readContract({
            address: promptContractAddr,
            abi: promptABI,
            functionName: 'balanceOf',
            chainId: chainId,
            args: [usr]
        })
        const cntPrompt = Number(balance)
        return cntPrompt
    } catch (error) {
        throw error // should be handled by caller
    }
}   

export const getPromptTokenIdOfUserByIndex = async(usr: string, idx: number) => {
    try {
        const tokenId: BigInt = await readContract({
            address: promptContractAddr,
            abi: promptABI,
            functionName: 'tokenOfOwnerByIndex',
            chainId: chainId,
            args: [usr, idx]
        })
        return Number(tokenId)
    } catch (error) {
        throw error // should be handled by caller
    }
}

export const getTokenURIOfPromptByTokenId = async(tokenId: number) => {
    try {
        const tokenURI: string = await readContract({
            address: promptContractAddr,
            abi: imgABI,
            functionName: 'tokenURI',
            chainId: chainId,
            args: [tokenId]
        })
        return tokenURI
    } catch (error) {
        throw error // should be handled by caller
    }
}

// art
export const getArtCountByUser = async(usr: string) => {
    try {
        const balance: BigInt = await readContract({
            address: artContractAddr,
            abi: imgABI,
            functionName: 'balanceOf',
            chainId: chainId,
            args: [usr]
        })
        const cntArt = Number(balance)
        return cntArt
    } catch (error) {
        throw error // should be handled by caller
    }
}

export const getArtTokenIdOfUserByIndex = async(usr: string, idx: number) => {
    try {
        const tokenId: BigInt = await readContract({
            address: artContractAddr,
            abi: imgABI,
            functionName: 'tokenOfOwnerByIndex',
            chainId: chainId,
            args: [usr, idx]
        })
        return Number(tokenId)
    } catch (error) {
        throw error // should be handled by caller
    }
}

export const getTokenURIOfArtByTokenId = async(tokenId: number) => {
    try {
        const tokenURI: string = await readContract({
            address: artContractAddr,
            abi: imgABI,
            functionName: 'tokenURI',
            chainId: chainId,
            args: [tokenId]
        })
        return tokenURI
    } catch (error) {
        throw error // should be handled by caller
    }
}

// auction
export const createAuction = async(duration: number, tokenId: number) => {
    try {
        const { hash } = await writeContract({
            address: auctionFactoryAddr,
            abi: auctionfactoryABI,
            functionName: 'createAuction',
            chainId: chainId,
            args: [duration, tokenId]
        })

        const data = await waitForTransaction({
            hash: hash,
        })

        // return auction index in data
        console.log(data)
    } catch (error) {
        throw error // should be handled by caller
    }
}