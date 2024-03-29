import React, { useState, useEffect } from 'react';

import {
    Tooltip, Button
} from 'antd';

import '@styles/gallery.css'
import { useInView } from 'react-intersection-observer';

import { EyeOutlined, EyeInvisibleOutlined, HeartOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';

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

interface GalleryItemProps {
    data: any,
    index: number,
    setPopup: (popup: boolean) => void,
    setPopupData: (popupData: any) => void,
    user: any
}

const GalleryItem = ({ data, index, setPopup, setPopupData, user }: GalleryItemProps) => {
    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true,
    });

    const [like, setLike] = useState(false);
    const [view, setView] = useState(false);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);

    const checkViewLike = () => {
        setLikes(0), setViews(0), setLike(false), setView(false);
        if (data.action && data.action.length > 0) {
            setLikes(data.action[0].likes);
            setViews(data.action[0].views);

            for (let address of data.action[0].likedBy) {
                if (user && user.name === address) {
                    setLike(true);
                }
            }
            for (let address of data.action[0].viewedBy) {
                if (user && user.name === address) {
                    setView(true);
                }
            }
        }
    }

    useEffect(() => {
        checkViewLike();
    }, [data]);

    const handleViewLike = (type: string) => {
        const postViewLike = async () => {
            try {
                const response = await fetch(`/api/publicGallery/${data._id}`, {
                    method: "POST",
                    body: JSON.stringify({
                        type: type
                    })
                });

                if (response.ok) {
                    const result = await response.json();

                    setLikes(result.likes);
                    setViews(result.views);

                    if (type === 'like') setLike(true);
                    if (type === 'view') setView(true);
                } else {
                    if (type === 'like') setLike(false);
                    if (type === 'view') setView(false);
                }
            } catch (error) {
                // console.log(error);
                if (type === 'like') setLike(false);
                if (type === 'view') setView(false);
            }
        }
        if (type === 'like' && (!user || like)) return;
        if (type === 'view' && (!user || view)) return;

        if (type === 'like') setLike(true);
        if (type === 'view') setView(true);
        postViewLike();
    }

    return (
        <div
            ref={ref}
            className={`publicPics relative group`}
            style={{
                opacity: (inView ? 1 : 0),
                transition: `opacity ${getRandomTransition()} `
            }}
            key={index}
            onClick={() => {
                setPopup(true);
                setPopupData(data);
                handleViewLike('view')
            }}
        >
            < img
                className="no-visual-search"
                style={{ width: '100%' }}
                src={`${data.base64} `}
            />

            {/* buttons */}
            < div
                hidden={!data.completed}
                className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <Tooltip placement="bottomLeft" title={"My Art"}  >
                    <Button className="buttonStyle" icon={<SmileOutlined />} hidden={!(user && data && user.name === data.address)} />
                </Tooltip>

                <Tooltip placement="topLeft" title="Like">
                    <Button
                        className="buttonStyle"
                        icon={<HeartOutlined />}
                        danger={like}
                        onClick={() => { handleViewLike('like') }}
                    />
                </Tooltip>
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
                {/* Left-aligned items: avatar and address */}
                <div className="flex items-center">
                    <UserOutlined style={{ marginRight: 10 }} />
                    <Tooltip placement="topLeft" color='rgba(0, 0, 0, 0.6)'>
                        <a href={`/profile/${data.address}`}>
                            {truncateMiddle(data.address, 7, 7)}
                        </a>
                    </Tooltip>
                </div>

                {/* Right-aligned items: views and likes */}
                <div className="flex items-center">
                    <div className="flex items-center mr-4">
                        <span className="mr-2">{views}</span> {/* Views count */}
                        <EyeOutlined />
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">{likes}</span> {/* Likes count */}
                        <HeartOutlined />
                    </div>
                </div>
            </div>
        </div >

    );
};

export default GalleryItem;