import { useEffect, useRef } from 'react'; //useLayoutEffect

const ContactForm = ({ photographer, isOpen, onClose }: { photographer: { name?: string } | undefined; isOpen: boolean; onClose: () => void }) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target as HTMLFormElement).entries());
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        <input type="text" name="firstname" id="firstname" />
                    </div>
                    <div>
                        <label htmlFor="lastname">Nom</label>
                        <input type="text" name="lastname" id="lastname" />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" />
                    </div>
                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" cols={30} rows={10}></textarea>
                    </div>
                    <button type="submit" className="contact_button">
                        Envoyer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
