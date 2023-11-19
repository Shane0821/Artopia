import React from 'react';
import Image from '@node_modules/next/image'

import {
    Tooltip, Button
} from 'antd';

import '@styles/gallery.css'
import { useInView } from 'react-intersection-observer';
import { useSession } from "next-auth/react"

import { TransactionOutlined, AccountBookOutlined, KeyOutlined } from '@ant-design/icons';

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

    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true,
    });

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
                hidden={owner !== session?.user?.name}
                className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <Tooltip placement="topLeft" title="Go to auction">
                    <Button
                        className="buttonStyle"
                        icon={<KeyOutlined />}
                    />
                </Tooltip>
                <Tooltip placement="topLeft" title="Add to auction">
                    <Button
                        className="buttonStyle"
                        icon={<TransactionOutlined />}
                    />
                </Tooltip>
                {/* <Tooltip placement="topLeft" title="Sell at fixed price">
                    <Button
                        className="buttonStyle"
                        icon={<AccountBookOutlined />}
                    />
                </Tooltip> */}
            </div>

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
                    current price: {100} AXM
                </div>
            </div>
        </div >
    );
};

export default ArtItem;