import Image from '@node_modules/next/image'

const Home = () => {
  const centerImg = ['boy.png', 'boy.png', 'pumpkin.png', 'pumpkin-girl.png', 'eye.png', 'bone-king.png', 
                     'bone-king-2.png', 'bone-queen.png', 'jinx1.jpg', 'jinx2.jpg', 'christmas.png',
                     'chrysta-bell.png', 'elegant-lady.png', 'assasin.png', 'transhumanism.png', 'transhumanism2.png']
  
  const getRandomCenterName = () => {
    var randomIndex = Math.floor(Math.random () * centerImg.length)
    return `/assets/images/${centerImg[randomIndex]}`
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
        <Image width={200} height={200} alt='left' src="/assets/images/museum.jpg" />
        <Image width={200} height={200} alt='center' src={getRandomCenterName()} />
        <Image width={200} height={200} alt='top left' src="/assets/images/blue-hair-girl.png" />
        <Image width={200} height={200} alt='bottom left' src="/assets/images/ari.jpg"  />
        <Image width={200} height={200} alt='top right' src="/assets/images/star-hall.png" />
        <Image width={200} height={200} alt='bottom right' src="/assets/images/castle.png" />
        <Image width={200} height={200} alt='right' src="/assets/images/sona.jpg" />
      </div>
    </section>
  )
}

export default Home