import React, { useState, useEffect } from 'react';
import {
    Layout, Select, Slider, Input,
    Collapse, Divider, Image, Space, notification
} from 'antd';
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
            setDataArray(prevArray => [...prevArray, jsonData]);
        }
    }, [jsonData]);

    return (
        <Content style={{ padding: '0 24px', height: 600, overflowY: 'auto' }}>
            Content
            <div>
                {dataArray.map((data, index) => (
                    <div key={index}>
                        {JSON.stringify(data)}
                        {/* Display your data here */}
                    </div>
                ))}
            </div>
        </Content>
    );
}

export default ContentCreate;
