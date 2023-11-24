import { Carousel } from 'antd';

import '@styles/detail.css'

import '@styles/gallery.css'

interface Props {
    setCurrentSlide: any
}

const CollectionCarousel = ({ setCurrentSlide }: Props) => {
    const onChange = (_currentSlide: number) => {
        setCurrentSlide(_currentSlide);
        console.log(_currentSlide)
    };

    return (
        <Carousel afterChange={onChange}>
            <div style={{ height: '350px' }}>
                <div style={{ position: 'relative', width: '100%', height: '350px', overflow: 'hidden' }}>
                    <img
                        style={{ position: 'absolute', top: 0, left: 0, filter: 'blur(20px)' }}
                        width={'100%'}
                        src="/assets/images/homepage/left/museum-1.png"
                    />

                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', flexDirection: 'column' }}>
                        <h1 style={{ textAlign: 'center', fontSize: '3em' }}>Auction Collection</h1>
                        <hr style={{ width: '50%', border: '1px solid white' }} />
                        <p className="p-public-gallery">Experience the grandeur of creativity at our auction collection. As each unique piece unfolds, {"it's"} like watching a constellation of thoughts come to life. From the playful to the thought-provoking, every item is a beacon of human imagination. {"It's"} a celebration of what can be achieved when creativity knows no bounds. Join us and be a part of this remarkable journey of artistic exploration.</p>
                    </div>
                </div>
            </div>

            <div style={{ height: '350px' }}>
                <div style={{ position: 'relative', width: '100%', height: '350px', overflow: 'hidden' }}>
                    <img
                        style={{ position: 'absolute', top: 0, left: 0, filter: 'blur(20px)' }}
                        width={'100%'}
                        src="/assets/images/homepage/ur/star-hall-1.png"
                    />

                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', flexDirection: 'column' }}>
                        <h1 style={{ textAlign: 'center', fontSize: '3em' }}>Factory Collection</h1>
                        <hr style={{ width: '50%', border: '1px solid white' }} />
                        <p className="p-public-gallery">Arriving soon. </p>
                    </div>
                </div>
            </div>

            <div style={{ height: '350px' }}>
                <div style={{ position: 'relative', width: '100%', height: '350px', overflow: 'hidden' }}>
                    <img
                        style={{ position: 'absolute', top: 0, left: 0, filter: 'blur(20px)' }}
                        width={'100%'}
                        src="/assets/images/homepage/bl/witch-2.png"
                    />

                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', flexDirection: 'column' }}>
                        <h1 style={{ textAlign: 'center', fontSize: '3em' }}>Jury Collection</h1>
                        <hr style={{ width: '50%', border: '1px solid white' }} />
                        <p className="p-public-gallery">Arriving soon. </p>
                    </div>
                </div>
            </div>
        </Carousel>
    );
};

export default CollectionCarousel;