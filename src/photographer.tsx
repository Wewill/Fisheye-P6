import { useState, useEffect, useRef } from 'react';
import { Data } from './types/data';
import Link from "./components/link";

type State = {
  data?: Data;
  loading: boolean;
  error?: string;
}

type Props = {
  photographerId: number | null
};

const Photographer = ({photographerId}:Props) => {
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
          // console.log(response);
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
        <article>
            <section className="photograph-header">
              <div>
                  <hgroup>
                    <h2>Mimi keel</h2>
                    <h4>{state.data?.photographers.find((p) => p.id === photographerId)?.city}, {state.data?.photographers.find((p) => p.id === photographerId)?.country}</h4>
                    <p className='muted'>{state.data?.photographers.find((p) => p.id === photographerId)?.tagline}</p>
                  </hgroup>
              </div>
              <button className='contact_button'>Contactez-moi</button>
              <img src={`./photographers/${state.data?.photographers.find((p) => p.id === photographerId)?.portrait}`} alt={state.data?.photographers.find((p) => p.id === photographerId)?.name} />
            </section>
            #TODO Trier par...
            <section className='photograph-gallery'>
              {state.data?.media.filter((m) => m.photographerId === photographerId).map((media, index) => (
                  <figure tabIndex={index}>
                      { ( () => { 
                        if (media.image) return <img src={`./medias/${photographerId}/${media.image}`} alt={ media.title } />;
                        if (media.video) return <video autoPlay loop><source src={`./medias/${photographerId}/${media.video}`} type="video/mp4"/></video>;
                      } )() }                      
                      <figcaption className='visually-hidden'>© {state.data?.photographers.find((p) => p.id === photographerId)?.name} — { media.title }</figcaption>
                      <hgroup>
                        <h4>{ media.title }</h4>
                        <span>{ media.likes } <i className="fa fa-heart" aria-hidden="true"></i></span>
                      </hgroup>
                  </figure>
              ))}
            </section>
            <div id='info_bar'>567567 <i className="fa fa-heart" aria-hidden="true"></i> 300€/jour</div>
            <div id='contact_modal'>Contact</div>
            <div id='lightbox_modal'>IMage</div>
          </article>
   );
};

export default Photographer;
