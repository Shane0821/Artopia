"use client"

import React, { useState, useEffect } from 'react';
import {
    Select, notification, Spin, Space, Image
} from 'antd';
import { LoadingOutlined, ClockCircleOutlined, LikeOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import ArtItem from '@components/profile/ArtItem'
import Detail from '@components/profile/ArtDetail'
import PromptCard from '@components/profile/PromptCard'
import Masonry from "react-responsive-masonry"

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
  cid: string
  prompt: string,
  negative_prompt: string
}

interface artDataType {
  name: string,
  description: string,
  cid: string,
  promptcid: string,
  prompt: string,
  negative_prompt: string
  model: string,
  steps: number,
  guidance: number,
  seed: number,
  sampler: string,
  created_at: string
}

function page({ params }: { params: { addr: string } }) {
  const { data: session, status } = useSession()
  const { address, isConnected } = useAccount()

  const [promptList, setPromptList] = useState<promptDataType[]>([])
  const [artList, setArtList] = useState<artDataType[]>([])

  const [popup, setPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [promptFetching, setPromptFetching] = useState(false);
  const [artFetching, setArtFetching] = useState(false);

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
        prompt: "",
        negative_prompt: "",
        model: "",
        steps: 0,
        guidance: 0,
        seed: 0,
        sampler: "",
        created_at: ""
      };
      imgData.name = data.name
      imgData.description = data.description
      imgData.cid = data.image.split("ipfs://")[1] ? data.image.split("ipfs://")[1] : data.image.split("ipfs://")[0] // should be 1

      data.attributes?.forEach((attribute: any) => {
        switch (attribute.trait_type) {
          case 'Model':
            imgData.model = attribute.value;
            break;
          case 'Prompt':
            imgData.promptcid = attribute.value.split("ipfs://")[1] ? data.image.split("ipfs://")[1] : data.image.split("ipfs://")[0]; // // should be 1
            break;
          case 'Steps':
            imgData.steps = attribute.value;
            break;
          case 'GuidanceScale':
            imgData.guidance = attribute.value;
            break;
          case 'Seed':
            imgData.seed = attribute.value;
            break;
          case 'Sampler':
            imgData.sampler = attribute.value;
            break;
          case 'CreatedAt':
            imgData.created_at = attribute.value;
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
      data.textData.cid = tokenURI.split("ipfs://")[1]
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
        var promptList: promptDataType[] = []
        if (cntPrompt > 0) {
          for await (const prompt of Array.from({ length: cntPrompt },
            (_, index) => promptOfOwnerByIndex(usr, index))) {
            if (prompt != undefined) {
              promptList.push(prompt)
            }
          }
        }
        console.log("prompt list", promptList)
        setPromptList(promptList.reverse())
      } catch (error) {
        console.error(error);
      }
      setPromptFetching(false)
    }

    const loadArt = async (usr: string) => {
      if (!usr) return
      try {
        // get art nft count
        const cntArt = await getArtCountByUser(usr)

        // fetch all
        var artList = []
        if (cntArt > 0) {
          for await (const art of Array.from({ length: cntArt },
            (_, index) => artOfOwnerByIndex(usr, index))) {
            if (art != undefined) {
              artList.push(art)
            }
          }
        }
        console.log("art uri list", artList)
        setArtList(artList.reverse())
      } catch (error) {
        console.error(error);
      }
      setArtFetching(false)
    }

    setPromptFetching(true)
    setArtFetching(true)
    setTimeout(() => {
        loadPrompt(params.addr)
        loadArt(params.addr)
    }, 2000)
  }, []);

  return (
    <section className="w-full max-w-7xl flex-center flex-col sm:px-16 px-6">
      <Detail popup={popup} setPopup={setPopup} data={popupData} />

      <div className='mt-12 mb-6 text-center'>
        <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
          {"Your "} 
          <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
            {"Art"}
          </span>
        </h2>
        <p className="mt-4 text-gray-600 sm:text-lg">Express, inspire, connect - a collection of creative talents.</p>

      </div>
      {/* list of art */}
      <Spin className="mt-12"
        indicator={antIcon}
        spinning={artFetching}
       />
       <Masonry className="gallery" columnsCount={4} gutter="0.5rem">
                {artList.map((data, index) => (
                    <ArtItem
                        key={index}
                        data={data}
                        index={index}
                        setPopup={setPopup}
                        setPopupData={setPopupData}
                    />
                ))}
        </Masonry> 

      <div className='mt-12 mb-6 text-center'>
        <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
          {"Your "} 
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {"Prompts"}
          </span>
        </h2>
        <p className="mt-4 text-gray-600 sm:text-lg">Spark your imagination and creativity - unleash your potential and passion.</p>
      </div>
      
      {/* list of prompts */}
      <Spin
        className="mt-12"
        indicator={antIcon}
        spinning={promptFetching}
       />
      <Masonry columnsCount={3} gutter="1rem" className="mb-6">
        {promptList.map((data, index) => (
            <PromptCard data={data} index={index} key={index}/>
        ))}
      </Masonry> 
    </section>
  )
}

export default page