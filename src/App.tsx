import Route from './components/route';
import Link from './components/link';
import useLocation from './router/use-location';

// Assets
import fisheyeLogo from './assets/images/logo.png';
import Photographers from './pages/photographers/page';
import Photographer from './pages/photographer/page';

// Styles
import './css/styles.css';
import './css/photographers.css';
import './css/photographer.css';
import BrowserRouterContext from './router/context';

function App() {
    const state = useLocation();
    return (
        <BrowserRouterContext.Provider value={state}>
            <header>
                <Link to="/">
                    <img src={fisheyeLogo} className="logo" alt="Fisheye" />
                </Link>
                {state.currentPath === '/' && <h1>Nos photographes</h1>}
            </header>
            <main id="main">
                <Route path="/" className="photographers_section">
                    <Photographers></Photographers>
                </Route>
                <Route path="/photographer" className="photographer_section">
                    <Photographer></Photographer>
                </Route>
            </main>
        </BrowserRouterContext.Provider>
    );
}

export default App;
