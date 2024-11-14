// @src/components/Route.jsx
import { useState, useEffect } from "react";

const Router = ({ path, component }) => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [params, setParams] = useState({});

    useEffect(() => {
        // Set current path on location changes
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        // Add listener to window
        window.addEventListener("navigate", onLocationChange);
        return () => window.removeEventListener("navigate", onLocationChange); // Pourquoi on doit mettre le remove dans le retour de la function ? 
    }, []); // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois après le rendu du composant

    // Fonction pour parser la query string
    const getQueryParams = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const photographerId = searchParams.get("photographerId");
        return { photographerId };
    };

    useEffect(() => {
        // Récupérer les paramètres à l'initialisation du composant
        setParams(getQueryParams());
    }, []);

    return currentPath === path ? component({photographerId:params.photographerId}) : null;
};

export default Router;