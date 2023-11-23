'use client'

import React, { useState, useEffect } from 'react';
import {
    Select, notification, Spin
} from 'antd';

const { Option } = Select;

import { LoadingOutlined, ClockCircleOutlined, LikeOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

import '@styles/gallery.css'
import AuctionCollectionItem from '@components/collections/auctionCollectionItem'
import {
    getAllAuctions, getAuctionTokenId,
    getBeneficiary, getTokenURIOfArtByTokenId,
    getHightestBid, isAuctionEnded
} from '@utils/contract';

import Masonry from "react-responsive-masonry"

import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"

function AuctionCollection() {
    const [noti, contextHolder] = notification.useNotification();

    const { data: session, status } = useSession()
    const { address, isConnected } = useAccount()

    const [dataArray, setDataArray] = useState([]);
    const [fetching, setFetching] = useState(false);

    const [filter, setFilter] = useState(false);

    const fetchArt = async (addr: string) => {
        try {
            const artId = await getAuctionTokenId(addr);
            // get metadata uri
            const tokenURI: string = await getTokenURIOfArtByTokenId(artId);
            const metaURI = 'https://ipfs.io/ipfs/' + tokenURI.split("ipfs://")[1];

            // get info from metadata
            const response = await fetch(metaURI, {
                method: 'GET'
            });
            if (!response.ok) {
                const message = `An error has occurred: ${response.status}`;
                throw new Error(message);
            }
            const data = await response.json();

            const cid = data.image.split("ipfs://")[1] ? data.image.split("ipfs://")[1] : data.image.split("ipfs://")[0]; // should be 1
            const beneficiary = await getBeneficiary(addr);
            const highestBid = await getHightestBid(addr);
            const isEnded = await isAuctionEnded(addr);
            return { cid, beneficiary, highestBid, addr, isEnded };
        } catch (error) {
            return undefined;
        }
    }

    // fetch art
    useEffect(() => {
        const fetchData = async () => {
            if (!fetching) {
                try {
                    console.log("fetching..")
                    setFetching(true);

                    const response = await getAllAuctions();

                    let _data = [];
                    for await (const art of Array.from({ length: response.length },
                        (_, index) => fetchArt(response[index]))) {
                        if (art != undefined) {
                            _data.push(art);
                        }
                    }

                    setDataArray(_data)
                    setFetching(false);
                } catch (error) {
                    setFetching(false);
                }
            } else {
                setDataArray(prevArray => []);
            }
        };
        // console.log(userConnected)
        fetchData();
    }, []);

    const handleSelectChange = (value: string) => {
        if (value === 'Ongoing') {
            setFilter(false);
        }
        else if (value === 'Past') {
            setFilter(true);
        }
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 30,
                    marginBottom: 7,
                    opacity: 0.8
                }}
            >
                <Select
                    defaultValue="latest"
                    style={{
                        width: 240,
                        marginRight: 5
                    }}
                    onChange={handleSelectChange}
                >
                    <Option value="Ongoing"><ClockCircleOutlined /> Ongoing </Option>
                    <Option value="Past"><DashboardOutlined /> Past </Option>
                </Select>
            </div>


            {contextHolder}
            <Spin
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '90vh' // This will make the div take up the full viewport height}}
                }}
                indicator={antIcon}
                spinning={fetching}
            />

            <Masonry className="gallery" columnsCount={4}>
                {dataArray.filter(data => { return data.isEnded === filter }).map((data, index) => (
                    <AuctionCollectionItem
                        key={index}
                        data={data}
                        index={index}
                        user={session?.user}
                    />
                ))}
            </Masonry>
        </div>
    );
}

export default AuctionCollection;