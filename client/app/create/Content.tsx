import React, { useState, useEffect } from 'react';
import {
    Layout, Select, Slider, Input,
    Collapse, Divider, Image, Space, notification
} from 'antd';

import '@styles/gallery.css'
import Masonry from "react-responsive-masonry"

import {
    UpOutlined, DownOutlined, HighlightOutlined,
    FullscreenOutlined, UnorderedListOutlined,
    PieChartOutlined, SketchOutlined
} from '@ant-design/icons';


const { Content } = Layout;

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

interface ContentCreateProps {
    jsonData: any;
}

function ContentCreate({ jsonData }: ContentCreateProps) {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);

    const [userConnected, setUserConnected] = useState(false);

    // Use useEffect to update the array whenever jsonData changes
    React.useEffect(() => {
        if (jsonData) {
            if (!jsonData.completed) {
                setDataArray(prevArray => [jsonData, ...prevArray]);
            } else {
                setDataArray((prevArray) => {
                    return [jsonData, ...prevArray.slice(1)];
                });
            }
        }
    }, [jsonData]);

    // Use useEffect to check connection whenever isConnected and session?.user change
    // prevent double get requests
    useEffect(() => {
        if (isConnected && session?.user) {
            setUserConnected(true);
        }
        else {
            setUserConnected(false);
        }
    }, [isConnected, session?.user]);

    useEffect(() => {
        const fetchData = async () => {
            if (userConnected && session?.user) {
                console.log("fetching..")
                const response = await fetch(`/api/create/${session?.user.name}`);
                const data = await response.json();

                data.forEach(item => {
                    if (item) {
                        item.completed = true;
                    }
                });

                setDataArray(data)

                console.log(data)
                // setDataArray(data.art);
            }
        };
        console.log(userConnected)
        fetchData();
    }, [userConnected]);


    return (
        <Content className="hide-scrollbar" style={{
            padding: '0 24px',
            height: 600,
            overflowY: 'auto'
        }}>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                Generative Arts
            </div>

            <Masonry className="gallery" columnsCount={3}>
                {dataArray.map((data: any, index) => (
                    <div className="pics" key={index}>
                        <img
                            style={{ borderRadius: '6px', width: '100%' }}
                            src={`${data.base64}`}
                        />
                    </div>
                ))}
            </Masonry>

        </Content >
    );
}

export default ContentCreate;
