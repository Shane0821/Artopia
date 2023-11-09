'use client'

import React, { useState, useEffect } from 'react';
import {
    Layout, notification, Spin, Space
} from 'antd';

import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import GalleryItem from '@app/publicGallery/GalleryItem'

import Masonry from "react-responsive-masonry"

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

import Detail from '@app/publicGallery/GalleryDetail'

function PublicGalery() {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);
    const [popup, setPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [fetching, setFetching] = useState(false);

    const [userConnected, setUserConnected] = useState(false);

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
                            'Welcome to gallery.',
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
                spinning={(!(isConnected && session?.user)) || fetching}
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
