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

import genCredit from '@abi/gencredit.json'
import { readContract, writeContract, waitForTransaction } from '@wagmi/core';
import { ethers } from 'ethers';

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

        if (credits) {
            setGenerating(true);

            setCooldown(true);
            setTimeout(() => {
                setCooldown(false);
            }, 6000);
        } else {

        }
    };

    const resetGenerating = () => {
        setGenerating(false);
    };

    // fetch credits and check if can get daily credits
    React.useEffect(() => {
        if (!isConnected) {
            redirect('/');
        }

        console.log(isConnected, session?.user)

        if (isConnected && session?.user) {
            const fetchData = async () => {
                try {
                    const data = await readContract({
                        address: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                        account: address,
                        abi: genCredit,
                        functionName: 'canUpdateCredit',
                    });
                    setCanGetCredit(Boolean(data));

                    const _credits = await readContract({
                        address: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                        account: address,
                        abi: genCredit,
                        functionName: 'getCredits',
                    });
                    setCredits(Number(_credits));

                    console.log(data, _credits, process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [isConnected, session?.user]);

    const getCredits = () => {
        const getCred = async () => {
            if (!session?.user || !address) return;

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                const relayerWallet = new ethers.Wallet(
                    process.env.NEXT_PUBLIC_RELAYER_PK || '',
                    provider
                );

                // Contract interaction
                const contract = new ethers.Contract(
                    process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT || '',
                    genCredit,
                    provider
                );

                // Gas estimation
                const gasPrice = await provider.getGasPrice();
                const gasLimit = await contract.estimateGas.updateCredits(); // Adjust the method name and parameters
                const nonce = await provider.getTransactionCount(address);
                console.log(nonce)

                const iface = new ethers.utils.Interface(genCredit);
                const encodedFunction = iface.encodeFunctionData("updateCredits", []);

                // Transaction object
                const transaction = {
                    to: process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT,
                    data: encodedFunction,
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    nonce: nonce
                };

                // Sign and send transaction
                const signedTransaction = await relayerWallet.signTransaction(transaction);
                const transactionResponse = await provider.sendTransaction(signedTransaction);
                const transactionHash = transactionResponse.hash;
                console.log(transactionResponse)


                // const signer = provider.getSigner();

                // const nonce = await provider.getTransactionCount(address);

                // // Collect the necessary information
                // const updateCreditsRequest = {
                //     user: address,
                //     nonce: nonce
                // };

                // // Sign the message
                // const messageHash = ethers.utils.solidityKeccak256(
                //     ['address', 'uint256'],
                //     [updateCreditsRequest.user, updateCreditsRequest.nonce]
                // );

                // const signedMessage = await signer.signMessage(ethers.utils.arrayify(messageHash));

                // console.log(updateCreditsRequest)
                // console.log(signedMessage)
                // console.log(messageHash)


                // // Send the meta-transaction to the smart contract
                // const contract = new ethers.Contract(
                //     process.env.NEXT_PUBLIC_GEN_CREDIT_CONTRACT || '',
                //     genCredit,
                //     signer
                // );
                // await contract.updateCreditsMeta(updateCreditsRequest, signedMessage);

            } catch (error) {
                console.error(error);
            }
        };
        getCred();
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} className="sm:px-16 px-6 max-w-7xl" >
            {
                (isConnected && session?.user) ?
                    (
                        <>
                            {
                                (canGetCredit) && (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '8px' }}>
                                        <p style={{ marginRight: '15px' }}>You can claim your credits today~ 😊</p>
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

                                            <Badge count={credits} offset={[-4, 8]} showZero={true} title="credits">
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