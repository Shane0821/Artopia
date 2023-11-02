const Home = () => {
  const centerImg = ['boy.png', 'pumpkin.png', 'eye.png', 'bone-king.png', 'bone-king-2.png', 'bone-queen.png', 'jinx1.jpg']
  const getRandomCenterName = () => {
    var randomIndex = Math.floor(Math.random () * centerImg.length)
    return `/assets/images/${centerImg[randomIndex]}`
  }

  const rightImg = ['sona.jpg', 'sona.jpg', 'pumpkin-girl.png']
  const getRandomRightName = () => {
    var randomIndex = Math.floor(Math.random () * rightImg.length)
    return `/assets/images/${rightImg[randomIndex]}`
  }

  const bottomLeftImg = ['ari.jpg', 'ari.jpg', 'jinx2.jpg']
  const getRandomBottomLeftName = () => {
    var randomIndex = Math.floor(Math.random () * bottomLeftImg.length)
    return `/assets/images/${bottomLeftImg[randomIndex]}`
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
        <img src="/assets/images/museum.jpg" />
        <img src={getRandomCenterName()} />
        <img src="/assets/images/blue-hair-girl.png" />
        <img src={getRandomBottomLeftName()}  />
        <img src="/assets/images/star-hall.png" />
        <img src="/assets/images/castle.png" />
        <img src={getRandomRightName()} />
      </div>
    </section>
  )
}

export default Home