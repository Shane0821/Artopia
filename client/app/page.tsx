import { useEffect } from 'react'

const Home = () => {
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
    'artgerm-king.png', 'handsome-young-man.png', 'pirate-ship-1.png', 'wonderland-1.png', 
    'assasin.png', 'houses-in-sunset.png', 'pirate-ship-2.png', 'wonderland-2.png', 
    'black-haired.png', 'kitten-1.png', 'pumpkin-girl.png', 'bone-king-1.png', 
    'kitten-2.png', 'rabbit-hat-1.png'
  ]

  const left = ['museum-1.png', 'museum-2.png', 'museum-3.png']

  const right = ['blue-pink-girl-1.png', 'blue-pink-girl-2.png', 'blue-pink-girl-3.png', 'blue-pink-girl-4.png']

  const ul = ['blue-hair-girl-1.png', 'blue-hair-girl-2.png', 'blue-hair-girl-3.png', 'blue-hair-girl-4.png']

  const ur = ['star-hall-1.png', 'star-hall-2.png', 'star-hall-3.png', 'star-hall-4.png']

  const getImg = (pos: string) => {
    switch (pos) {
      case 'bl':
        var randomIndex = Math.floor(Math.random() * bl.length)
        return `/assets/images/homepage/bl/${bl[randomIndex]}`

      case 'br':
        var randomIndex = Math.floor(Math.random() * br.length)
        return `/assets/images/homepage/br/${br[randomIndex]}`

      case 'center':
        var randomIndex = Math.floor(Math.random() * center.length)
        return `/assets/images/homepage/center/${center[randomIndex]}`

      case 'left':
        var randomIndex = Math.floor(Math.random() * left.length)
        return `/assets/images/homepage/left/${left[randomIndex]}`

      case 'right':
        var randomIndex = Math.floor(Math.random() * right.length)
        return `/assets/images/homepage/right/${right[randomIndex]}`

      case 'ul':
        var randomIndex = Math.floor(Math.random() * ul.length)
        return `/assets/images/homepage/ul/${ul[randomIndex]}`

      case 'ur':
        var randomIndex = Math.floor(Math.random() * ur.length)
        return `/assets/images/homepage/ur/${ur[randomIndex]}`

      default:
        return ''
    }
  }

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
        <img alt='left' src={getImg('left')} />
        <img alt='center' src={getImg('center')} />
        <img alt='top left' src={getImg('ul')} />
        <img alt='bottom left' src={getImg('bl')} />
        <img alt='top right' src={getImg('ur')} />
        <img alt='bottom right' src={getImg('br')} />
        <img alt='right' src={getImg('right')} />
      </div>
    </section>
  )
}

export default Home