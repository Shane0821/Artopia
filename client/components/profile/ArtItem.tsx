import React from 'react';
import Image from '@node_modules/next/image'
import { useState, useEffect } from 'react';

import {
    Tooltip, Button, notification
} from 'antd';

import '@styles/gallery.css'
import { useInView } from 'react-intersection-observer';
import { useSession } from "next-auth/react"

import { TransactionOutlined, AccountBookOutlined, MoneyCollectOutlined, DollarOutlined } from '@ant-design/icons';

import { createAuction, getAunctionByTokenId, isAuctionEnded, getHighestBid } from '@utils/contract'

import { bid, endAuction, approveArt} from '@utils/contract'

function truncateMiddle(str: string, frontChars: number, backChars: number, ellipsis = '...') {
    if (str.length <= frontChars + backChars) {
        return str;
    }
    var frontStr = str.substring(0, frontChars);
    var backStr = str.substring(str.length - backChars);
    return frontStr + ellipsis + backStr;
}

function getRandomTransition() {
    const durations = ['0.5s', '1.5s', '2.5s', '3.5s']; // Add more durations as needed
    const timingFunctions = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']; // Add more timing functions as needed

    // Generate a random index for duration and timing function
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const timingFunction = timingFunctions[Math.floor(Math.random() * timingFunctions.length)];

    return `${duration} ${timingFunction}`;
}

interface ArtItemProps {
    data: any,
    index: number,
    owner: string,
    setPopup: (popup: boolean) => void,
    setPopupData: (popupData: any) => void,
}

const ArtItem = ({ data, index, setPopup, setPopupData, owner }: ArtItemProps) => {
    const [noti, contextHolder] = notification.useNotification();
    const { data: session, status } = useSession()
    const [auction, setAuction] = useState("0x0000000000000000000000000000000000000000")
    const [loading, setLoading] = useState(true)
    const [currentPrice, setCurrentPrice] = useState(0)
    const [addWaiting, setAddWaiting] = useState(false)

    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true,
    });

    const addToAuction = async () => {
        setAddWaiting(true)
        try {
            const auctionaddr: string = await createAuction(600, data.tokenId)
            setAuction(auctionaddr)
            setCurrentPrice(2)

            await approveArt(auction, data.tokenId)

            noti['success']({
                message: 'Message:',
                description:
                    'Successfully added to auction!',
                duration: 3,
            });
        } catch (error) {
            console.log(error)
            noti['error']({
                message: 'Message:',
                description:
                    'Failed to add to auction!',
                duration: 3,
            });
        }
        setAddWaiting(false)
    }

    useEffect(() => {
        const getAuction = async () => {
            try {
                const addr = await getAunctionByTokenId(data.tokenId)
                // console.log(addr)
                const ended: boolean = await isAuctionEnded(addr)
                // console.log("ended", ended)
                if (!ended)
                    setAuction(addr)
                const highestBid = await getHighestBid(addr)
                setCurrentPrice(Math.max(2, highestBid))
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
        getAuction()
    }, [])

    return (
        <div
            ref={ref}
            className={`publicPics relative group`}
            style={{
                opacity: (inView ? 1 : 0),
                transition: `opacity ${getRandomTransition()}`
            }}
            key={index}
            onClick={() => {
                setPopup(true);
                setPopupData(data);
            }}
        >
            {contextHolder}
            <Image width="0"
                height="0"
                alt={`${data.cid}`}
                sizes='100vw'
                className="no-visual-search w-full h-auto"
                src={`https://ipfs.io/ipfs/${data.cid}`} />

            {/* buttons */}
            < div
                className="absolute top-0 right-0 p-1"
                onClick={(e) => e.stopPropagation()}
            >
                <Tooltip placement="topLeft" title="Go to auction">
                    <a href={`/collections/auction/${auction}`} className="item-center justify-center">
                        <Button
                            hidden={auction === "0x0000000000000000000000000000000000000000" || addWaiting === true}
                            className="buttonStyle"
                            icon={<MoneyCollectOutlined />}
                        />
                    </a>
                </Tooltip>
                <Tooltip placement="topLeft" title="Add to auction">
                    <Button
                        hidden={owner !== session?.user?.name || loading || 
                                (auction !== "0x0000000000000000000000000000000000000000" && addWaiting === false) }
                        className="buttonStyle"
                        icon={<TransactionOutlined />}
                        onClick={addToAuction}
                        loading={addWaiting}
                    />
                </Tooltip>
                {/* <Tooltip placement="topLeft" title="Sell at fixed price">
                    <Button
                        className="buttonStyle"
                        icon={<AccountBookOutlined />}
                    />
                </Tooltip> */}
            </div>

            {
                !(loading || auction === "0x0000000000000000000000000000000000000000") && (
                    <div
                        className="absolute bottom-0 left-0 w-full p-2 flex items-center justify-between"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: '#f8f8f8',
                            padding: '6px 10px', // Smaller padding will reduce the bar height
                            fontSize: '0.85rem'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center">
                            <DollarOutlined style={{ marginRight: 10 }} />
                            Current price
                        </div>
                        <div className="flex items-center">
                             {currentPrice} AXM
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ArtItem;