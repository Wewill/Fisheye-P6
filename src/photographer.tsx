import { useState, useEffect, useRef } from 'react';
import { Data } from './types/data';
import Link from "./components/link";

type State = {
  data?: Data;
  loading: boolean;
  error?: string;
}

const Photographer = ({photographerId}) => {
    const initRef = useRef(false);
    const [state, setState] = useState<State>({loading:true});
  
    useEffect(() => {
      if ( initRef.current === true ) return;
      const fetchData = async () => {
        try {
          const response = await fetch('./data/photographers.json');
          if (!response.ok) { 
            throw new Error(`HTTP Error status: ${response.status}`);
          }
          //console.log(response);
          const data:Data = await response.json();
          setState({data, loading:false} );
        } catch (error) {
          setState({error: error instanceof Error ? error.message : "An error occurred", loading:false});
        }
      };
      initRef.current = true;
      fetchData();   
    }, []); // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois après le rendu du composant
  
    if (state.loading) return <p>Chargement...</p>;
    if (state.error) return <p className='error'>Erreur: {state.error}</p>;
  
    return (
        <article className="single photographer">
            <p>Photographer ID: {photographerId}</p>
            <Link to="/" aria-label="Retour à la liste des photographes" title="Retour à la liste des photographes">Retour</Link>
            ----
            <section className="hero">
                <div className="">
                    <div>
                        <h2>Mimi keel</h2>
                        <h5>{state.data?.photographers.findIndex((p) => p.id === photographerId)?.city}, {state.data?.photographers.findIndex((p) => p.id === photographerId)?.country}</h5>
                        <p>{state.data?.photographers.findIndex((p) => p.id === photographerId)?.tagline}</p>
                    </div>
                    <button>Contactez-moi</button>
                    <img src={`./photographers/${state.data?.photographers.findIndex((p) => p.id === photographerId)?.portrait}`} alt={state.data?.photographers.findIndex((p) => p.id === photographerId)?.name} />
                </div>
            </section>
            #TODO Trier par...
            {state.data?.media.filter((m) => m.photographerId === photographerId).map((media, index) => (
                <figure>
                    { media.title }
                    { media.image }
                    ...
                </figure>
            ))}
        </article>
   );
};

export default Photographer;
