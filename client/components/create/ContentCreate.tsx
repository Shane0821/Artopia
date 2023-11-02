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

function ContentCreate({ }) {
    const [noti, contextHolder] = notification.useNotification();
    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    return (
        <Content style={{ padding: '0 24px', height: 600, overflowY: 'auto' }}>
            Content
        </Content>
    );
}

export default ContentCreate;
