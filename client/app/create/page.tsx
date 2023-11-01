"use client"
import React, { useState } from 'react';

import './style.css'

import SidebarCreate from '@components/SidebarCreate'

import {
    FormatPainterOutlined
} from '@ant-design/icons';
import { Layout, Space, Button } from 'antd';

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

const { Content } = Layout;

const Create = () => {
    const [generating, setGenerating] = useState(false);
    const [cooldown, setCooldown] = useState(false);

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const handleClick = () => {
        console.log('handleclick', generating)
        setGenerating(true);

        setCooldown(true);
        setTimeout(() => {
            setCooldown(false);
        }, 6000);
    };

    const resetGenerating = () => {
        setGenerating(false);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }} className="sm:px-16 px-6 max-w-7xl">
            <Layout>
                <Content style={{ padding: '0 0px' }}>
                    <Layout style={{ padding: '24px 0', background: "white" }}>
                        <div className="hide-scrollbar" style={{
                            height: 550,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            Generate
                            {/* Left Part */}
                            <SidebarCreate
                                generating={generating}
                                resetGenerating={resetGenerating}
                            />
                            {/* <Menu
                                    onClick={onClick}
                                    style={{ width: 350 }}
                                    items={items}
                                    mode="inline"
                                /> */}
                            {/* <SidebarCreate /> */}

                            <Button
                                style={{
                                    width: 300,
                                    height: 55,
                                    position: 'absolute',
                                    backgroundColor: "white",
                                    bottom: 10
                                }}
                                loading={generating || cooldown || (!(isConnected && session?.user))}
                                onClick={handleClick}
                            >
                                Generate Image
                                <FormatPainterOutlined />
                            </Button>
                        </div>

                        <Content style={{ padding: '0 24px', height: 600, overflowY: 'auto' }}>
                            Content
                        </Content>
                    </Layout>
                </Content>
            </Layout >
        </Space >
    )
}

export default Create