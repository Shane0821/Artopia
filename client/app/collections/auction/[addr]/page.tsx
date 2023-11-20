'use client'

import React, { useState, useEffect } from 'react';

import { Divider, Space, Button, Statistic, notification, Spin, Badge } from 'antd';
const { Countdown } = Statistic;

import { LoadingOutlined, ClockCircleOutlined, LikeOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import Detail from '@components/profile/ArtDetail'
import '@styles/auction.css'

function Bid() {
    const [fetching, setFetching] = useState(false);
    const [nftData, setNftData] = useState({});

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

                            <Countdown
                                title="Sale Ends In:"
                                value={Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30}
                                format="HH:mm:ss"
                            />

                            <Divider />
                            <hr className="mt-4" />

                            <div className="mt-4">
                                <h2>Current Highest Price: 10 AXM</h2>
                            </div>

                            <Divider />
                            <hr className="mt-4" />

                            <div className="mt-4 flex justify-center">
                                <Button className="mr-2">Bid</Button>
                                <Button className="mr-2">Withdraw</Button>
                                <Button className="mr-2">Close</Button>
                            </div>

                            <Divider />
                        </div>


                    </div>
                }
            </div>
        </Space>
    );
}

export default Bid;