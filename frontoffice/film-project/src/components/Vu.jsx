import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';
import { useNavigate } from 'react-router-dom';

function Seen({setIsLoggedIn}) {
  const [seen, setSeen] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
    const fetchVu = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
          return;
        }

        const response = await axios.get(`http://maigalm.alwaysdata.net/getSeen/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(response.data.vus); // Vérifiez les données reçues dans la console

        const seenWithImages = await Promise.all(
          response.data.vus.map(async (film) => {
            try {
              const tmdbResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                  api_key: '8f2731e0e3d71639abbc2418427bb30a',
                  query: film.originalTitle
                }
              });

              if (tmdbResponse.data.results.length > 0) {
                const tmdbFilm = tmdbResponse.data.results[0];
                return {
                  ...film,
                  posterPath: tmdbFilm.poster_path
                };
              } else {
                return film;
              }
            } catch (error) {
              console.error('Error fetching TMDB data:', error);
              return film;
            }
          })
        );

        setSeen(seenWithImages);
      } catch (error) {
        console.error('Error fetching vu:', error);
      }
    };

    fetchVu();
  }, []);

  const handleRemoveFavoris = async (filmId) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`http://maigalm.alwaysdata.net/vus/remove/${userId}/${filmId}`);

      setSeen(prevSeen => prevSeen.filter(film => film._id !== filmId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

    const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <Header handleLogout={handleLogout} />
      <div className='favoris bg-gray-900 text-white min-h-screen pt-16'>
        <div className="container mx-auto py-8 p-10">
          <h1 className="text-3xl font-bold mb-4">Film vu</h1>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seen && seen.length > 0 ? (
              seen.map((film) => (
                <li key={film._id} className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700">
                  <div>
                    {film.posterPath && (
                      <img src={`https://image.tmdb.org/t/p/w500/${film.posterPath}`} alt={film.originalTitle} className="mt-4 w-full rounded-lg shadow-lg" />
                    )}
                    <p className="font-blue">Titre original: {film.originalTitle}</p>
                    <p>Pays: {film.country}</p>
                    <p>Genre: {film.gender}</p>
                    <p>Résumé: {film.synopsis}</p>
                    <p>Temps: {film.time}</p>
                    <button onClick={() => handleRemoveFavoris(film._id)} className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 mr-2 hover:bg-red-600 focus:outline-none">
                      Supprimer le film vu
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>Aucun film vu</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Seen;
