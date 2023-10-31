import React, { useState, useEffect } from 'react';
import { Layout, Select, Slider, Input, Collapse, Divider, Image, Space } from 'antd';
import {
    UpOutlined, DownOutlined, HighlightOutlined,
    FullscreenOutlined, UnorderedListOutlined,
    PieChartOutlined, SketchOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

interface SidebarCreateProps {
    generating: boolean;
    resetGenerating: () => void;
}

function SidebarCreate({ generating, resetGenerating }: SidebarCreateProps) {
    const [model, setModel] = useState('absolute-reality-v1-8-1');
    const [height, setHeight] = useState(512);
    const [width, setWidth] = useState(512);
    const [step, setStep] = useState(25);
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [seed, setSeed] = useState('');
    const [sampler, setSampler] = useState('dpmsolver++')
    const [prompt, setPrompt] = useState('');
    const [negative_prompt, setNegativePrompt] = useState('Disfigured, cartoon, blurry');

    useEffect(() => {
        const fetchData = async () => {
            if (generating) {
                console.log("generating...");
                // Prepare data
                let data = {
                    model: model,
                    height: height,
                    width: width,
                    step: step,
                    guidanceScale: guidanceScale,
                    sampler: sampler,
                    seed: seed ? seed : undefined,
                    prompt: prompt,
                    negative_prompt: negative_prompt
                };

                // Make the POST request
                try {
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

                    // After the post function is done, reset the signal
                    resetGenerating();
                } catch (error) {
                    console.log(error)
                    // After the post function is done, reset the signal
                    resetGenerating();
                }
            }
        }
        fetchData();
    }, [generating]);

    return (
        <Sider style={{ background: "white" }} width={350}>
            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="right"
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
            </Collapse>
            <Divider style={{ margin: '5px 0' }} />


            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="right"
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
                        <Input.TextArea
                            placeholder="Describe something you'd like to see generated. Experiment with different words and styles... "
                            style={{ marginTop: '10px', marginBottom: '20px' }}
                            autoSize={{ minRows: 4 }}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <div>
                        Negative prompt
                        <Input.TextArea
                            placeholder="Enter negative prompt: Disfigured, cartoon, blurry, ..."
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
                expandIconPosition="right"
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
                expandIconPosition="right"
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
                    Step: {step}
                    <Slider min={1} max={100} value={step} onChange={(value) => setStep(value)} />
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
                expandIconPosition="right"
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
            <Divider style={{ margin: '5px 0' }} />
        </Sider >
    );
}

export default SidebarCreate;
