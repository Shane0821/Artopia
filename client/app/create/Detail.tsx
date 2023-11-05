import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import { Drawer, Input, Button, Typography } from 'antd';

const { Paragraph, Text } = Typography;

import '@styles/detail.css'

interface DetailProps {
    popup: boolean;
    setPopup: (popup: boolean) => void;
    data: any;
}

const Detail = ({ popup, setPopup, data }: DetailProps) => {
    const [title, setTitle] = useState(data.title);

    const onClose = () => {
        setPopup(false);
    };

    return (
        <>
            <Drawer
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <Input
                            value={data.title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ marginLeft: '8px' }}
                            placeholder="Title"
                        />
                        <Button
                            onClick={() => {
                                setPopup(false)
                            }}
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
                    <Text strong>Model:</Text> {data.model}
                    <br />
                    <Text strong>Prompt:</Text> {data.prompt}
                    <br />
                    <Text strong>Negative Prompt:</Text> {data.negative_prompt}
                    <br />
                    <Text strong>Width:</Text> {data.width}
                    <br />
                    <Text strong>Height:</Text> {data.height}
                    <br />
                    <Text strong>Steps:</Text> {data.steps}
                    <br />
                    <Text strong>Guidance:</Text> {data.guidance}
                    <br />
                    <Text strong>Seed:</Text> {data.seed}
                    <br />
                    <Text strong>Scheduler:</Text> {data.scheduler}
                    <br />
                    <Text strong>Created At:</Text> {data.created_at}
                    <br />
                    <Text strong>Visibility:</Text> {data.shared ? 'public' : 'private'}
                </Paragraph>
            </Drawer >
        </>
    );
};

export default Detail;