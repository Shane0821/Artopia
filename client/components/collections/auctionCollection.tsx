'use client'

import React, { useState, useEffect } from 'react';
import {
    Select, notification, Spin
} from 'antd';

const { Option } = Select;

import { LoadingOutlined, ClockCircleOutlined, LikeOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import AuctionCollectionItem from '@components/collections/auctionCollectionItem'

import Masonry from "react-responsive-masonry"

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

function AuctionCollection() {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);
    const [fetching, setFetching] = useState(false);

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

                    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    data.forEach(item => {
                        if (item) {
                            item.completed = true;
                        }
                    });

                    setDataArray(data)
                    setFetching(false);
                } catch (error) {
                    setFetching(false);
                }
            } else {
                setDataArray(prevArray => []);
            }
        };
        // console.log(userConnected)
        fetchData();
    }, []);

    const handleSelectChange = (value: string) => {
        if (value === 'latest') {
            setDataArray(prevArray => {
                let newArray = [...prevArray];
                newArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                return newArray;
            })
        }
        else if (value === 'earliest') {
            console.log(value);
            setDataArray(prevArray => {
                let newArray = [...prevArray];
                newArray.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                return newArray;
            });
        }
        else if (value === 'price') {
            setDataArray(prevArray => {
                let newArray = [...prevArray];
                newArray.sort((a, b) => b.price - a.price);
                return newArray;
            });
        }
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 30,
                    marginBottom: 7,
                    opacity: 0.8
                }}
            >
                <Select
                    defaultValue="latest"
                    style={{
                        width: 240,
                        marginRight: 5
                    }}
                    onChange={handleSelectChange}
                >
                    <Option value="latest"><ClockCircleOutlined /> Latest</Option>
                    <Option value="earliest"><DashboardOutlined /> Earliest</Option>
                    <Option value="price"><LikeOutlined /> Price</Option>
                </Select>
            </div>


            {contextHolder}
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

            <Masonry className="gallery" columnsCount={4}>
                {dataArray.map((data, index) => (
                    <AuctionCollectionItem
                        key={index}
                        data={data}
                        index={index}
                        user={session?.user}
                    />
                ))}
            </Masonry>
        </div>
    );
}

export default AuctionCollection;