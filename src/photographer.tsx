import { useState, useEffect, useRef } from 'react';
import { Data } from './types/data';

type State = {
  data?: Data;
  loading: boolean;
  error?: string;
}

type modalState = {
  contact: boolean;
  lightbox: boolean;
  gallery_id?: number | null;
}

type Props = {
  photographerId: number | null
};

const Photographer = ({photographerId}:Props) => {
    const initRef = useRef(false);
    const [state, setState] = useState<State>({loading:true});
    const [modal, setModal] = useState<modalState>({contact:false, lightbox:false});

    const toggleContactModal = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setModal((prevModal) => {
        return { ...prevModal, contact: !prevModal.contact };
      });
    };

    const toggleLightboxModal = (event: React.MouseEvent<HTMLElement>, index:number = 0) => {
      event.preventDefault();
      setModal((prevModal) => {
        return { ...prevModal, lightbox: !prevModal.lightbox, gallery_id: index};
      });
    };
  
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
                    <h2>{state.data?.photographers.find((p) => p.id === photographerId)?.name}</h2>
                    <h4>{state.data?.photographers.find((p) => p.id === photographerId)?.city}, {state.data?.photographers.find((p) => p.id === photographerId)?.country}</h4>
                    <p className='muted'>{state.data?.photographers.find((p) => p.id === photographerId)?.tagline}</p>
                  </hgroup>
              </div>
              <button className='contact_button' onClick={toggleContactModal}>Contactez-moi</button>
              <img src={`./photographers/${state.data?.photographers.find((p) => p.id === photographerId)?.portrait}`} alt={state.data?.photographers.find((p) => p.id === photographerId)?.name} />
            </section>
            #TODO Trier par...
            <section className='photograph-gallery'>
              {state.data?.media.filter((m) => m.photographerId === photographerId).map((media, index) => (
                  <figure tabIndex={index} onClick={(event) => toggleLightboxModal(event, index)}>
                      { media.image && <img src={`./medias/${photographerId}/${media.image}`} alt={ media.title } /> }
                      { media.video && <video autoPlay loop><source src={`./medias/${photographerId}/${media.video}`} type="video/mp4"/></video> }                      
                      <figcaption className='visually-hidden'>© {state.data?.photographers.find((p) => p.id === photographerId)?.name} — { media.title }</figcaption>
                      <hgroup>
                        <h4>{ media.title }</h4>
                        <span>{ media.likes } <i className="fa fa-heart" aria-hidden="true"></i></span>
                      </hgroup>
                  </figure>
              ))}
            </section>
            <div id='info_bar'>567567 <i className="fa fa-heart" aria-hidden="true"></i> 300€/jour</div>
            <div id="contact_modal" className={modal.contact === true ? 'show':'hide'}>
                <div className="modal">
                  <header>
                    <h3>Contactez-moi</h3>
                    <h3>{state.data?.photographers.find((p) => p.id === photographerId)?.name}</h3>
                    <button className='close_button' onClick={toggleContactModal}><i className="fa fa-close" aria-hidden="true" title='Fermer'></i></button>
                    </header>
                  <form>
                    <div>
                      <label>Prénom</label>
                      <input />
                    </div>
                    <div>
                      <label>Nom</label>
                      <input />
                    </div>
                    <div>
                      <label>Email</label>
                      <input />
                    </div>
                    <div>
                      <label>Message</label>
                      <textarea />
                    </div>
                    <button className="contact_button">Envoyer</button>
                  </form>
                </div>
            </div>
            <div id='lightbox_modal' className={modal.lightbox === true ? 'show':'hide'}>
              Gallery id { modal.gallery_id }
              <button className='close_button' onClick={toggleLightboxModal}><i className="fa fa-close" aria-hidden="true" title='Fermer'></i></button>
            </div>
          </article>
   );
};

export default Photographer;
