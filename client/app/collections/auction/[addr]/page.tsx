'use client'

import React, { useState, useEffect } from 'react';

import { Divider, Space, Button, Statistic, notification, Spin, Badge, InputNumber } from 'antd';
const { Countdown } = Statistic;

import { LoadingOutlined, AlertOutlined, HighlightOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import Detail from '@components/profile/ArtDetail'
import '@styles/auction.css'

function truncateMiddle(str: string, frontChars: number, backChars: number, ellipsis = '...') {
    if (!str) return str;
    if (str.length <= frontChars + backChars) {
        return str;
    }
    var frontStr = str.substring(0, frontChars);
    var backStr = str.substring(str.length - backChars);
    return frontStr + ellipsis + backStr;
}

function Bid() {
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

                    const response = await fetch(`/api/publicGallery/`, {
                        method: 'GET'
                    });

                    // Handle the response
                    if (!response.ok) {
                        const message = `An error has occurred: ${response.status}`;
                        throw new Error(message);
                    }

                    const data = await response.json();

                    setNftData(data[0])
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
                                src={nftData.base64}
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
                                    <a className="owner-link" href={`/profile/${nftData.address}`}>
                                        {truncateMiddle(nftData.address, 9, 9)}
                                    </a>
                                </h2>
                                <h2>
                                    <span className="owner-title">
                                        <AlertOutlined /> Prompt owner:
                                    </span>
                                    <a className="owner-link" href={`/profile/${nftData.address}`}>
                                        {truncateMiddle(nftData.address, 9, 9)}
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