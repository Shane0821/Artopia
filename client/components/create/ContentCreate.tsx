import React, { useState, useEffect } from 'react';
import {
    Layout, Select, Slider, Input,
    Collapse, Divider, Image, Space, notification
} from 'antd';

import { Row, Col } from 'antd';

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

            <Row gutter={7}>
                {dataArray.map((data, index) => (
                    <Col span={6} key={index}>
                        <div style={{ marginTop: '1.5px' }}>
                            {data.base64 ? (
                                <img
                                    src={`data:image/jpeg;base64,${data.base64}`}
                                    style={{ borderRadius: '4px', width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Image
                                    src="/assets/images/gray.jpg"
                                    style={{ borderRadius: '6px', width: '100%', height: '100%' }}
                                    preview={false}
                                />
                            )}
                            {/* Display your data here */}
                        </div>
                    </Col>
                ))}
            </Row>

        </Content >
    );
}

export default ContentCreate;
