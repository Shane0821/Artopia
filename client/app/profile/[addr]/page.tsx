"use client"

import React, { useState, useEffect } from 'react';

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"

import { readContract } from '@wagmi/core'
import imgABI from '@abi/imagenft.json'
import promptABI from '@abi/promptnft.json'

import { 
  getPromptCountByUser,
  getPromptTokenIdOfUserByIndex,
  getTokenURIOfPromptByTokenId,
  getArtCountByUser,
  getArtTokenIdOfUserByIndex,
  getTokenURIOfArtByTokenId
} from '@utils/contract'

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
      const artId = await getArtTokenIdOfUserByIndex(usr, idx)

      // get metadata uri
      const tokenURI: string = await getTokenURIOfArtByTokenId(artId)
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
      const promptId = await getPromptTokenIdOfUserByIndex(usr, idx)

      // get metadata uri
      const tokenURI: string = await getTokenURIOfPromptByTokenId(promptId)
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
        const cntPrompt = await getPromptCountByUser(usr)

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
        setPromptURIList(promptURIList.reverse())
      } catch (error) {
        console.error(error);
      }
    }

    const loadArt = async (usr: string) => {
      if (!usr) return
      try {
        // get art nft count
        const cntArt = await getArtCountByUser(usr)

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
        setArtList(artList.reverse())
      } catch (error) {
        console.error(error);
      }
    }

    loadPrompt(params.addr);
    loadArt(params.addr)
  }, [isConnected]);

  return (
    <section className="w-full flex-center flex-col">
      <div className='mt-12 text-center'>
        <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
          {"Your "} 
          <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
            {"Art"}
          </span>
        </h2>
        <p className="mt-5 text-gray-600 sm:text-lg">Express, inspire, connect - a collection of creative talents.</p>

      </div>
      {/* list of art */}
      
      


      <div className='mt-12 text-center'>
        <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
          {"Your "} 
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {"Prompts"}
          </span>
        </h2>
        <p className="mt-5 text-gray-600 sm:text-lg">Spark your imagination and creativity - unleash your potential and passion.</p>
      </div>
      {/* list of prompts */}
    </section>
  )
}

export default page