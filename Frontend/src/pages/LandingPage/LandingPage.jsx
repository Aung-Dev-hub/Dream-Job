import Features from "./components/Features"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header/>
      <Hero/>
      <Features/>
      <Footer/>
    </div>
  )
}

export default LandingPage