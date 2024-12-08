import { useState, useId } from 'react'; //useLayoutEffect

const Dropdown = ({ get, set }: { get: string; set: React.Dispatch<React.SetStateAction<string>> }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const sortSelectId = useId();

    const sortType = [
        { value: 'likes', label: 'Popularité' },
        { value: 'date', label: 'Date' },
        { value: 'title', label: 'Titre' },
    ];

    const onSort = (key: string) => {
        setDropdownOpen(false);
        set(key);
    };

    return (
        <>
            <label id={'label-' + sortSelectId} htmlFor={sortSelectId}>
                Trier par
            </label>
            <div id={sortSelectId} className="select" tabIndex={0}>
                <button
                    className="select-button"
                    type="button"
                    role="listbox"
                    aria-expanded={dropdownOpen}
                    title="Bouton pour ouvrir le menu déroulant"
                    onClick={() => setDropdownOpen(true)}
                >
                    {sortType.find((t) => t.value == get)?.label}
                    <i className={dropdownOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'} aria-hidden="true"></i>
                </button>
                <ul className={dropdownOpen ? 'select-dropdown show' : 'select-dropdown hide'} role="listbox">
                    {sortType.map(({ value, label }) => (
                        <li className="item" aria-selected={get === value} key={value} onClick={() => onSort(value)} aria-labelledby={'label-' + sortSelectId}>
                            {label}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Dropdown;
