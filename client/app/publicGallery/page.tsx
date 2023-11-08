'use client'

import React, { useState, useEffect } from 'react';
import {
    Layout, notification, Spin, Tooltip, Button, Space
} from 'antd';

import { LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import Masonry from "react-responsive-masonry"

const { Content } = Layout;

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

import Detail from '@app/create/Detail'

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

                    const response = await fetch(`/api/create/`, {
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
                {dataArray.map((data: any, index) => (
                    <div
                        className="publicPics relative group"
                        key={index}
                        onClick={() => {
                            console.log('click')
                            setPopup(true);
                            setPopupData(data);
                        }}
                    > {/* Add relative and group classes */}
                        <img
                            className="no-visual-search"
                            style={{ width: '100%' }}
                            src={`${data.base64}`}
                        />

                        {/* buttons */}
                        < div
                            hidden={!data.completed}
                            className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Tooltip placement="bottomLeft" title={data.shared ? "Private" : "Make public"}>
                                {data.shared ? (
                                    <Button className="buttonStyle" icon={<EyeInvisibleOutlined />} />
                                ) : (
                                    <Button className="buttonStyle" icon={<EyeOutlined />} /> // Public icon
                                )}
                            </Tooltip>
                        </div>
                    </div>
                ))
                }
            </Masonry >
        </Space >
    );
}

export default PublicGalery;
