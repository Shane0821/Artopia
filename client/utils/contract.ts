import { readContract, writeContract, waitForTransaction} from '@wagmi/core'
import { parseEther } from 'viem'

import imgABI from '@abi/imagenft.json'
import promptABI from '@abi/promptnft.json'
import auctionfactoryABI from '@abi/auctionfactory.json'
import auctionABI from '@abi/auction.json'

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

export const approveArt = async(to: string, tokenId: number) => {
    // to: auction contract address
    try {
        const { hash } = await writeContract({
            address: artContractAddr,
            abi: imgABI,
            functionName: 'approve',
            chainId: chainId,
            args: [to, tokenId]
        })
        const data = await waitForTransaction({
            hash: hash,
        })
    } catch (error) {
        throw error // should be handled by caller
    }
}

// auction factory
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

        return data.logs[0].topics[1];
    } catch (error) {
        throw error // should be handled by caller
    }
}

// todo: rename
export const getAunctionByTokenId = async(tokenId: number) => {
    try {
        const auctionAddr: string = await readContract({
            address: auctionFactoryAddr,
            abi: auctionfactoryABI,
            functionName: 'getAunctionByTokenId',
            chainId: chainId,
            args: [tokenId]
        })
        return auctionAddr
    } catch (error) {
        throw error // should be handled by caller
    }
}

// auction
export const isEnded = async(auctionAddr: string) => {
    try {
        const ended: boolean = await readContract({
            address: auctionAddr,
            abi: auctionABI,
            functionName: 'isEnded',
            chainId: chainId,
            args: []
        })
        return ended
    } catch (error) {
        throw error // should be handled by caller
    }
}

export const endAuction = async(auctionAddr: string) => {
    try {
        const { hash } = await writeContract({
            address: auctionAddr,
            abi: auctionABI,
            functionName: 'auctionEnd',
            chainId: chainId,
            args: []
        })

        await waitForTransaction({
            hash: hash,
        })
    } catch (error) {
        throw error // should be handled by caller
    }
}

export const bid = async(auctionAddr: string, amount: number) => {
    try {
        const { hash } = await writeContract({
            address: auctionAddr,
            abi: auctionABI,
            functionName: 'bid',
            chainId: chainId,
            args: [],
            value: parseEther(amount)
        })

        const data = await waitForTransaction({
            hash: hash,
        })

        console.log(data)
    } catch (error) {
        throw error // should be handled by caller
    }
}