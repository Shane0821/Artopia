import React, { useState } from 'react';
import { Layout, Select, Slider, Input, Collapse } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Option } = Select;
const { Panel } = Collapse;

function SidebarCreate() {
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [step, setStep] = useState(0);
    const [guidanceScale, setGuidanceScale] = useState(0);
    const [seed, setSeed] = useState('');

    return (
        <Sider style={{ background: "white" }} width={350}>
            <Select
                style={{ width: '100%' }}
                placeholder="Select Model"
                bordered={false}
            >
                <Option value="model1">Model 1</Option>
                <Option value="model2">Model 2</Option>
            </Select>

            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="right"
                ghost
            >
                <Panel
                    header="Prompt"
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    <Input.TextArea placeholder="Enter prompt" />
                    <Input.TextArea placeholder="Enter negative prompt" />
                </Panel>
            </Collapse>

            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="right"
                ghost
            >
                <Panel
                    header="Resolution"
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    Height: {height}
                    <Slider value={height} onChange={(value) => setHeight(value)} />
                    Weight: {weight}
                    <Slider value={weight} onChange={(value) => setWeight(value)} />
                </Panel>
            </Collapse>

            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="right"
                ghost
            >
                <Panel
                    header="Generation Parameters"
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    Step: {step}
                    <Slider value={step} onChange={(value) => setStep(value)} />
                    Guidance Scale: {guidanceScale}
                    <Slider value={guidanceScale} onChange={(value) => setGuidanceScale(value)} />
                    Seed:
                    <Input value={seed} onChange={(e) => setSeed(e.target.value)} />
                </Panel>
            </Collapse>

            <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => isActive ? <UpOutlined style={{ color: 'gray' }} /> : <DownOutlined style={{ color: 'gray' }} />}
                expandIconPosition="right"
                ghost
            >
                <Panel
                    header="Sampler"
                    key="1"
                    style={{ backgroundColor: '#fff', border: 0 }}

                >
                    <Select style={{ width: '100%' }} placeholder="Select Sampler">
                        <Option value="sampler1">Sampler 1</Option>
                        <Option value="sampler2">Sampler 2</Option>
                    </Select>
                </Panel>
            </Collapse>
        </Sider>
    );
}

export default SidebarCreate;
