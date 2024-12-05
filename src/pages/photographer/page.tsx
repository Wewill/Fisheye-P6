import { useState, useEffect, useRef, useContext, useId } from 'react'; //useLayoutEffect
import { Data } from '@/types/data';
import { Media } from '@/types/media';
import BrowserRouterContext from '@/router/context';
import Link from '@/components/link';

type State = {
    data?: Data;
    loading: boolean;
    error?: string;
};

const ContactForm = ({ photographer, isOpen, onClose }: { photographer: { name?: string } | undefined; isOpen: boolean; onClose: () => void }) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // États pour les champs du formulaire
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        message: '',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Form data:', formData);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Close on ESC
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        if (isOpen) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]); // onClose

    return (
        <div id="contact_modal" className={isOpen ? 'show' : 'hide'} aria-hidden={isOpen ? 'false' : 'true'} role="dialog" aria-describedby="modalTitle">
            <div className="modal">
                <header>
                    <hgroup>
                        <h3 id="modalTitle">Contactez-moi</h3>
                        <h3>{photographer?.name}</h3>
                    </hgroup>
                    <button onClick={onClose} ref={closeButtonRef}>
                        <i className="close_button fa fa-close" aria-hidden="true" title="Fermer"></i>
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstname">Prénom</label>
                        <input type="text" name="firstname" id="firstname" value={formData.firstname} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor="lastname">Nom</label>
                        <input type="text" name="lastname" id="lastname" value={formData.lastname} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" cols={30} rows={10} value={formData.message} onChange={handleInputChange}></textarea>
                    </div>
                    <button type="submit" className="contact_button">
                        Envoyer
                    </button>
                </form>
            </div>
        </div>
    );
};

const Lightbox = ({
    photographer,
    media,
    isOpen,
    galleryId,
    onClose,
    onChange,
}: {
    photographer: { name?: string } | undefined;
    media: Media[];
    isOpen: boolean;
    galleryId: number;
    onClose: () => void;
    onChange: (galleryId: number) => void;
}) => {
    const { params } = useContext(BrowserRouterContext);
    const { photographerId } = params;
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Close on ESC
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }

            // Previous figure
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                jumpGalleryID(undefined, galleryId, -1);
            }

            // Next figure
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                jumpGalleryID(undefined, galleryId, 1);
            }
        };

        if (isOpen) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 100);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const jumpGalleryID = (event: React.MouseEvent<HTMLButtonElement> | undefined, index: number | null = 0, direction: number = -1) => {
        if (event) event.preventDefault();
        const length = media.filter((m) => m.photographerId === photographerId).length;
        const p = Number(media.filter((m) => m.photographerId === photographerId).findIndex((m) => m.id === index));
        if (p !== undefined && direction === -1 && p === 0) onChange(media.filter((m) => m.photographerId === photographerId)[length - 1].id);
        else if (p !== undefined && direction === 1 && p === length - 1) onChange(media.filter((m) => m.photographerId === photographerId)[0].id);
        else if (p !== undefined && p !== -1) {
            // setModal((prevModal) => {
            //     return {
            //         ...prevModal,
            //         gallery_id: media.filter((m) => m.photographerId === photographerId)[p + direction].id,
            //     };
            // });
            onChange(media.filter((m) => m.photographerId === photographerId)[p + direction].id);
        } else onClose();
    };
    if (!galleryId) return null;
    return (
        <div id="lightbox_modal" className={isOpen ? 'show' : 'hide'} aria-hidden={isOpen ? 'false' : 'true'} role="dialog" aria-describedby="galleryTitle">
            <div className="lightbox_wrap">
                {media
                    .filter((m) => m.photographerId === photographerId && m.id === galleryId)
                    .map((media, index) => (
                        <>
                            <button onClick={(event) => jumpGalleryID(event, galleryId, -1)}>
                                <i className="previous_button fa fa-chevron-left" aria-hidden="true" title="Précédent"></i>
                            </button>
                            <figure tabIndex={index}>
                                {media.image && <img src={`./medias/${photographerId}/${media.image}`} alt={media.title} />}
                                {media.video && (
                                    <video autoPlay loop>
                                        <source src={`./medias/${photographerId}/${media.video}`} type="video/mp4" />
                                    </video>
                                )}
                                <figcaption id="galleryTitle" className="--visually-hidden">
                                    © {photographer?.name} — {media.title}
                                </figcaption>
                            </figure>
                            <button onClick={(event) => jumpGalleryID(event, galleryId, 1)}>
                                <i className="next_button fa fa-chevron-right" aria-hidden="true" title="Suivant"></i>
                            </button>
                        </>
                    ))}
                <button onClick={onClose} ref={closeButtonRef}>
                    <i className="close_button fa fa-close" aria-hidden="true" title="Fermer"></i>
                </button>
            </div>
        </div>
    );
};

