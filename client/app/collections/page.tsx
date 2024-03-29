'use client'

import React, { useState, useEffect } from 'react';
import { Space } from 'antd';

import '@styles/gallery.css'
import CollectionCarousel from '@components/collections/carousel'
import AuctionCollection from '@components/collections/auctionCollection'

function Collections() {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Space
            direction="vertical"
            style={{
                width: '100%',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="sm:px-16 px-6 max-w-7xl"
        >
            <CollectionCarousel setCurrentSlide={setCurrentSlide} />
            {currentSlide === 0 && <AuctionCollection />}
        </Space >
    );
}

export default Collections;
