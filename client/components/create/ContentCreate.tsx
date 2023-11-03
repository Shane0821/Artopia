import React, { useState, useEffect } from 'react';
import {
    Layout, Select, Slider, Input,
    Collapse, Divider, Image, Space, notification
} from 'antd';

import '@styles/gallery.css'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { Row, Col, Card } from 'antd';

import {
    UpOutlined, DownOutlined, HighlightOutlined,
    FullscreenOutlined, UnorderedListOutlined,
    PieChartOutlined, SketchOutlined
} from '@ant-design/icons';


const { Content } = Layout;

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"
import { AnyARecord } from 'dns';

interface ContentCreateProps {
    jsonData: any;
}

function ContentCreate({ jsonData }: ContentCreateProps) {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);

    // Use useEffect to update the array whenever jsonData changes
    React.useEffect(() => {
        if (jsonData) {
            if (!jsonData.completed) {
                console.log(jsonData)
                setDataArray(prevArray => [jsonData, ...prevArray]);
            } else {
                setDataArray((prevArray) => {
                    prevArray[0] = jsonData
                    return prevArray;
                });
            }
        }
    }, [jsonData]);

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