const Photographer = () => {
    const initRef = useRef(false);
    const [state, setState] = useState<State>({ loading: true });
    const [modal, setModal] = useState<null | 'contact' | 'lightbox'>(null);
    const [galleryId, setGalleryId] = useState(0);
    const [selectedSort, setSelectedSort] = useState('date');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const { params } = useContext(BrowserRouterContext);
    const { photographerId } = params;

    const openContactModal = () => {
        setModal('contact');
    };

    const openLightboxModal = (index: number = 0) => {
        setModal('lightbox');
        setGalleryId(index);
    };

    const sortSelectId = useId();

    const sortType = [
        { value: 'likes', label: 'Popularité' },
        { value: 'date', label: 'Date' },
        { value: 'title', label: 'Titre' },
    ];

    // const onSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     event.preventDefault();
    //     console.log('Sort', event.target.value);
    //     setSelectedSort(event.target.value);
    // };
    const onSort = (key: string) => {
        console.log('Sort', event, key);
        setDropdownOpen(false);
        setSelectedSort(key);
    };

    const sortMedia = (medias: Media[], key: string): Media[] => {
        console.log(sortMedia, medias, key);
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
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    media: prevState.data.media.map((m) => (m.id === mediaId ? { ...m, likes: m.likes + 1 } : m)),
                },
            };
        });
    };

    return (
        <article>
            <section className="photograph-header">
                <div>
                    <hgroup>
                        <h2>{photographer?.name}</h2>
                        <h4>
                            {photographer?.city}, {photographer?.country}
                        </h4>
                        <p className="muted">{photographer?.tagline}</p>
                    </hgroup>
                </div>
                <button className="contact_button" onClick={openContactModal}>
                    Contactez-moi
                </button>
                <img src={`./photographers/${photographer?.portrait}`} alt={photographer?.name} />
            </section>

            <section className="photograph-filter">
                <label htmlFor={sortSelectId}>Trier par</label>
                {/* <select id={sortSelectId} name="photograph-select" defaultValue={selectedSort} onChange={onSort}>
                    {sortType.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select> */}
                <div id={sortSelectId} className="select" tabIndex={0}>
                    <i className={dropdownOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'} aria-hidden="true"></i>
                    <button
                        className="select-button"
                        type="button"
                        role="listbox"
                        aria-expanded="true"
                        title="Bouton pour ouvrir le menu déroulant"
                        onClick={() => setDropdownOpen(true)}
                    >
                        {sortType.find((t) => t.value == selectedSort)?.label}
                    </button>
                    <ul className={dropdownOpen ? 'select-dropdown show' : 'select-dropdown hide'}>
                        {sortType.map(({ value, label }) => (
                            <li className="item" key={value} onClick={() => onSort(value)}>
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="photograph-gallery">
                {sortedMedias
                    .filter((m) => m.photographerId === photographerId)
                    .map((media) => (
                        <figure key={media.id}>
                            <button type="button" onClick={() => openLightboxModal(media.id)}>
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
                                <button type="button" onClick={() => openLightboxModal(media.id)}>
                                    <h4>{media.title}</h4>
                                </button>
                                <button type="button" onClick={() => incrementLikes(media.id)}>
                                    <span className="like">
                                        {media.likes} <i className="fa fa-heart" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </hgroup>
                        </figure>
                    ))}
            </section>

            <div id="photograph-infobar">
                {medias.reduce((a, i) => a + i.likes, 0)} <i className="fa fa-heart" aria-hidden="true"></i>
                <span className="photograph-price">{photographer?.price}€ / jour</span>
            </div>

            <ContactForm photographer={photographer} isOpen={modal === 'contact'} onClose={() => setModal(null)}></ContactForm>
            <Lightbox
                photographer={photographer}
                media={sortedMedias}
                isOpen={modal === 'lightbox'}
                galleryId={galleryId}
                onClose={() => setModal(null)}
                onChange={(id) => setGalleryId(id)}
            ></Lightbox>
        </article>
    );
};

export default Photographer;
