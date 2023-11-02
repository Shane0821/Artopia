const Home = () => {
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
        <img src="/assets/images/bone-king.png" />
        <img src="/assets/images/blue-hair-girl.png" />
        <img src="/assets/images/ari.jpg" />
        <img src="/assets/images/star-hall.png" />
        <img src="/assets/images/castle.png" />
        <img src="/assets/images/sona.jpg" />
      </div>
    </section>
  )
}

export default Home