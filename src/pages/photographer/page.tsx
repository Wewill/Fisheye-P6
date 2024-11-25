import { useState, useEffect, useRef, useContext } from "react";
import { Data } from "@/types/data";
import BrowserRouterContext from "@/router/context";

type State = {
  data?: Data;
  loading: boolean;
  error?: string;
};

type modalState = {
  contact: boolean;
  lightbox: boolean;
  gallery_id?: number | null;
};

const ContactForm = ({
  photographer,
  isOpen,
  onClose,
}: {
  photographer: {};
  isOpen: boolean;
}) => {
  return (
    <div id="contact_modal" className={isOpen ? "show" : "hide"}>
      <div className="modal">
        <header>
          <h3>Contactez-moi</h3>
          <h3>{photographer?.name}</h3>
          <button className="close_button" onClick={onClose}>
            <i className="fa fa-close" aria-hidden="true" title="Fermer"></i>
          </button>
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
  );
};

const Photographer = () => {
  const initRef = useRef(false);
  const [state, setState] = useState<State>({ loading: true });
  const [modal, setModal] = useState<modalState>({
    contact: false,
    lightbox: false,
  });
  const { params } = useContext(BrowserRouterContext);
  const { photographerId } = params;

  const toggleContactModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModal((prevModal) => {
      return { ...prevModal, contact: !prevModal.contact };
    });
  };

  const toggleLightboxModal = (
    event: React.MouseEvent<HTMLElement>,
    index: number = 0
  ) => {
    event.preventDefault();
    setModal((prevModal) => {
      return { ...prevModal, lightbox: !prevModal.lightbox, gallery_id: index };
    });
  };

  const prevGalleryID = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number | null = 0
  ) => {
    event.preventDefault();
    const p = state.data?.media
      .filter((m) => m.photographerId === photographerId)
      .findIndex((m) => m.id === index);
    console.log(
      "prevGalleryID::",
      index,
      p,
      state.data?.media.filter((m) => m.photographerId === photographerId),
      state.data?.media.filter((m) => m.photographerId === photographerId)[
        p - 1
      ].id
    );
    if (p !== undefined && p !== -1) {
      setModal((prevModal) => {
        return {
          ...prevModal,
          gallery_id: state.data?.media.filter(
            (m) => m.photographerId === photographerId
          )[p - 1].id,
        };
      });
    }
  };

  const nextGalleryID = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number | null = 0
  ) => {
    event.preventDefault();
    const p = state.data?.media
      .filter((m) => m.photographerId === photographerId)
      .findIndex((m) => m.id === index);
    console.log(
      "nextGalleryID::",
      index,
      p,
      state.data?.media.filter((m) => m.photographerId === photographerId),
      state.data?.media.filter((m) => m.photographerId === photographerId)[
        p + 1
      ].id
    );
    if (p !== undefined && p !== -1) {
      setModal((prevModal) => {
        return {
          ...prevModal,
          gallery_id: state.data?.media.filter(
            (m) => m.photographerId === photographerId
          )[p + 1].id,
        };
      });
    }
  };

  useEffect(() => {
    if (initRef.current === true) return;
    const fetchData = async () => {
      try {
        const response = await fetch("./data/photographers.json");
        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }
        // console.log(response);
        const data: Data = await response.json();
        setState({ data, loading: false });
      } catch (error) {
        setState({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
        });
      }
    };
    initRef.current = true;
    fetchData();
  }, []); // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois après le rendu du composant

  if (state.loading) return <p>Chargement...</p>;
  if (state.error) return <p className="error">Erreur: {state.error}</p>;

  const photographer = state.data?.photographers.find(
    (p) => p.id === photographerId
  );

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
        <button className="contact_button" onClick={toggleContactModal}>
          Contactez-moi
        </button>
        <img
          src={`./photographers/${photographer?.portrait}`}
          alt={photographer?.name}
        />
      </section>
      #TODO Trier par...
      <section className="photograph-gallery">
        {state.data?.media
          .filter((m) => m.photographerId === photographerId)
          .map((media, index) => (
            <figure
              tabIndex={index}
              onClick={(event) => toggleLightboxModal(event, media.id)}
            >
              {media.image && (
                <img
                  src={`./medias/${photographerId}/${media.image}`}
                  alt={media.title}
                />
              )}
              {media.video && (
                <video autoPlay loop>
                  <source
                    src={`./medias/${photographerId}/${media.video}`}
                    type="video/mp4"
                  />
                </video>
              )}
              <figcaption className="visually-hidden">
                © {photographer?.name} — {media.title}
              </figcaption>
              <hgroup>
                <h4>{media.title}</h4>
                <span>
                  {media.likes}{" "}
                  <i className="fa fa-heart" aria-hidden="true"></i>
                </span>
              </hgroup>
            </figure>
          ))}
      </section>
      <div id="info_bar">
        567567 <i className="fa fa-heart" aria-hidden="true"></i> 300€/jour
      </div>
      <ContactForm
        photographer={photographer}
        isOpen={modal.contact === true}
        onClose={toggleContactModal}
      ></ContactForm>
      <div
        id="lightbox_modal"
        className={modal.lightbox === true ? "show" : "hide"}
      >
        Gallery id {modal.gallery_id}
        <button className="close_button" onClick={toggleLightboxModal}>
          <i className="fa fa-close" aria-hidden="true" title="Fermer"></i>
        </button>
        {state.data?.media
          .filter(
            (m) =>
              m.photographerId === photographerId && m.id === modal.gallery_id
          )
          .map((media, index) => (
            <>
              <button
                className="previous_button"
                onClick={(event) => prevGalleryID(event, modal.gallery_id)}
              >
                <i
                  className="fa fa-chevron-left"
                  aria-hidden="true"
                  title="Précédent"
                ></i>
              </button>
              <figure
                tabIndex={index}
                onClick={(event) => toggleLightboxModal(event, index)}
              >
                {media.image && (
                  <img
                    src={`./medias/${photographerId}/${media.image}`}
                    alt={media.title}
                    height="300"
                  />
                )}
                {media.video && (
                  <video autoPlay loop>
                    <source
                      src={`./medias/${photographerId}/${media.video}`}
                      type="video/mp4"
                    />
                  </video>
                )}
                <figcaption className="--visually-hidden">
                  ©{" "}
                  {
                    state.data?.photographers.find(
                      (p) => p.id === photographerId
                    )?.name
                  }{" "}
                  — {media.title}
                </figcaption>
              </figure>
              <button
                className="next_button"
                onClick={(event) => nextGalleryID(event, modal.gallery_id)}
              >
                <i
                  className="fa fa-chevron-right"
                  aria-hidden="true"
                  title="Suivant"
                ></i>
              </button>
            </>
          ))}
      </div>
    </article>
  );
};

export default Photographer;
