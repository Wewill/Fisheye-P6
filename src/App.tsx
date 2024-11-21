import { useState, useEffect } from 'react';
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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    window.addEventListener('navigate', () => setCurrentPath(window.location.pathname));
    return () => window.removeEventListener('navigate', () => setCurrentPath(window.location.pathname));
  }, []);

  return (
    <>
      <header>
          <Link to="/"><img src={fisheyeLogo} className="logo" alt="Fisheye logo"/></Link>
          { currentPath === '/' && <h1>Nos photographes</h1> }
          </header>
      <main id="main">
          <Route path="/" Component={Photographers} className="photographers_section" />
          <Route path="/photographer" Component={Photographer} className="photographer_section" />
      </main>
    </>
  )
}

export default App