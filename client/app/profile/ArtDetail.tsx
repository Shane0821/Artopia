import React, { useState, useEffect } from 'react';
import Image from '@node_modules/next/image'

import { PlusOutlined } from '@ant-design/icons';

import { Drawer, Input, Button, Typography, Divider, Row, Col, notification } from 'antd';

const { Paragraph, Text } = Typography;

import '@styles/detail.css'

interface DetailProps {
    popup: boolean;
    setPopup: (popup: boolean) => void;
    data: any;
}

interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);

const Detail = ({ popup, setPopup, data }: DetailProps) => {
    const [noti, contextHolder] = notification.useNotification();

    const onClose = () => {
        setPopup(false);
    };

    return (
        <>
            {contextHolder}
            <Drawer
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <p className="site-description-item-profile-p">{data.name}</p>
                    </div>
                }
                width={720}
                onClose={onClose}
                open={popup}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                {data.cid && <Image width="0" 
                                    height="0"
                                    alt={`${data.cid}`}
                                    sizes='100vw'
                                    className="image no-visual-search" 
                                    src={`https://ipfs.io/ipfs/${data.cid}`} />}
                <Paragraph>
                    <p className="site-description-item-profile-p">Prompt</p>
                    <Row>
                        <Col span={24}>
                            <div className="prompt">
                                {data.prompt}
                            </div>
                        </Col>
                    </Row>
                    <br />

                    <Row>
                        <Col span={24}>
                            <div className="site-description-item-profile-wrapper">
                                <p className="site-description-item-profile-p-label">Negative Prompt:</p>
                                <br />
                                {data.negative_prompt}
                            </div>
                        </Col>
                    </Row>
                    <Divider />

                    <p className="site-description-item-profile-p">Model</p>
                    <Row>
                        <Col span={24}>
                            <div className="site-description-item-profile-wrapper">
                                {data.model}
                            </div>
                        </Col>
                    </Row>
                    <Divider />

                    <p className="site-description-item-profile-p">Resolution</p>
                    <Row>
                        <Col span={24}>
                            <div className="site-description-item-profile-wrapper">
                                {data.width} x {data.height}
                            </div>
                        </Col>
                    </Row>
                    <Divider />

                    <p className="site-description-item-profile-p">Generate Parameters</p>
                    <Row>
                        <Col span={6}>
                            <DescriptionItem title="Steps" content={data.steps} />
                        </Col>
                        <Col span={8}>
                            <DescriptionItem title="Guidance scale" content={data.guidance} />
                        </Col>
                        <Col span={10}>
                            <DescriptionItem title="Seed" content={data.seed} />
                        </Col>
                    </Row>
                    <Divider />

                    <p className="site-description-item-profile-p">Sampler</p>
                    <Row>
                        <Col span={24}>
                            <div className="site-description-item-profile-wrapper">
                                {data.scheduler}
                            </div>
                        </Col>
                    </Row>
                    <Divider />


                    <p className="site-description-item-profile-p">Created At</p>
                    <Row>
                        <Col span={24}>
                            <div className="site-description-item-profile-wrapper">
                                {data.created_at}
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                </Paragraph>
            </Drawer >
        </>
    );
};

export default Detail;