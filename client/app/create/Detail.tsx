import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import { Drawer, Input, Button, Typography, Divider, Row, Col, notification } from 'antd';

const { Paragraph, Text } = Typography;

import '@styles/detail.css'
import { hexDataSlice } from 'ethers/lib/utils';

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
    const [title, setTitle] = useState(data.title);

    const [noti, contextHolder] = notification.useNotification();

    const [saveLoading, setSaveLoading] = useState(false);

    const onClose = () => {
        setPopup(false);
    };

    useEffect(() => {
        if (popup) {
            setTitle(data.title);
        }
    }, [popup]);


    const saveTitle = () => {
        const update = async () => {
            try {
                const artId = data._id;

                data.title = title;

                // then call api to update it in database
                const response = await fetch(`/api/create/${artId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        title
                    })
                });

                // Handle the response
                if (!response.ok) {
                    const message = `An error has occurred: ${response.status}`;
                    throw new Error(message);
                }

                noti['success']({
                    message: 'Message:',
                    description:
                        `Art title saved.`,
                    duration: 3,
                });
                setSaveLoading(false);
                setPopup(false);
            } catch (error) {
                noti['error']({
                    message: 'Message:',
                    description:
                        `${error}`,
                    duration: 3,
                });
                setSaveLoading(false);
                setPopup(false);
            }
        }
        setSaveLoading(true);
        update();
    }

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
                        <p className="site-description-item-profile-p">Title</p>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ marginLeft: '8px' }}
                            placeholder="Title"
                            maxLength={100}
                        />
                        <Button
                            onClick={saveTitle}
                            loading={saveLoading}
                            style={{ marginLeft: '18px' }}
                        >
                            Save
                        </Button>
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
                {data.base64 && <img className="image no-visual-search" src={`${data.base64}`} />}
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

                    <p className="site-description-item-profile-p">Visibility</p>
                    <Row>
                        <Col span={24}>
                            <div className="site-description-item-profile-wrapper">
                                {data.shared ? 'Public' : 'Private'}
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