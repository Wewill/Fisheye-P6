import { useState, useEffect, useRef, useContext } from 'react'; //useLayoutEffect
import { Data } from '@/types/data';
import { Media } from '@/types/media';
import BrowserRouterContext from '@/router/context';
import Link from '@/components/link';
import Dropdown from '@/components/dropdown';
import ContactForm from './contact-form';
import LightboxModal from './lightbox-modal';

type State = {
    data?: Data;
    loading: boolean;
    error?: string;
};

const Photographer = () => {
    const initRef = useRef(false);
    const [state, setState] = useState<State>({ loading: true });
    const [modal, setModal] = useState<null | 'contact' | 'lightbox'>(null);
    const [galleryId, setGalleryId] = useState(0);
    const [selectedSort, setSelectedSort] = useState('date');

    const likeRef = useRef<Record<string, boolean>>({});

    const { params } = useContext(BrowserRouterContext);
    const { photographerId } = params;

    const openContactModal = () => {
        setModal('contact');
    };

    const openLightboxModal = (index: number = 0) => {
        setModal('lightbox');
        setGalleryId(index);
    };

    const sortMedia = (medias: Media[], key: string): Media[] => {
        return medias.slice().sort((a, b) => {
            if (key === 'title') {
                return a.title.localeCompare(b.title);
            } else if (key === 'date') {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (key === 'likes') {
                return b.likes - a.likes;
            }
            return 0;
        });
    };

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
    if (!photographerId)
        return (
            <p className="error">
                Oops il manque un identifiant de photographe
                <br />
                <strong>
                    <Link to="/">Retour à la liste</Link>
                </strong>
            </p>
        );

    const photographer = state.data?.photographers.find((p) => p.id === photographerId);
    const medias = state.data?.media || [];
    const sortedMedias = sortMedia(medias, selectedSort);

    const incrementLikes = (mediaId: number) => {
        setState((prevState) => {
            if (!prevState.data) return prevState;
            const like = prevState.data.media.map((m) => (m.id === mediaId ? { ...m, likes: !likeRef.current[mediaId] ? m.likes - 1 : m.likes + 1 } : m));
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    media: like,
                },
            };
        });
        likeRef.current[mediaId] = !likeRef.current[mediaId];
    };

    return (
        <article>
            <section id="section-title" className="photograph-header">
                <div>
                    <hgroup>
                        <h2>{photographer?.name}</h2>
                        <h4 aria-label="Ville, Pays : ">
                            {photographer?.city}, {photographer?.country}
                        </h4>
                        <p className="muted" aria-label="Description : ">
                            {photographer?.tagline}
                        </p>
                    </hgroup>
                </div>
                <button className="contact_button space-x" onClick={openContactModal} aria-label="Contact Me" tabIndex={99}>
                    Contactez-moi
                </button>
                <img src={`./photographers/${photographer?.portrait}`} alt={photographer?.name} />
            </section>

            <section className="photograph-filter">
                <Dropdown get={selectedSort} set={setSelectedSort} />
            </section>

            <section className="photograph-gallery">
                {sortedMedias
                    .filter((m) => m.photographerId === photographerId)
                    .map((media, index) => (
                        <figure key={media.id} tabIndex={index + 2}>
                            <button type="button" onClick={() => openLightboxModal(media.id)} aria-label={'Voir en détail : ' + media.title}>
                                {media.image && <img src={`./medias/${photographerId}/${media.image}`} alt={media.title} />}
                                {media.video && (
                                    <video autoPlay loop poster="./src/assets/images/video.jpg">
                                        <source src={`./medias/${photographerId}/${media.video}`} type="video/mp4" />
                                        Votre navigateur ne permet pas de lire les vidéos. Vous pouvez toujours{' '}
                                        <a href={`./medias/${photographerId}/${media.video}`}>la télécharger</a>
                                    </video>
                                )}
                            </button>
                            <figcaption className="visually-hidden">
                                © {photographer?.name} — {media.title}
                            </figcaption>
                            <hgroup>
                                <button type="button" onClick={() => openLightboxModal(media.id)} aria-label={'Voir en détail : ' + media.title}>
                                    <h4>{media.title}</h4>
                                </button>
                                <button type="button" onClick={() => incrementLikes(media.id)} aria-label="Ajouter un like à la photo">
                                    <span className={!likeRef.current[media.id] ? 'like' : 'liked like'} aria-label="Likes :">
                                        {media.likes} <i className="fa fa-heart" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </hgroup>
                        </figure>
                    ))}
            </section>

            <div id="photograph-infobar">
                {medias.reduce((a, i) => a + i.likes, 0)} <i className="fa fa-heart" aria-hidden="true"></i>
                <span className="photograph-price" aria-label="Tarif : ">
                    {photographer?.price}€ / jour
                </span>
            </div>

            <ContactForm photographer={photographer} isOpen={modal === 'contact'} onClose={() => setModal(null)}></ContactForm>
            <LightboxModal
                photographer={photographer}
                media={sortedMedias}
                isOpen={modal === 'lightbox'}
                galleryId={galleryId}
                onClose={() => setModal(null)}
                onChange={(id) => setGalleryId(id)}
            ></LightboxModal>
        </article>
    );
};

export default Photographer;
