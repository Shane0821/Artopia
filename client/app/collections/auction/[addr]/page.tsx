'use client'

import React, { useState, useEffect } from 'react';

import { Divider, Space, Button, Statistic, notification, Spin, Badge, InputNumber } from 'antd';
const { Countdown } = Statistic;

import { LoadingOutlined, AlertOutlined, HighlightOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import Detail from '@components/profile/ArtDetail'
import '@styles/auction.css'

import {
    getAuctionTokenId,
    getBeneficiary, getTokenURIOfArtByTokenId,
    getPromptOwnerByCID,
    getHighestBid, isAuctionEnded
} from '@utils/contract';

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
    height: number,
    beneficiary: string,
    promptOwner: string
}

function truncateMiddle(str: string, frontChars: number, backChars: number, ellipsis = '...') {
    if (!str) return str;
    if (str.length <= frontChars + backChars) {
        return str;
    }
    var frontStr = str.substring(0, frontChars);
    var backStr = str.substring(str.length - backChars);
    return frontStr + ellipsis + backStr;
}

function Bid({ params }: { params: { addr: string } }) {
    const [fetching, setFetching] = useState(false);
    const [nftData, setNftData] = useState({});

    const [bid, setBid] = useState(2)

    const [popup, setPopup] = useState(false);

    // fetch art
    useEffect(() => {
        const fetchData = async () => {
            if (!fetching) {
                try {
                    console.log("fetching..")
                    setFetching(true);

                    const artId = await getAuctionTokenId(params.addr);

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

                    let artData: artDataType = {
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
                        height: 0,
                        beneficiary: "",
                        promptOwner: ""
                    };
                    artData.name = data.name
                    artData.description = data.description
                    artData.cid = data.image.split("ipfs://")[1] ? data.image.split("ipfs://")[1] : data.image.split("ipfs://")[0] // should be 1
                    artData.beneficiary = await getBeneficiary(params.addr)

                    data.attributes?.forEach((attribute: any) => {
                        switch (attribute.trait_type) {
                            case 'Model':
                                artData.model = attribute.value;
                                break;
                            case 'Prompt':
                                artData.promptcid = attribute.value.split("ipfs://")[1] ? attribute.value.split("ipfs://")[1] : attribute.value.split("ipfs://")[0]; // // should be 1
                                break;
                            case 'Steps':
                                artData.steps = attribute.value;
                                break;
                            case 'GuidanceScale':
                                artData.guidance = attribute.value;
                                break;
                            case 'Seed':
                                artData.seed = attribute.value;
                                break;
                            case 'Sampler':
                                artData.sampler = attribute.value;
                                break;
                            case 'CreatedAt':
                                artData.created_at = attribute.value;
                                break;
                            case 'Height':
                                artData.height = attribute.value;
                                break;
                            case 'Width':
                                artData.width = attribute.value;
                                break;
                        }
                    })

                    {
                        // fetch prompt by cid
                        const promptURI = 'https://ipfs.io/ipfs/' + artData.promptcid
                        console.log(promptURI)
                        const response = await fetch(promptURI, {
                            method: 'GET'
                        })
                        if (!response.ok) {
                            const message = `An error has occurred: ${response.status}`;
                            throw new Error(message);
                        }
                        const data = await response.json();
                        artData.prompt = data.textData.prompt
                        artData.negative_prompt = data.textData.negative_prompt
                        artData.promptOwner = await getPromptOwnerByCID(artData.promptcid)
                    }

                    setNftData(artData);
                    setFetching(false);
                } catch (error) {
                    setFetching(false);
                }
            } else {
                setNftData({});
            }
        };
        // console.log(userConnected)
        fetchData();
    }, []);

    return (
        <Space
            direction="vertical"
            style={{ width: '100%' }}
            className="sm:px-16 px-6 max-w-7xl"
        >
            <div
                className="flex border p-4 m-4 rounded shadow-lg flex-col justify-between"
                style={{
                    height: '85vh',
                    backgroundColor: 'white'
                }}
            >
                {
                    fetching
                    &&
                    <Spin
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '90vh' // This will make the div take up the full viewport height}}
                        }}
                        indicator={antIcon}
                        spinning={fetching}
                    />
                }
                {
                    !fetching
                    &&
                    <div className="w-full flex">
                        <Detail popup={popup} setPopup={setPopup} data={nftData} />

                        <div
                            className="w-1/3"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                className="rounded auction_pic"
                                src={`https://ipfs.io/ipfs/${nftData.cid}`}
                                alt="Nft"
                                onClick={() => { setPopup(true); }}
                            />
                        </div>

                        <div style={{ borderLeft: '1px solid lightgray', height: '80vh' }}></div>

                        <div className="w-2/3 p-4 flex flex-col justify-center items-center" style={{ height: '85vh' }}>
                            <Divider />

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <h2>
                                    <span className="owner-title">
                                        <HighlightOutlined /> NFT owner:
                                    </span>
                                    <a className="owner-link" href={`/profile/${nftData.beneficiary}`}>
                                        {truncateMiddle(nftData.beneficiary, 9, 9)}
                                    </a>
                                </h2>
                                <h2>
                                    <span className="owner-title">
                                        <AlertOutlined /> Prompt owner:
                                    </span>
                                    <a className="owner-link" href={`/profile/${nftData.promptOwner}`}>
                                        {truncateMiddle(nftData.promptOwner, 9, 9)}
                                    </a>
                                </h2>
                            </div>


                            <Divider />

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#ff6347',
                                fontSize: '1.2em',
                                textAlign: 'center',
                                padding: '10px',
                                border: '2px solid #ff6347',
                                borderRadius: '10px',
                                backgroundColor: '#ffe4e1'
                            }}>
                                <div>🔥 Sale Ends In:</div>
                                <Countdown
                                    value={Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30}
                                    format="HH:mm:ss"
                                    style={{
                                        marginLeft: '10px',
                                        fontFamily: '"Courier New", Courier, monospace',
                                        fontWeight: 400,
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <Divider />

                            <div>
                                <h2>
                                    <span className="owner-title">✨ Current Highest Price:</span>
                                    <a className="owner-link">
                                        {`10 AXM`}
                                    </a>
                                </h2>
                            </div>

                            <Divider />

                            <div className="flex justify-center">
                                <InputNumber
                                    min={2}
                                    step={0.1}
                                    value={bid}
                                    onChange={(e) => { setBid(Number(e)); }}
                                    placeholder="Enter your bid"
                                    className="mr-2"
                                    style={{ width: '200px', marginRight: 20 }}
                                />
                                <Button>Bid</Button>
                            </div>


                            <Divider />

                            <div className="flex justify-center">
                                <Button className="mr-2">Withdraw</Button>
                                <Button className="mr-2">Close</Button>
                            </div>

                            <Divider />
                        </div>


                    </div>
                }
            </div>
        </Space >
    );
}

export default Bid;