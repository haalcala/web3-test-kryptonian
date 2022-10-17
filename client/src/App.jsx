import { useState } from 'react'
import Navbar from './components/Navbar'
import Welcome from './components/Welcome'
import Services from './components/Services'
import Transactions from './components/Transactions'
import Footer from './components/Footer'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar/>
        <Welcome/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>
    </div>
  )
}

export default App
