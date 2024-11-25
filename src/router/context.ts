import { createContext } from 'react';

const BrowserRouterContext = createContext({
    currentPath: window.location.pathname,
    params: {} as { photographerId?: number },
});

export default BrowserRouterContext;
