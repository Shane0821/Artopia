import React, { useState, useEffect } from 'react';
import {
    Layout, notification, Spin, Tooltip
} from 'antd';

import { LoadingOutlined, DeleteOutlined, DeploymentUnitOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import Masonry from "react-responsive-masonry"

const { Content } = Layout;


import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

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

    // handle delete button on clicked
    const handleDelete = (index: Number) => {
        const deleteArt = async () => {
            try {
                const artId = dataArray[index]._id;
                console.log('deleting...', index, artId);

                // first, delete art in dataArray

                const response = await fetch(`/api/create/${artId}`, {
                    method: 'DELETE',
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

        deleteArt();
    };


    return (
        <Content className="hide-scrollbar" style={{
            padding: '0 24px',
            height: 600,
            overflowY: 'auto'
        }}>
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
                    <div className="pics relative group" key={index}> {/* Add relative and group classes */}
                        <img
                            className="no-visual-search"
                            style={{ borderRadius: '6px', width: '100%' }}
                            src={`${data.base64}`}
                        />
                        <div hidden={!data.completed} className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100">
                            <Tooltip placement="topLeft" title="Delete">
                                <button className="buttonStyle" onClick={() => handleDelete(index)}>
                                    <DeleteOutlined /> {/* Delete icon */}
                                </button>
                            </Tooltip>
                        </div>

                        <div hidden={!data.completed} className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100">
                            <Tooltip placement="bottomLeft" title={data.shared ? "Private" : "Make public"}>
                                <button className="buttonStyle">
                                    {data.shared ? (
                                        <EyeInvisibleOutlined /> // Private
                                    ) : (
                                        <EyeOutlined /> // Public icon
                                    )}
                                </button>
                            </Tooltip>

                            <Tooltip placement="bottomLeft" title="Mint">
                                <button className="buttonStyle">
                                    <DeploymentUnitOutlined />{/* Mint icon */}
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </Masonry>
        </Content >
    );
}

export default ContentCreate;
