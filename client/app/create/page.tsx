"use client"
import React, { useState, useEffect } from 'react';

import '@styles/create.css'

import SidebarCreate from '@app/create/Sidebar'
import ContentCreate from '@app/create/Content'

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
    const [fetching, setFetching] = useState(false);

    const { data: session, status } = useSession();
    const { address, isConnected } = useAccount();

    const [jsonData, setJsonData] = useState(null);


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
        <Space direction="vertical" style={{ width: '100%' }} className="sm:px-16 px-6 max-w-7xl" >
            {
                (isConnected && session?.user) ?
                    (<Layout>
                        <Content style={{ padding: '0 0px' }}>
                            <Layout style={{ padding: '24px 0', background: "white", height: '100vh' }}>
                                <div className="hide-scrollbar" style={{
                                    height: '73vh',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderBottom: '1px solid rgba(128, 128, 128, 0.1)',
                                }}>
                                    Generate
                                    {/* Left Part */}
                                    <SidebarCreate
                                        generating={generating}
                                        resetGenerating={resetGenerating}
                                        setJsonData={setJsonData}
                                    />

                                    <Button
                                        style={{
                                            width: 300,
                                            height: '8vh',
                                            position: 'absolute',
                                            backgroundColor: "white",
                                            top: '88vh'
                                        }}
                                        loading={generating || cooldown || (!(isConnected && session?.user)) || fetching}
                                        onClick={handleClick}
                                    >
                                        Generate Image
                                        <FormatPainterOutlined />
                                    </Button>
                                </div>

                                <ContentCreate jsonData={jsonData} setFetching={setFetching} fetching={fetching} />

                            </Layout>
                        </Content>
                    </Layout >)
                    : (<></>)
            }
        </Space >
    )
}

export default Create