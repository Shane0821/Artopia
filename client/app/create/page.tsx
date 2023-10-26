"use client"
import React from 'react';

import { LaptopOutlined, NotificationOutlined, UserOutlined, FormatPainterOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Space, Button } from 'antd';

const { Content, Sider } = Layout;

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,

            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const Create = () => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Layout>
                <Content style={{ padding: '0 0px' }}>
                    <Layout style={{ padding: '24px 0', background: "white" }}>
                        <div style={{
                            height: 600,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            Generate
                            {/* Left Part */}
                            <Sider style={{ background: "white" }} width={350}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    style={{ height: '100%' }}
                                    items={items2}
                                />
                            </Sider>

                            <Button style={{
                                width: 300,
                                height: 55,
                                position: 'absolute',
                                backgroundColor: "white",
                                bottom: 10
                            }}>
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