"use client"

import React, { useState, useEffect } from 'react';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import PromptCard from '@components/profile/PromptCard'
import Masonry from "react-responsive-masonry"

import { getTotalPromptCount, getPromptTokenIdByIndex, getTokenURIOfPromptByTokenId } from '@utils/contract'

interface promptDataType {
    tokenId: number,
    cid: string
    prompt: string,
    negative_prompt: string
}

function page() {
    const [promptFetching, setPromptFetching] = useState(true);
    const [promptList, setPromptList] = useState<promptDataType[]>([])

    const promptByIndex = async (index: number) => {
        try {
            // get token id
            const promptId = await getPromptTokenIdByIndex(index)

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

        const loadPrompt = async () => {
            try {
                // get prompt nft count
                const cntPrompt = await getTotalPromptCount()

                // fetch all
                var promptList: promptDataType[] = []
                if (cntPrompt > 0) {
                    for await (const prompt of Array.from({ length: cntPrompt },
                        (_, index) => promptByIndex(index))) {
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

        const timerId = setTimeout(() => {
            loadPrompt()
        }, 2000)

        return () => clearTimeout(timerId);
    }, []);

    return (
        <section className="w-full max-w-7xl flex-center flex-col sm:px-16 px-6">
            <div className='mt-12 mb-6 text-center'>
                <h2 className='font-display text-4xl font-extrabold leading-tight text-black sm:text-5xl sm:leading-tight'>
                    <span className="bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400 bg-clip-text text-transparent">
                        {"Explore Prompts"}
                    </span>
                </h2>
                <p className="mt-4 text-gray-600 sm:text-lg">Embark on a Journey of Discovery: Ignite Your Imagination.</p>
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
                        {`No prompt yet`}
                    </h1>
                    <img
                        src='/assets/icons/point-right.svg'
                        alt='right'
                        width={45}
                        height={45}
                        className='object-contain opacity-75'
                    />
                    <a href={"/create"}
                        className='black_btn'
                    >{"Create"}</a>
                </div>
            )}
        </section>
    )

}

export default page