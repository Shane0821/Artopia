import React from 'react';

import {
    Tooltip, Button
} from 'antd';

import '@styles/gallery.css'
import { useInView } from 'react-intersection-observer';

import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

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
    setPopupData: (popupData: any) => void
}

const GalleryItem = ({ data, index, setPopup, setPopupData }: GalleryItemProps) => {
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
        > {/* Add relative and group classes */}
            < img
                className="no-visual-search"
                style={{ width: '100%' }}
                src={`${data.base64}`}
            />

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
            </div>
        </div >

    );
};

export default GalleryItem;