"use client"
import React, { useState } from 'react';

import './style.css'

import SidebarCreate from '@components/SidebarCreate'

import {
    FormatPainterOutlined
} from '@ant-design/icons';
import { Layout, Space, Button } from 'antd';

const { Content } = Layout;

const Create = () => {
    const [generating, setGenerating] = useState(false);

    const handleClick = () => {
        console.log('handleclick', generating)
        setGenerating(true);
    };

    const resetGenerating = () => {
        setGenerating(false);
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
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