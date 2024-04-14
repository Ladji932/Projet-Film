import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Film({ favoris, setFavoris, setIsLoggedIn }) {
  const [films, setFilms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:4040');
        setFilms(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    
  }, [favoris]); 

const handleAddFavoris = (film) => {
  setFavoris([...favoris, film]);
};


  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <div className='pageMovies'>
      <header>
        <nav>
           <Link to="/favoris">Tous les films</Link> 
           <Link to="/favoris">Favoris</Link> 
           <Link to="/favoris">Vus et à Voir</Link> 
        </nav>
      </header>
<div className="right">
      <h1>Liste des films</h1>
      <button onClick={handleLogout}>Déconnexion</button>
      {films.length > 0 ? (
        <ol>
          <div>
            {films.map((film) => (
              <li key={film.id}>
                <div>
                  <strong> Titre original: </strong> {film.originalTitle}
                  <br/>
                  <strong> Pays: </strong> {film.country}
                  <br/>
                  <strong> Genre: </strong> {film.gender}
                  <br/>
                  <strong> Résumé: </strong> {film.synopsis}
                  <br/>
                  <strong> Temps: </strong> {film.time}
                  <br/>
                  <br/>
                  <button onClick={() => handleAddFavoris(film)}>Ajouter à vos favoris</button>
                  <br />
                  <br/>
                  <br/>
                </div>
              </li>
            ))}
          </div>
        </ol>
      ) : (
        <p>Chargement...</p>
      )}
      </div>
      </div>
  );
}

export default Film;
