import { useState, useEffect } from 'react';
import { Data } from './types';

function Photographers() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) { 
          throw new Error(`HTTP Error status: ${response.status}`);
        }
        console.log(response);
        const data:Data = await response.json();
        setData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); 
  }, []);  // Tableau de dépendances vide pour n’exécuter l’effet qu'une fois

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className='error'>Erreur: {error}</p>;

  return (
    <>
      {data?.photographers.map((photographer, index) => (
        <article className="card" key={photographer.id} tabIndex={index+1}>
          <a aria-label={`Voir le profil de ${photographer.name}`} title={`Voir le profil de ${photographer.name}`}>
            <img src={`./photographers/${photographer.portrait}`} alt={photographer.name} />
            <hgroup>
              <h2>{photographer.name}</h2>
              <h5>{photographer.city}, {photographer.country}</h5>
              <p>{photographer.tagline}</p>
              <p className='muted'>{photographer.price}€/jour</p>
            </hgroup>
          </a>
        </article>
      ))}
    </>
  );
}

export default Photographers;