import React, { useState, useEffect } from 'react';
import {
    Layout, Select, Slider, Input,
    Collapse, Divider, Image, Space, notification,
    Button
} from 'antd';
import {
    UpOutlined, DownOutlined, HighlightOutlined,
    FullscreenOutlined, UnorderedListOutlined,
    PieChartOutlined, SketchOutlined, SyncOutlined
} from '@ant-design/icons';

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"
import { generatePrompts } from '@utils/randomPrompt'

const { Sider } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

function createGrayscaleBase64Image(width: Number, height: Number) {
    // Create a canvas element
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');

    // Create a grayscale image
    ctx.fillStyle = 'gray'; // Set the fill color to gray
    ctx.fillRect(0, 0, width, height);

    // Convert the canvas to a Base64 encoded JPEG image
    let dataURL = canvas.toDataURL('image/jpeg');

    return dataURL;
}

interface SidebarCreateProps {
    generating: boolean;
    resetGenerating: () => void;
    setJsonData: (jsonData: any) => void;
    setCurrentPrompt: (currentPrompt: string) => void;
}

function SidebarCreate({ generating, resetGenerating, setJsonData, setCurrentPrompt }: SidebarCreateProps) {
    const [model, setModel] = useState('absolute-reality-v1-8-1');
    const [height, setHeight] = useState(512);
    const [width, setWidth] = useState(512);
    const [steps, setSteps] = useState(25);
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [seed, setSeed] = useState('');
    const [sampler, setSampler] = useState('dpmsolver++')
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        setCurrentPrompt(prompt);
    }, [prompt])

    const [negative_prompt, setNegativePrompt] = useState('Disfigured, cartoon, blurry, nude');

    const [noti, contextHolder] = notification.useNotification();
    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    useEffect(() => {
        const fetchData = async () => {
            if (generating) {
                try {
                    if (!(isConnected && session?.user)) {
                        throw new Error('You are not logged in.');
                    }

                    const artData = {
                        completed: false,
                        base64: createGrayscaleBase64Image(width, height),
                        height: height,
                        width: width
                    };
                    setJsonData(artData);

                    console.log("generating...");

                    noti['info']({
                        message: 'Message:',
                        description:
                            'Start generating...',
                        duration: 3,
                    });

                    // throw new Error('test')

                    // Prepare data
                    let data = {
                        model: model,
                        height: height,
                        width: width,
                        steps: steps,
                        guidanceScale: guidanceScale,
                        sampler: sampler,
                        seed: seed ? seed : undefined,
                        prompt: prompt,
                        negative_prompt: negative_prompt,
                    };

                    // Make the POST request

                    const response = await fetch("/api/create", {
                        method: "POST",
                        body: JSON.stringify(
                            data
                        )
                    });

                    // Handle the response
                    if (!response.ok) {
                        const message = `An error has occurred: ${response.status}`;
                        throw new Error(message);
                    }

                    const result = await response.json();
                    console.log(result);

                    result.completed = true;
                    setJsonData(result);

                    noti['success']({
                        message: 'Message:',
                        description:
                            'Successfully generated an image.',
                        duration: 3,
                    });

                    // After the post function is done, reset the signal
                    resetGenerating();
                } catch (error) {
                    console.log(error)

                    noti['error']({
                        message: 'Message:',
                        description:
                            `${error}`,
                        duration: 3,
                    });
                    // After the post function is done, reset the signal
                    resetGenerating();
                }
            }
        }
        fetchData();
    }, [generating]);

    return (
        <Sider
            style={{
                background: "white"
            }}
            width={350}
        >
            {contextHolder}
            < Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="end"
                ghost
            >
                <Panel
                    header={
                        <div>
                            <SketchOutlined />
                            <span style={{ marginLeft: '10px' }}>Model</span>
                        </div>
                    }
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}
                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select Model"
                        value={model}
                        onChange={(value) => setModel(value)}
                    >
                        <Option value="absolute-reality-v1-8-1">
                            <Space align="center">
                                <div style={{ marginTop: '8px' }}>
                                    <Image
                                        src="/assets/images/absolute-reality-v1-8-1.jpeg"
                                        alt="model1"
                                        width={23}
                                        height={23}
                                    />
                                </div>
                                <div>
                                    AbsoluteReality v1.8.1
                                </div>
                            </Space>
                        </Option>

                        <Option value="eimis-anime-diffusion-v1-0">
                            <Space align="center">
                                <div style={{ marginTop: '8px' }}>
                                    <Image
                                        src="/assets/images/eimis-anime-diffusion-v1-0.jpeg"
                                        alt="model2"
                                        width={23}
                                        height={23}
                                    />
                                </div>
                                <div>
                                    Anime Diffusion
                                </div>
                            </Space>
                        </Option>

                        <Option value="dark-sushi-mix-v2-25">
                            <Space align="center">
                                <div style={{ marginTop: '8px' }}>
                                    <Image
                                        src="/assets/images/dark-sushi-mix-v2-25.jpeg"
                                        alt="model3"
                                        width={23}
                                        height={23}
                                    />
                                </div>
                                <div>
                                    Dark Sushi Mix v2.25
                                </div>
                            </Space>
                        </Option>

                        <Option value="arcane-diffusion">
                            <Space align="center">
                                <div style={{ marginTop: '8px' }}>
                                    <Image
                                        src="/assets/images/arcane-diffusion.jpeg"
                                        alt="model1"
                                        width={23}
                                        height={23}
                                    />
                                </div>
                                <div>
                                    Arcane Diffusion
                                </div>
                            </Space>
                        </Option>
                    </Select>
                </Panel>
            </Collapse >
            <Divider style={{ margin: '5px 0' }} />


            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="end"
                ghost
            >
                <Panel
                    header={
                        <div>
                            <HighlightOutlined />
                            <span style={{ marginLeft: '10px' }}>Prompt</span>
                        </div>
                    }
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}
                >
                    <div style={{ marginBottom: '10px' }}>
                        Prompt
                        <div style={{ marginTop: '10px' }}>
                            <Input.TextArea
                                placeholder="Describe something you'd like to see generated. Experiment with different words and styles... "
                                autoSize={{ minRows: 4 }}
                                value={prompt}
                                onChange={(e) => { setPrompt(e.target.value); }}
                            />
                        </div>
                        <Button
                            type="default"
                            style={{ float: 'right', marginBottom: '20px', marginTop: '2px' }}
                            onClick={() => { setPrompt(generatePrompts()); }}
                            icon={<SyncOutlined />}
                            title={'Random'}
                            size='small'
                        >
                        </Button>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        Negative prompt
                        <Input.TextArea
                            placeholder="Enter negative prompt: Disfigured, cartoon, blurry, nude, ..."
                            style={{ marginTop: '10px' }}
                            autoSize={{ minRows: 3 }}
                            value={negative_prompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                        />
                    </div>
                </Panel>
            </Collapse>
            <Divider style={{ margin: '5px 0' }} />


            <Collapse
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="end"
                ghost
            >
                <Panel
                    header={
                        <div>
                            <FullscreenOutlined />
                            <span style={{ marginLeft: '10px' }}>Resolution</span>
                        </div>
                    }
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    Width: {width}
                    <Slider min={256} max={1024} step={64} value={width} onChange={(value) => setWidth(value)} />
                    Height: {height}
                    <Slider min={256} max={1024} step={64} value={height} onChange={(value) => setHeight(value)} />
                </Panel>
            </Collapse>
            <Divider style={{ margin: '5px 0' }} />

            <Collapse
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="end"
                ghost
            >
                <Panel
                    header={
                        <div>
                            <UnorderedListOutlined />
                            <span style={{ marginLeft: '10px' }}>Generation Parameters</span>
                        </div>
                    }
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    Step: {steps}
                    <Slider min={1} max={100} value={steps} onChange={(value) => setSteps(value)} />
                    Guidance Scale: {guidanceScale}
                    <Slider min={0} max={20} value={guidanceScale} step={0.5} onChange={(value) => setGuidanceScale(value)} />
                    Seed:
                    <Input value={seed} placeholder="Blank for random" onChange={(e) => setSeed(e.target.value)} />
                </Panel>
            </Collapse>
            <Divider style={{ margin: '5px 0' }} />

            <Collapse
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="end"
                ghost
            >
                <Panel
                    header={
                        <div>
                            <PieChartOutlined />
                            <span style={{ marginLeft: '10px' }}>Sampler</span>
                        </div>
                    }
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select Sampler"
                        value={sampler}
                        onChange={(value) => setSampler(value)}
                    >
                        <Option value="dpmsolver++">dpmsolver++</Option>
                        <Option value="pndm">pndm</Option>
                        <Option value="ddim">ddim</Option>
                        <Option value="euler">euler</Option>
                    </Select>
                </Panel>
            </Collapse>
        </Sider >
    );
}

export default SidebarCreate;
