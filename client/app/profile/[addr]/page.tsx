"use client"

import React, { useState, useEffect } from 'react';
import { redirect } from 'next/navigation'

import {
  Select, notification, Spin, Space
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

import {
  getPromptCountByUser,
  getPromptTokenIdOfUserByIndex,
  getTokenURIOfPromptByTokenId,
  getArtCountByUser,
  getArtTokenIdOfUserByIndex,
  getTokenURIOfArtByTokenId
} from '@utils/contract'

interface promptDataType {
  tokenId: number,
  cid: string
  prompt: string,
  negative_prompt: string
}

interface artDataType {
  tokenId: number,
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
  created_at: string,
  width: number,
  height: number
}

function Profile({ params }: { params: { addr: string } }) {
  const { data: session, status } = useSession()
  const { address, isConnected } = useAccount()

  const [promptList, setPromptList] = useState<promptDataType[]>([])
  const [artList, setArtList] = useState<artDataType[]>([])

  const [popup, setPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [promptFetching, setPromptFetching] = useState(true);
  const [artFetching, setArtFetching] = useState(true);

  const artOfOwnerByIndex = async (usr: string, idx: number) => {
    try {
      // get token id
      const artId = await getArtTokenIdOfUserByIndex(usr, idx)

      // get metadata uri
      const tokenURI: string = await getTokenURIOfArtByTokenId(artId)
      const metaURI = 'https://tan-bright-gibbon-975.mypinata.cloud/ipfs/' + tokenURI.split("ipfs://")[1]

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
        tokenId: artId,
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
        created_at: "",
        width: 0,
        height: 0
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
            imgData.promptcid = attribute.value.split("ipfs://")[1] ? attribute.value.split("ipfs://")[1] : attribute.value.split("ipfs://")[0]; // // should be 1
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
          case 'Height':
            imgData.height = attribute.value;
            break;
          case 'Width':
            imgData.width = attribute.value;
            break;
        }
      })

      {
        // fetch prompt by cid
        const promptURI = 'https://tan-bright-gibbon-975.mypinata.cloud/ipfs/' + imgData.promptcid
        // console.log(promptURI)
        const response = await fetch(promptURI, {
          method: 'GET'
        })
        if (!response.ok) {
          const message = `An error has occurred: ${response.status}`;
          throw new Error(message);
        }
        const data = await response.json();
        imgData.prompt = data.textData.prompt
        imgData.negative_prompt = data.textData.negative_prompt
      }

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
      const metaURI = 'https://tan-bright-gibbon-975.mypinata.cloud/ipfs/' + tokenURI.split("ipfs://")[1]

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
      data.textData.tokenId = promptId
      return data.textData
    } catch (error) {
      console.error(error);
      return undefined
    }
  }

  useEffect(() => {
    if (!isConnected) {
      redirect('/');
    }
  }, [isConnected, session?.user]);

  useEffect(() => {
    if (!isConnected) return

    const loadPrompt = async (usr: string) => {
      if (!usr) {
        setPromptFetching(false)
        return
      }
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
        // console.log("prompt list", promptList)
        setPromptList(promptList.reverse())
      } catch (error) {
        console.error(error);
      }
      setPromptFetching(false)
    }

    const loadArt = async (usr: string) => {
      if (!usr) {
        setArtFetching(false)
        return
      }
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
        // console.log("art list", artList)
        setArtList(artList.reverse())
      } catch (error) {
        console.error(error);
      }
      setArtFetching(false)
    }

    const timerId = setTimeout(() => {
      loadPrompt(params.addr)
      loadArt(params.addr)
    }, 2000)

    return () => clearTimeout(timerId);
  }, []);

  return (
    <section className="w-full max-w-7xl flex-center flex-col sm:px-16 px-6">
      <Detail popup={popup} setPopup={setPopup} data={popupData} />

      <div className='mt-12 mb-6 text-center'>
        <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
          {session?.user?.name === params.addr ? "Your " : `User's `}
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
      {artList.length > 0 ? (
        <Masonry className="gallery" columnsCount={4} gutter="0.5rem">
          {artList.map((data, index) => (
            <ArtItem
              key={index}
              data={data}
              owner={params.addr}
              index={index}
              setPopup={setPopup}
              setPopupData={setPopupData}
            />
          ))}
        </Masonry>
      ) : !artFetching && (
        <div className="text-center my-6 flex flex-center gap-3">
          <h1 className='font-display text-xl font-bold text-gray-500 sm:text-3xl'>
            {session?.user?.name === params.addr ? "No artwork yet ?" : `No artwork yet`}
          </h1>
          <img
            src='/assets/icons/point-right.svg'
            alt='right'
            width={45}
            height={45}
            className='object-contain opacity-75'
          />
          <a href={session?.user?.name === params.addr ? "/create" : "/"}
            className='outline_btn'
          >{session?.user?.name === params.addr ? "Create" : "Explore Others"}</a>
        </div>
      )}

      <div className='mt-12 mb-6 text-center'>
        <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
          {session?.user?.name === params.addr ? "Your " : `User's `}
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
      {promptList.length > 0 ? (
        <Masonry columnsCount={3} gutter="1rem" className="mb-6">
          {promptList.map((data, index) => (
            <PromptCard data={data} index={index} key={index} />
          ))}
        </Masonry>
      ) : !promptFetching && (
        <div className="text-center my-6 flex-center gap-3">
          <h1 className='font-display text-xl font-bold text-gray-500 sm:text-3xl'>
            {session?.user?.name === params.addr ? "No prompt yet ?" : `No prompt yet`}
          </h1>
          <img
            src='/assets/icons/point-right.svg'
            alt='right'
            width={45}
            height={45}
            className='object-contain opacity-75'
          />
          <a href={session?.user?.name === params.addr ? "/create" : "/"}
            className='black_btn'
          >{session?.user?.name === params.addr ? "Create" : "Explore Others"}</a>
        </div>
      )}
    </section>
  )
}

export default Profile