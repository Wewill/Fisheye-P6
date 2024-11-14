import React from 'react';
import Route from "./components/route";
import Link from "./components/link";

// Assets 
import fisheyeLogo from './assets/images/logo.png';
import Photographers from './photographers';
import Photographer from './photographer';

// Styles
import './css/styles.css';
import './css/photographers.css';
import './css/photographer.css';

function App() {
  return (
    <>
    <Link to="/">Vers home</Link>{ " | " }<Link to="/photographer">Vers photographer</Link>
      <header>
          <img src={fisheyeLogo} className="logo" alt="Fisheye logo"/>
          <h1>Nos photographes</h1>
      </header>
      <main id="main">
          <div className="photographer_section">
          <Route path="/" component={Photographers} />
          <Route path="/photographer" component={Photographer} />
          </div>
      </main>
    </>
  )
}

export default App