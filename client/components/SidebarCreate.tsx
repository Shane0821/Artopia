import React, { useState } from 'react';
import { Layout, Select, Slider, Input, Collapse, Divider, Image, Space } from 'antd';
import {
    UpOutlined, DownOutlined, HighlightOutlined,
    FullscreenOutlined, UnorderedListOutlined,
    PieChartOutlined, SketchOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

function SidebarCreate() {
    const [model, setModel] = useState('stable-diffusion-v1-5');
    const [height, setHeight] = useState(512);
    const [width, setWidth] = useState(512);
    const [step, setStep] = useState(25);
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [seed, setSeed] = useState('');
    const [sampler, setSampler] = useState('dpmsolver++')

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
                        <Option value="stable-diffusion-v1-5">
                            <Space align="center">
                                <div style={{ marginTop: '8px' }}>
                                    <Image
                                        src="/assets/images/logo.svg"
                                        alt="model1"
                                        width={23}
                                        height={23}
                                    />
                                </div>
                                <div>
                                    Stable Diffusion Inpainting v1.5
                                </div>
                            </Space>
                        </Option>
                        <Option value="dark-sushi-mix-v2-25">Dark Sushi Mix v2.25</Option>
                        <Option value="arcane-diffusion">Arcane Diffusion</Option>
                        <Option value="anashel-rpg">RPG</Option>
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
                        />
                    </div>
                    <div>
                        Negative prompt
                        <Input.TextArea placeholder="Enter negative prompt: Disfigured, cartoon, blurry, ..." style={{ marginTop: '10px' }} />
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
