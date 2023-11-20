'use client'

import React, { useState, useEffect } from 'react';
import {
    Select, notification, Spin, Space, Carousel
} from 'antd';

const { Option } = Select;

import { LoadingOutlined, ClockCircleOutlined, LikeOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import GalleryItem from '@components/publicGallery/GalleryItem'
import CollectionCarousel from '@components/collections/carousel'

import Masonry from "react-responsive-masonry"

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

import Detail from '@components/publicGallery/GalleryDetail'

function PublicGalery() {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);
    const [popup, setPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [fetching, setFetching] = useState(false);

    const [currentSlide, setCurrentSlide] = useState(0);

    // fetch art
    useEffect(() => {
        const fetchData = async () => {
            if (!fetching) {
                try {
                    console.log("fetching..")
                    setFetching(true);

                    noti['info']({
                        message: 'Message:',
                        description:
                            'Fetching art...',
                        duration: 3,
                    });

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

                    noti['success']({
                        message: 'Message:',
                        description:
                            'Welcome to public gallery.',
                        duration: 3,
                    });
                } catch (error) {
                    noti['error']({
                        message: 'Message:',
                        description:
                            `${error}`,
                        duration: 3,
                    });
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
        else if (value === 'likes') {
            setDataArray(prevArray => {
                let newArray = [...prevArray];
                newArray.sort((a, b) => b.likes - a.likes);
                return newArray;
            });
        } else if (value === 'views') {
            setDataArray(prevArray => {
                let newArray = [...prevArray];
                newArray.sort((a, b) => b.views - a.views);
                return newArray;
            });
        }
    }

    return (
        <Space
            direction="vertical"
            style={{
                width: '100%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="sm:px-16 px-6 max-w-7xl"
        >
            <Detail popup={popup} setPopup={setPopup} data={popupData} />


            <CollectionCarousel setCurrentSlide={setCurrentSlide} />


            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 30,
                    marginBottom: -10,
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
                    <Option value="likes"><LikeOutlined /> Likes</Option>
                    <Option value="views"><EyeOutlined /> View</Option>
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
                    <GalleryItem
                        key={index}
                        data={data}
                        index={index}
                        setPopup={setPopup}
                        setPopupData={setPopupData}
                        user={session?.user}
                    />
                ))}
            </Masonry>
        </Space >
    );
}

export default PublicGalery;
