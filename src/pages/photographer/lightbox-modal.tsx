import { useEffect, useRef, useContext } from 'react';
import { Media } from '@/types/media';
import BrowserRouterContext from '@/router/context';

const LightboxModal = ({
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, galleryId]); //onClose

    const jumpGalleryID = (event: React.MouseEvent<HTMLButtonElement> | undefined, index: number | null = 0, direction: number = -1) => {
        if (event) event.preventDefault();
        const length = media.filter((m) => m.photographerId === photographerId).length;
        const p = Number(media.filter((m) => m.photographerId === photographerId).findIndex((m) => m.id === index));
        if (p !== undefined && direction === -1 && p === 0) onChange(media.filter((m) => m.photographerId === photographerId)[length - 1].id);
        else if (p !== undefined && direction === 1 && p === length - 1) onChange(media.filter((m) => m.photographerId === photographerId)[0].id);
        else if (p !== undefined && p !== -1) {
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

export default LightboxModal;
