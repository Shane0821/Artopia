'use client'

import React, { useState, useEffect } from 'react';

import { Divider, Space, Button, Statistic, notification, Spin, Badge, InputNumber } from 'antd';
const { Countdown } = Statistic;

import { LoadingOutlined, AlertOutlined, HighlightOutlined, SyncOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import Detail from '@components/profile/ArtDetail'
import '@styles/auction.css'
import { redirect } from 'next/navigation'

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

import {
    getAuctionTokenId,
    getBeneficiary, getTokenURIOfArtByTokenId,
    getPromptOwnerByCID, getAuctionEndTime,
    bid, getPendingReturns,
    getHighestBid, endAuction, withdrawOverBid,
    getArtApprovedByTokenId, approveArt,
    isAuctionEnded
} from '@utils/contract';

interface auctionDataType {
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
    promptOwner: string,
    endTime: number,
    highestBid: number,
    pendingReturn: number,
    isEnded: boolean
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
    const [noti, contextHolder] = notification.useNotification();
    const [fetching, setFetching] = useState(true);
    const [reFetching, setReFetching] = useState(false);
    const [nftData, setNftData] = useState({});

    const { data: session, status } = useSession();
    const { address, isConnected } = useAccount();
    const [userConnected, setUserConnected] = useState(false);

    useEffect(() => {
        if (isConnected && session?.user) {
            setUserConnected(true);
        }
        else {
            setUserConnected(false);
        }
    }, [isConnected, session?.user]);

    const [bidPrice, setBidPrice] = useState(2);
    const [bidding, setBidding] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [ending, setEnding] = useState(false);
    const [popup, setPopup] = useState(false);

    const fetchData = async () => {
        if (!fetching) {
            try {
                console.log("fetching..")
                setFetching(true);

                const artId = await getAuctionTokenId(params.addr);

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

                let auctionData: auctionDataType = {
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
                    promptOwner: "",
                    endTime: 0,
                    highestBid: 2,
                    pendingReturn: 0,
                    isEnded: false
                };
                auctionData.name = data.name
                auctionData.description = data.description
                auctionData.cid = data.image.split("ipfs://")[1] ? data.image.split("ipfs://")[1] : data.image.split("ipfs://")[0] // should be 1
                auctionData.beneficiary = await getBeneficiary(params.addr)

                const currentTimestampInSeconds = Math.floor(new Date().getTime() / 1000);
                auctionData.endTime = Number(await getAuctionEndTime(params.addr)) - currentTimestampInSeconds
                auctionData.isEnded = await isAuctionEnded(params.addr);

                data.attributes?.forEach((attribute: any) => {
                    switch (attribute.trait_type) {
                        case 'Model':
                            auctionData.model = attribute.value;
                            break;
                        case 'Prompt':
                            auctionData.promptcid = attribute.value.split("ipfs://")[1] ? attribute.value.split("ipfs://")[1] : attribute.value.split("ipfs://")[0]; // // should be 1
                            break;
                        case 'Steps':
                            auctionData.steps = attribute.value;
                            break;
                        case 'GuidanceScale':
                            auctionData.guidance = attribute.value;
                            break;
                        case 'Seed':
                            auctionData.seed = attribute.value;
                            break;
                        case 'Sampler':
                            auctionData.sampler = attribute.value;
                            break;
                        case 'CreatedAt':
                            auctionData.created_at = attribute.value;
                            break;
                        case 'Height':
                            auctionData.height = attribute.value;
                            break;
                        case 'Width':
                            auctionData.width = attribute.value;
                            break;
                    }
                })

                {
                    // fetch prompt by cid
                    const promptURI = 'https://tan-bright-gibbon-975.mypinata.cloud/ipfs/' + auctionData.promptcid
                    console.log(promptURI)
                    const response = await fetch(promptURI, {
                        method: 'GET'
                    })
                    if (!response.ok) {
                        const message = `An error has occurred: ${response.status}`;
                        throw new Error(message);
                    }
                    const data = await response.json();
                    auctionData.prompt = data.textData.prompt
                    auctionData.negative_prompt = data.textData.negative_prompt
                    auctionData.promptOwner = await getPromptOwnerByCID(auctionData.promptcid)
                }

                auctionData.highestBid = await getHighestBid(params.addr);
                setBidPrice(Math.max(1.9, auctionData.highestBid) + 0.1);

                auctionData.pendingReturn = await getPendingReturns(params.addr, session?.user.name);

                setNftData(auctionData);
                setFetching(false);
                setReFetching(false);
            } catch (error) {
                console.log(error);
            }
        } else {
            setNftData({});
        }
    };

    // fetch art
    useEffect(() => {
        // console.log(userConnected)
        if (userConnected && session?.user) fetchData();
    }, [userConnected]);

    const handleReFetch = () => {
        if (userConnected && session?.user) {
            setReFetching(true);
            fetchData();
        }
    }

    useEffect(() => {
        if (isConnected && session?.user) {
            setFetching(false);
        }
        else {
            setFetching(true);
        }
        if (!isConnected) {
            redirect('/');
        }
    }, [isConnected, session?.user])

    useEffect(() => {
        if (isConnected && session?.user) {
            setFetching(false);
        }
        else {
            setFetching(true);
        }
        if (!isConnected) {
            redirect('/');
        }
    }, [isConnected, session?.user])

    const handleBid = () => {
        const _bid = async () => {
            try {
                await bid(params.addr, bidPrice);

                setNftData(prevData => {
                    return { ...prevData, highestBid: bidPrice };
                })
                setBidding(false);
            } catch (error) {
                console.log(error)
                setBidding(false)
            }
        }

        if (!bidding) {
            setBidding(true);
            _bid();
        }
    }

    const handleEndAuction = async () => {
        setEnding(true)
        try {
            const approved = await getArtApprovedByTokenId(nftData.tokenId)
            if (approved !== params.addr) {
                await approveArt(params.addr, nftData.tokenId);
            }
            await endAuction(params.addr);
            setNftData(prevData => {
                return { ...prevData, isEnded: true };
            })
            noti['success']({
                message: 'Message:',
                description:
                    `Successfully ended auction!`,
                duration: 3,
            });
        } catch (error) {
            console.log(error)
            noti['error']({
                message: 'Message:',
                description:
                    `Failed to end auction!`,
                duration: 3,
            });
        }
        setEnding(false)
    }

    const handleWithdraw = async () => {
        setWithdrawing(true)
        try {
            await withdrawOverBid(params.addr);
            noti['success']({
                message: 'Message:',
                description:
                    `Successfully withdrew  ${nftData.pendingReturn} AXM :)`,
                duration: 3,
            });
            setNftData(prevData => {
                return { ...prevData, pendingReturn: 0 };
            })
        } catch (error) {
            console.log(error)
            noti['error']({
                message: 'Message:',
                description:
                    `Failed to withdraw!`,
                duration: 3,
            });
        }
        setWithdrawing(false)
    }

    return (
        <Space
            direction="vertical"
            style={{ width: '100%' }}
            className="sm:px-16 px-6 max-w-7xl"
        >
            {contextHolder}
            <div
                className="flex border p-4 m-4 rounded shadow-lg flex-col justify-between"
                style={{
                    height: '85vh',
                    backgroundColor: 'white'
                }}
            >
                {
                    (fetching && !reFetching)
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
                    !(fetching && !reFetching)
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
                                src={`https://tan-bright-gibbon-975.mypinata.cloud/ipfs/${nftData.cid}`}
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
                                        <HighlightOutlined /> Auction seller:
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
                                    value={Date.now() + nftData.endTime * 1000}
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
                                        {`${nftData.highestBid} AXM`}
                                    </a>
                                    <Button
                                        title="fetch"
                                        style={{ marginLeft: 10 }}
                                        icon={<SyncOutlined />}
                                        onClick={() => { handleReFetch() }}
                                        loading={reFetching}
                                    >
                                    </Button>
                                </h2>
                            </div>

                            <Divider />

                            <div className="flex justify-center">
                                <InputNumber
                                    min={Math.max(1.9, nftData.highestBid) + 0.1}
                                    step={0.1}
                                    value={bidPrice}
                                    onChange={(e) => { setBidPrice(Number(e)); }}
                                    placeholder="Enter your bid"
                                    className="mr-2"
                                    precision={1}
                                    style={{ width: '200px', marginRight: 20 }}
                                />
                                <Button
                                    title={nftData.endTime <= 0 ? "Auction is closed" : "Bid"}
                                    onClick={() => { handleBid(); }}
                                    loading={bidding}
                                    disabled={!session?.user || nftData.endTime <= 0 || session?.user.name === nftData.beneficiary}
                                >
                                    Bid
                                </Button>
                            </div>


                            <Divider />

                            <div className="flex justify-center">
                                <Button
                                    hidden={nftData.pendingReturn === 0}
                                    className="mr-2"
                                    onClick={() => { handleWithdraw(); }}
                                    loading={withdrawing}
                                >
                                    Withdraw
                                </Button>
                                <Button
                                    className="mr-2"
                                    hidden={nftData.endTime > 0 || session?.user.name != nftData.beneficiary}
                                    onClick={() => { handleEndAuction(); }}
                                    loading={ending}
                                    disabled={nftData.isEnded}
                                >
                                    Close
                                </Button>
                            </div>

                            {
                                (
                                    (nftData.endTime <= 0 && session?.user.name === nftData.beneficiary)
                                    ||
                                    (nftData.pendingReturn === 0)
                                )
                                &&
                                <Divider />
                            }
                        </div>


                    </div>
                }
            </div>
        </Space >
    );
}

export default Bid;