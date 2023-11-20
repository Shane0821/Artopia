import React from 'react';
import Image from '@node_modules/next/image'
import { useState, useEffect } from 'react';

import {
    Tooltip, Button
} from 'antd';

import '@styles/gallery.css'
import { useInView } from 'react-intersection-observer';
import { useSession } from "next-auth/react"

import { TransactionOutlined, AccountBookOutlined, KeyOutlined } from '@ant-design/icons';

import { createAuction, getAunctionByTokenId, isEnded, getHightestBid } from '@utils/contract'

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
    const { data: session, status } = useSession()
    const [auction, setAuction] = useState("0x0000000000000000000000000000000000000000")
    const [loading, setLoading] = useState(true)
    const [currentPrice, setCurrentPrice] = useState(0)

    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true,
    });

    const addToAuction = async () => {
        try {
            const auctionaddr: string = await createAuction(300, data.tokenId)
            setAuction(auctionaddr)
            setCurrentPrice(0)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getAuction = async () => {
            try {
                const addr = await getAunctionByTokenId(data.tokenId)
                // console.log(addr)
                const ended: boolean = await isEnded(addr)
                // console.log("ended", ended)
                if (!ended)
                    setAuction(addr)
                const hightestBid = await getHightestBid(addr)
                setCurrentPrice(hightestBid)
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
            <Image width="0"
                height="0"
                alt={`${data.cid}`}
                sizes='100vw'
                className="no-visual-search w-full h-auto"
                src={`https://ipfs.io/ipfs/${data.cid}`} />

            {/* buttons */}
            < div
                hidden={owner !== session?.user?.name || loading}
                className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <Tooltip placement="topLeft" title="Go to auction">
                    <Button
                        hidden={auction === "0x0000000000000000000000000000000000000000"}
                        className="buttonStyle"
                        icon={<KeyOutlined />}
                        href={`/auction/${auction}`}
                    />
                </Tooltip>
                <Tooltip placement="topLeft" title="Add to auction">
                    <Button
                        hidden={auction !== "0x0000000000000000000000000000000000000000"}
                        className="buttonStyle"
                        icon={<TransactionOutlined />}
                        onClick={addToAuction}
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
                        className="absolute bottom-0 left-0 w-full p-2 flex items-center justify-between opacity-0 group-hover:opacity-100"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: '#f8f8f8',
                            padding: '6px 10px', // Smaller padding will reduce the bar height
                            fontSize: '0.85rem'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div></div>
                        <div className="flex items-center">
                            current price: {currentPrice} AXM
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ArtItem;