"use client"
import React from 'react';

import SidebarCreate from '@components/SidebarCreate'

import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
    FormatPainterOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Space, Button, Input } from 'antd';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Model:', 'sub1', <MailOutlined />, [
        getItem('Item 2', null, null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
    ]),

    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
        getItem('Option 5', '5'),
        getItem(
            <div>
                <span>Prompt:</span>
                <Input.TextArea
                    rows={5}
                    autoSize={{ minRows: 5, maxRows: 10 }}
                />
            </div>,
            '6'),
        getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),

    getItem('Navigation Three', 'sub4', <SettingOutlined />, [
        getItem('Option 9', '9'),
        getItem('Option 10', '10'),
        getItem('Option 11', '11'),
        getItem('Option 12', '12'),
    ]),
];

const onClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
};

const Create = () => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Layout>
                <Content style={{ padding: '0 0px' }}>
                    <Layout style={{ padding: '24px 0', background: "white" }}>
                        <div style={{
                            height: 550,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            Generate
                            {/* Left Part */}
                            <SidebarCreate />
                            {/* <Menu
                                    onClick={onClick}
                                    style={{ width: 350 }}
                                    items={items}
                                    mode="inline"
                                /> */}
                            {/* <SidebarCreate /> */}

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