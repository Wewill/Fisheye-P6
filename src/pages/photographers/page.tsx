import { useState, useEffect, useRef } from 'react';
import { Data } from '@/types/data';
import Link from '@/components/link';

type State = {
    data?: Data;
    loading: boolean;
    error?: string;
};

function Photographers() {
    const initRef = useRef(false);
    const [state, setState] = useState<State>({ loading: true });

    useEffect(() => {
        if (initRef.current === true) return;
        const fetchData = async () => {
            try {
                const response = await fetch('./data/photographers.json');
                if (!response.ok) {
                    throw new Error(`HTTP Error status: ${response.status}`);
                }
                // console.log(response);
                const data: Data = await response.json();
                setState({ data, loading: false });
            } catch (error) {
                setState({
                    error: error instanceof Error ? error.message : 'An error occurred',
                    loading: false,
                });
            }
        };
        initRef.current = true;
        fetchData();
    }, []); // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois après le rendu du composant

    if (state.loading)
        return (
            <div className="flex-center">
                <p className="loading">Chargement...</p>
            </div>
        );
    if (state.error)
        return (
            <div className="flex-center">
                <p className="error">Erreur: {state.error}</p>
            </div>
        );

    return (
        <>
            {state.data?.photographers.map((photographer, index) => (
                <article key={photographer.id} tabIndex={index + 1}>
                    <Link
                        to="/photographer"
                        params={{ photographerId: photographer.id }}
                        aria-label={`Voir le profil de ${photographer.name}`}
                        title={`Voir le profil de ${photographer.name}`}
                    >
                        <img src={`./photographers/${photographer.portrait}`} alt={photographer.name} />
                        <hgroup>
                            <h2>{photographer.name}</h2>
                            <h5 aria-label="Ville, Pays : ">
                                {photographer.city}, {photographer.country}
                            </h5>
                            <p aria-label="Description : ">{photographer.tagline}</p>
                            <p className="muted" aria-label="Tarifs : ">
                                {photographer.price}€/jour
                            </p>
                        </hgroup>
                    </Link>
                </article>
            ))}
        </>
    );
}

export default Photographers;
