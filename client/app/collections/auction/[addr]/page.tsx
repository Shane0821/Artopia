'use client'

import React, { useState, useEffect } from 'react';

import { Layout, Space, Button, notification, Spin, Badge } from 'antd';

import { LoadingOutlined, ClockCircleOutlined, LikeOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

function Bid() {
    const [fetching, setFetching] = useState(false);
    const [nftData, setNftData] = useState({});

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
                        <div
                            className="w-1/3"
                            style={{
                                height: '85vh',
                                display: 'flex', // Add this line
                                flexDirection: 'column', // Add this line
                                justifyContent: 'center', // Add this line
                            }}
                        >
                            <img
                                className="rounded"
                                src={nftData.base64}
                                alt="Nft"
                            />
                        </div>

                        <div className="w-2/3 p-4">
                            <h2 className="text-xl font-bold mb-2">Art Title</h2>
                            <p className="text-gray-700">Detailed info about the art...</p>
                            <div className="mt-4 flex justify-end">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                                    Button 1
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Button 2
                                </button>
                            </div>
                        </div>

                    </div>
                }
            </div>
        </Space>
    );
}

export default Bid;