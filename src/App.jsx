import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import About from './components/About.jsx'
import Abilities from './components/Abilities.jsx'
import Practice from './components/Practice.jsx'
import Contact from './components/Contact.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import useSiteMotion from './hooks/useSiteMotion.js'

export default function App() {
  useSiteMotion()

  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    const onResize = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <ClickSpark
      sparkColor="#7FD3E8"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        <About />
        <div className="dotted-zone">
          <Abilities />
          <Practice />
        </div>
      </main>
      <Contact />
    </ClickSpark>
  )
}
