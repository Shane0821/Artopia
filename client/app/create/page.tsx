"use client"
import React, { useState, useEffect } from 'react';

import '@styles/create.css'

import SidebarCreate from '@app/create/Sidebar'
import ContentCreate from '@app/create/Content'
import { redirect } from 'next/navigation'

import {
    FormatPainterOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { Layout, Space, Button, notification, Spin, Badge } from 'antd';

import genCreditABI from '@abi/gencredit.json'
import { readContract, writeContract, waitForTransaction } from '@wagmi/core';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

const { Content } = Layout;

const Create = () => {
    const [noti, contextHolder] = notification.useNotification();

    const [generating, setGenerating] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [changingVis, setChangingVis] = useState(false);
    const [prepareMinting, setPrepareMinting] = useState('');

    const [canGetCredit, setCanGetCredit] = useState(false);
    const [gettingCredit, setGettingCredit] = useState(false);
    const [credits, setCredits] = useState(0);

    const { data: session, status } = useSession();
    const { address, isConnected } = useAccount();

    const [jsonData, setJsonData] = useState(null);

    const handleClick = () => {
        console.log('handleclick', generating)

        const useCredits = async () => {
            try {
                const { hash } = await writeContract({
                    address: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                    abi: genCreditABI,
                    functionName: 'useCredits',
                    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                    args: [1]
                })
                // wait for confirmation
                const data = await waitForTransaction({
                    hash: hash,
                })

                if (data.status === "success") {
                    setCredits(credits - 1);
                    setGenerating(true);

                    noti['info']({
                        message: 'Message:',
                        description:
                            'Start generating...',
                        duration: 3,
                    });
                } else {
                    throw new Error('Failed to claim credits. Maybe next time.');
                }
                setTimeout(() => {
                    setCooldown(false);
                }, 6000);
            } catch (error) {
                noti['error']({
                    message: 'Message:',
                    description:
                        'An Error occurs when spending credit.',
                    duration: 3,
                });
                setCooldown(false);
            }
        }

        if (credits) {
            setCooldown(true);
            useCredits();
        } else {

        }
    };

    const resetGenerating = () => {
        setGenerating(false);
    };

    const fetchCreditData = async () => {
        try {
            const data = await readContract({
                address: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                account: address,
                abi: genCreditABI,
                functionName: 'canUpdateCredit',
            });
            setCanGetCredit(Boolean(data));

            const _credits = await readContract({
                address: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                account: address,
                abi: genCreditABI,
                functionName: 'getCredits',
            });
            setCredits(Number(_credits));

            console.log(data, _credits, address)
        } catch (error) {
            console.error(error);
        }
    }

    // fetch credits and check if can get daily credits
    React.useEffect(() => {
        if (!isConnected) {
            redirect('/');
        }

        if (isConnected && session?.user) {
            fetchCreditData();
        }
    }, [isConnected, session?.user]);

    const getCredits = () => {
        const getCred = async () => {
            if (!session?.user || !address) return;

            try {
                const { hash } = await writeContract({
                    address: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                    abi: genCreditABI,
                    functionName: 'updateCredits',
                    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                    args: []
                })
                // wait for confirmation
                const data = await waitForTransaction({
                    hash: hash,
                })

                if (data.status === "success") {
                    noti['success']({
                        message: 'Message:',
                        description:
                            'Successfully claimed credits! Enjoy!',
                        duration: 3,
                    });
                    await fetchCreditData();
                } else {
                    throw new Error('Failed to claim credits. Maybe next time.');
                }
                setGettingCredit(false);
            } catch (error) {
                console.log(error)
                noti['error']({
                    message: 'Message:',
                    description:
                        `Failed to claim credits`,
                    duration: 3,
                });
                setGettingCredit(false);
            }
        };
        setGettingCredit(true);
        getCred();
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} className="sm:px-16 px-6 max-w-7xl" >
            {contextHolder}
            {

                (isConnected && session?.user) ?
                    (
                        <>
                            {
                                (canGetCredit) && (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '8px' }}>
                                        <p style={{ marginRight: '15px' }}>You can claim your credits for this month ~ 😊</p>
                                        <Button
                                            style={{ backgroundColor: 'green', color: 'white' }}
                                            onClick={getCredits}
                                            loading={gettingCredit}
                                        >
                                            Claim
                                        </Button>
                                    </div>
                                )
                            }
                            <Layout>
                                <Content style={{ padding: '0 0px' }}>
                                    <Layout style={{ padding: '24px 0', background: "white", height: '100vh' }}>
                                        <div
                                            style={{
                                                height: '100vh',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <div className="hide-scrollbar" style={{
                                                height: '73vh',
                                                overflowY: 'auto',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                borderBottom: '1px solid rgba(128, 128, 128, 0.1)',
                                            }}>
                                                Generate
                                                {/* Left Part */}
                                                <SidebarCreate
                                                    generating={generating}
                                                    resetGenerating={resetGenerating}
                                                    setJsonData={setJsonData}
                                                />
                                            </div>

                                            <Badge count={credits} offset={[-4, 8]} showZero={true} title="credits" overflowCount={999}>
                                                <Button
                                                    style={{
                                                        width: 300,
                                                        height: 55,
                                                        backgroundColor: "white",
                                                        marginBottom: '15vh',
                                                        marginTop: 5
                                                    }}
                                                    loading={
                                                        generating || cooldown
                                                        || (!(isConnected && session?.user))
                                                        || fetching || changingVis
                                                        || prepareMinting != ''
                                                    }
                                                    onClick={handleClick}
                                                >
                                                    Generate Image
                                                    <FormatPainterOutlined />
                                                </Button>
                                            </Badge>

                                        </div>


                                        <ContentCreate
                                            jsonData={jsonData}
                                            setFetching={setFetching}
                                            fetching={fetching}
                                            changingVis={changingVis}
                                            setChangingVis={setChangingVis}
                                            prepareMinting={prepareMinting}
                                            setPrepareMinting={setPrepareMinting}
                                        />

                                    </Layout>
                                </Content>
                            </Layout >
                        </>
                    )
                    : (
                        <>
                            <Spin
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '90vh' // This will make the div take up the full viewport height}}
                                }}
                                indicator={antIcon}
                                spinning={(!(isConnected && session?.user)) || fetching}
                            />
                        </>
                    )
            }
        </Space >
    )
}

export default Create