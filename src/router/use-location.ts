import * as React from 'react';

// Fonction pour parser la query string ( pas de react = fonction statique )
const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const photographerId = Number(searchParams.get('photographerId'));
    return { photographerId };
};

const useLocation = () => {
    const [state, setState] = React.useState({ currentPath: window.location.pathname, params: getQueryParams() });

    React.useEffect(() => {
        // Set current path on location changes
        const onLocationChange = () => {
            //console.log('onLocationChange::', window.location.pathname)
            setState({ currentPath: window.location.pathname, params: getQueryParams() });
        };
        // Add listener to window
        window.addEventListener('navigate', onLocationChange);
        return () => {
            window.removeEventListener('navigate', onLocationChange);
        }; // Pourquoi on doit mettre le remove dans le retour de la function ? Lancer la function au démontage
    }, []); // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois après le rendu du composant

    return state;
};

export default useLocation;
