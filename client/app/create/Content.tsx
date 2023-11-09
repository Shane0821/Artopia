import React, { useState, useEffect } from 'react';
import {
    Layout, notification, Spin, Tooltip, Button
} from 'antd';

import { LoadingOutlined, DeleteOutlined, DeploymentUnitOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import Masonry from "react-responsive-masonry"

const { Content } = Layout;

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"

import { readContract, writeContract, waitForTransaction } from '@wagmi/core'
import imgABI from '/abi/imagenft.json'
import promptABI from '/abi/promptnft.json'

import Detail from '@app/create/Detail'

interface ContentCreateProps {
    jsonData: any;
    fetching: boolean;
    setFetching: (fetching: boolean) => void;
}

function ContentCreate({ jsonData, fetching, setFetching }: ContentCreateProps) {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);
    const [popup, setPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [prepareMinting, setPrepareMinting] = useState('');

    const [userConnected, setUserConnected] = useState(false);

    // Use useEffect to update the array whenever jsonData changes
    React.useEffect(() => {
        if (jsonData) {
            if (!jsonData.completed) {
                setDataArray(prevArray => [jsonData, ...prevArray]);
            } else {
                setDataArray((prevArray) => {
                    return [jsonData, ...prevArray.slice(1)];
                });
            }
        }
    }, [jsonData]);

    // Use useEffect to check connection whenever isConnected and session?.user change
    // prevent double get requests
    useEffect(() => {
        if (isConnected && session?.user) {
            setUserConnected(true);
        }
        else {
            setUserConnected(false);
        }
    }, [isConnected, session?.user]);

    // fetch art
    useEffect(() => {
        const fetchData = async () => {
            if (userConnected && session?.user) {
                try {
                    console.log("fetching..")
                    setFetching(true);

                    noti['info']({
                        message: 'Message:',
                        description:
                            'Fetching art...',
                        duration: 3,
                    });

                    const response = await fetch(`/api/create/`, {
                        method: 'GET'
                    });

                    // Handle the response
                    if (!response.ok) {
                        const message = `An error has occurred: ${response.status}`;
                        throw new Error(message);
                    }

                    const data = await response.json();

                    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    data.forEach(item => {
                        if (item) {
                            item.completed = true;
                        }
                    });

                    setDataArray(data)
                    setFetching(false);

                    noti['success']({
                        message: 'Message:',
                        description:
                            'Wellcome back.',
                        duration: 3,
                    });
                } catch (error) {
                    noti['error']({
                        message: 'Message:',
                        description:
                            `${error}`,
                        duration: 3,
                    });
                    setFetching(false);
                }
            } else {
                setDataArray(prevArray => []);
            }
        };
        // console.log(userConnected)
        fetchData();
    }, [userConnected]);

    // handle art deletion on button clicked
    const handleDelete = (index: number) => {
        const deleteArt = async () => {
            try {
                const artId = dataArray[index]._id;
                console.log('deleting...', index, artId);

                // first, delete art in dataArray
                setDataArray((prevArray) => {
                    let newArray = [...prevArray];
                    if (index >= 0 && index < newArray.length) {
                        newArray.splice(index, 1);
                    }
                    return newArray;
                });

                // then call api to delte it in database
                const response = await fetch(`/api/create/${artId}`, {
                    method: 'DELETE',
                });

                // Handle the response
                if (!response.ok) {
                    const message = `An error has occurred: ${response.status}`;
                    throw new Error(message);
                }

                noti['success']({
                    message: 'Message:',
                    description:
                        `Art is permanently deleted from your create workbench.`,
                    duration: 3,
                });
            } catch (error) {
                noti['error']({
                    message: 'Message:',
                    description:
                        `${error}`,
                    duration: 3,
                });
            }
        }

        // if minting art, deletion is not allowed.
        if (prepareMinting != '') {
            noti['info']({
                message: 'Message:',
                description:
                    `Deletion is not allowed when minting your art nft.`,
                duration: 4,
            });
            return;
        }

        deleteArt();
    };

    // call smart contract to mint art and prompt
    const mint = async(user: string, metadataCid: string, imgCid: string, promptCid: string) => {
        if (!user) {
            // to do: add notification
            return
        }
        // mint prompt
        try {
            // check prompt ownership
            const owner = await readContract({
                address: process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT,
                abi: promptABI,
                functionName: 'getOnwerByCID',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [promptCid]
            })
            if (owner !== '0x0000000000000000000000000000000000000000' && owner !== user) {
                throw new Error('You can\'t mint this art because you are not the owner of this prompt!');
            }

            // mint prompt when owner is 0x0000
            if (owner === '0x0000000000000000000000000000000000000000') {
                const {hash} = await writeContract({
                    address: process.env.NEXT_PUBLIC_PROMPT_NFT_CONTRACT,
                    abi: promptABI,
                    functionName: 'awardItem',
                    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                    args: [user, promptCid]
                })
                // wait for confirmation
                const data = await waitForTransaction({
                    hash: hash,
                })
                // tokenId is in data.logs[1].data 
                // or data.logs[0].topics[3]
                console.log(data)
                if (data.status === "success") {
                    noti['success']({
                        message: 'Message:',
                        description:
                            'Successfully minted prompt!',
                        duration: 3,
                    });
                } else if (data.status == "error") {
                   throw new Error('Failed to mint prompt!');
                }
            }
        } catch (error) {
            console.log(error)
            noti['error']({
                message: 'Message:',
                description: `${error}`,
                duration: 3,
            });
        }
        
        // mint art
        try {
            const {hash} = await writeContract({
                address: process.env.NEXT_PUBLIC_IMG_NFT_CONTRACT,
                abi: imgABI,
                functionName: 'awardItem',
                chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
                args: [user, metadataCid, imgCid],
            })
            // wait for confirmation
            const data = await waitForTransaction({
                hash: hash,
            })
            if (data.status === "success") {
                noti['success']({
                    message: 'Message:',
                    description:
                        'Successfully minted art!',
                    duration: 3,
                });
                // to do: remove art from the list
            } else if (data.status == "error") {
               throw new Error('Failed to mint art!');
            }
        } catch (error) {
            let desc = `${error}`;
            if (error?.toString().search("artwork already exists")!=-1)
                desc = `Failed to mint art! This artwork already exists on the blockchain!`;
            noti['error']({
                message: 'Message:',
                description: desc,
                duration: 3,
            });
        } 
        setPrepareMinting('');
    }

    // prepare for minting
    const handleMint = async(data: any, index: number) => {
        const prepare = async () => {
            try {
                noti['info']({
                    message: 'Message:',
                    description:
                        'Preparing for minting art.',
                    duration: 3,
                });

                const response = await fetch("/api/mint", {
                    method: "POST",
                    body: JSON.stringify(
                        { _id: data._id }
                    )
                });

                if (!response.ok) {
                    const message = `An error has occurred: ${response.status}`;
                    throw new Error(message);
                }

                const result = await response.json();
                console.log(result)

                noti['success']({
                    message: 'Message:',
                    description:
                        `Art is prepared to mint`,
                    duration: 3,
                });
                return result
            } catch (error) {
                noti['error']({
                    message: 'Message:',
                    description:
                        `${error}`,
                    duration: 3,
                });
                setPrepareMinting('');
            }
        }

        // one piece of art minting at one time
        if (prepareMinting != '') {
            noti['info']({
                message: 'Message:',
                description:
                    'Another art is minting.',
                duration: 4,
            });
            return;
        }

        setPrepareMinting(data._id);
        const {meta_data_ipfs, art_ipfs, prompt_ipfs} = await prepare();
        await mint(session?.user?.name, meta_data_ipfs, art_ipfs, prompt_ipfs);
    }

    return (
        <Content className="hide-scrollbar" style={{
            padding: '0 24px',
            height: 600,
            overflowY: 'auto'
        }}>
            <Detail popup={popup} setPopup={setPopup} data={popupData} />

            {contextHolder}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                Generative Arts
            </div>

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

            <Masonry className="gallery" columnsCount={3}>
                {dataArray.map((data: any, index) => (
                    <div
                        className="pics relative group"
                        key={index}
                        onClick={() => {
                            console.log('click')
                            setPopup(true);
                            setPopupData(data);
                        }}
                    > {/* Add relative and group classes */}
                        <img
                            className="no-visual-search"
                            style={{ borderRadius: '6px', width: '100%' }}
                            src={`${data.base64}`}
                        />

                        {/* buttons */}
                        <div
                            hidden={!data.completed}
                            className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Tooltip placement="topLeft" title="Delete">
                                <Button
                                    className="buttonStyle"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(index)}
                                />
                            </Tooltip>
                        </div>

                        {/* buttons */}
                        < div
                            hidden={!data.completed}
                            className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Tooltip placement="bottomLeft" title={data.shared ? "Private" : "Make public"}>
                                {data.shared ? (
                                    <Button className="buttonStyle" icon={<EyeInvisibleOutlined />} />
                                ) : (
                                    <Button className="buttonStyle" icon={<EyeOutlined />} /> // Public icon
                                )}
                            </Tooltip>

                            <Tooltip placement="bottomLeft" title="Mint">
                                <Button
                                    className="buttonStyle"
                                    loading={prepareMinting === data._id}
                                    icon={<DeploymentUnitOutlined />}
                                    onClick={() => { handleMint(data, index); }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                ))
                }
            </Masonry >
        </Content >
    );
}

export default ContentCreate;
