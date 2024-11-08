//import React from 'react';
import fisheyeLogo from './assets/images/logo.png'
import Photographers from './Photographers.tsx';
import './css/styles.css'
import './css/photographers.css'
import './css/photographer.css'

function App() {
  return (
    <>
      <header>
          <img src={fisheyeLogo} className="logo" alt="fisheye logo"/>
          <h1>Nos photographes</h1>
      </header>
      <main id="main">
          <div className="photographer_section"><Photographers /></div>
      </main>
    </>
  )
}

export default App