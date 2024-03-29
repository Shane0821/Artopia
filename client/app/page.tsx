"use client"

import { useEffect, useState } from 'react'

const Home = () => {
  const [ready, setReady] = useState(false)

  const bl = ['pumpkin-little-girl-1.png', 'pumpkin-little-girl-3.png', 'witch-2.png',
    'pumpkin-little-girl-2.png', 'witch-1.png', 'witch-3.png']

  const br = ['castle-1.png', 'castle-2.png', 'dreamscape-island.png', 'sci-fi-castle.png']

  const center = [
    'absolute-reality-v1-8-1.png', 'bone-king-2.png', 'landscape.png', 'rabbit-hat-2.png',
    'alien-portal.png', 'bone-queen.png', 'magical-fairy.png', 'rimuru-tempest.png',
    'anime-girl.png', 'elegant-lady.png', 'necromancer-sorceress.png', 'skeleton-in-forest.png',
    'Ao-Jingming-1.png', 'empress.png', 'photorealistic-eye-1.png', 'transhumanism-1.png',
    'Ao-Jingming-2.png', 'girl-holding-sword.png', 'photorealistic-eye-2.png', 'transhumanism2.png',
    'Ao-Jingming-3.png', 'god-of-the-forest.png', 'photorealistic-eye-3.png', 'wiccan.png',
    'arcane-diffusion.png', 'halloween.png', 'piranesi-chamber.png', 'woman-wearing-futuristic-goggles.png',
    'artgerm-king.png', 'pirate-ship-1.png', 'wonderland-1.png',
    'assasin.png', 'houses-in-sunset.png', 'pirate-ship-2.png', 'wonderland-2.png',
    'black-haired.png', 'kitten-1.png', 'pumpkin-girl.png', 'bone-king-1.png',
    'kitten-2.png', 'rabbit-hat-1.png'
  ]

  const left = ['museum-1.png', 'museum-2.png', 'museum-3.png']

  const right = ['blue-pink-girl-1.png', 'blue-pink-girl-2.png', 'blue-pink-girl-3.png', 'blue-pink-girl-4.png',
    'blue-pink-girl-5.png', 'blue-pink-girl-6.png']

  const ul = ['blue-hair-girl-1.png', 'blue-hair-girl-2.png', 'blue-hair-girl-3.png', 'blue-hair-girl-4.png']

  const ur = ['star-hall-1.png', 'star-hall-2.png', 'star-hall-3.png', 'star-hall-4.png']

  const [images, setImages] = useState({
    left: '',
    center: '',
    ul: '',
    bl: '',
    ur: '',
    br: '',
    right: ''
  });

  useEffect(() => {
    setReady(false)
    setImages({
      left: left[Math.floor(Math.random() * left.length)],
      center: center[Math.floor(Math.random() * center.length)],
      ul: ul[Math.floor(Math.random() * ul.length)],
      bl: bl[Math.floor(Math.random() * bl.length)],
      ur: ur[Math.floor(Math.random() * ur.length)],
      br: br[Math.floor(Math.random() * br.length)],
      right: right[Math.floor(Math.random() * right.length)]
    });
    setReady(true)
  }, []);

  return (
    <section className="w-full h-screen -mt-12 flex-between max-w-7xl">
      <div className='z-10 -mt-20 pr-2'>
        <h1 className="head_text text-center">
          Discover & Share
          <br />
          <span className="orange_gradient text-center"> AI-Powered Arts</span>
        </h1>
        <p className="desc text-center">
          Artopia is an open-source AI art platform for modern world to
          discover, create and share creative arts
        </p>
      </div>
      <div className="home_img_container">
        <img hidden={!ready} alt='' src={`/assets/images/homepage/left/${images.left}`} />
        <img hidden={!ready} alt='' src={`/assets/images/homepage/center/${images.center}`} />
        <img hidden={!ready} alt='' src={`/assets/images/homepage/ul/${images.ul}`} />
        <img hidden={!ready} alt='' src={`/assets/images/homepage/bl/${images.bl}`}/>
        <img hidden={!ready} alt='' src={`/assets/images/homepage/ur/${images.ur}`} />
        <img hidden={!ready} alt='' src={`/assets/images/homepage/br/${images.br}`}/>
        <img hidden={!ready} alt='' src={`/assets/images/homepage/right/${images.right}`} />
      </div>
    </section>
  )
}

export default Home