// @src/components/Route.jsx
import * as React from "react";

type Props = {
    path: string;
    Component: React.ComponentType<{photographerId:number | null}>;
    className?: string | undefined;
}

// Fonction pour parser la query string ( pas de react = fonction statique )
const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const photographerId = Number(searchParams.get("photographerId"));
    return { photographerId };
};

const Router = ({ path, Component, className}:Props) => {
    const [state, setState] = React.useState({currentPath:window.location.pathname, params:getQueryParams()});

    React.useEffect(() => {
        // Set current path on location changes
        const onLocationChange = () => {
            //console.log('onLocationChange::', window.location.pathname)
            setState({currentPath:window.location.pathname, params:getQueryParams()});
        };
        // Add listener to window
        window.addEventListener("navigate", onLocationChange);
        return () => {window.removeEventListener("navigate", onLocationChange)}; // Pourquoi on doit mettre le remove dans le retour de la function ? Lancer la function au démontage 
    }, []); // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois après le rendu du composant

    return state.currentPath === path ? <div className={className}><Component photographerId={state.params.photographerId}></Component></div> : null;
};

export default Router;