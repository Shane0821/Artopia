"use client"
import React from 'react';

import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Space, Button } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

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
                        <div style={{ height: 600, overflowY: 'auto' }}>
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

                            <Button icon={<UserOutlined />} style={{ position: 'absolute', bottom: 40 }}>
                                Generate Image
                            </Button>
                        </div>

                        <Content style={{ padding: '0 24px', height: 600 }}>
                            Content
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </Space>
    )
}

export default Create