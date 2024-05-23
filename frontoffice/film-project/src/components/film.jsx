import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import filmImage from '../assets/404.jpg';
import 'slick-carousel/slick/slick.css';
import { IoEyeOutline, IoEyeOffOutline, IoBookmarkOutline, IoBookmarkSharp } from 'react-icons/io5';
import { MdOutlineWatchLater, MdWatchLater } from "react-icons/md";




function Film({ favoris, setFavoris, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [films, setFilms] = useState([]);
  const [favorisIds, setFavorisIds] = useState([]);
  const [vuIds, setVuIds] = useState([]);
  const [aVoirIds, setAVoirIds] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    fetchData();
    fetchUserLists(); // Fetch user lists on component mount
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchUserLists = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        navigate('/connexion');
        return;
      }

      const [favorisResponse, vusResponse, aVoirResponse] = await Promise.all([
        axios.get(`http://localhost:4040/favoris/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:4040/vu/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:4040/aVoir/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      setFavorisIds(favorisResponse.data.favoris.map(film => film._id));
      setVuIds(vusResponse.data.vus.map(film => film._id));
      setAVoirIds(aVoirResponse.data.vus.map(film => film._id));
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

    if (scrollPercentage > 50) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  async function fetchData() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/connexion');
        return;
      }

      const filmResponse = await axios.get(`http://localhost:4040?page=${page}&limit=72`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const filmsWithImages = await Promise.all(
        filmResponse.data.map(async (film) => {
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

      setFilms(filmsWithImages);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleToggleFavoris = async (filmId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (isFilmInFavoris(filmId)) {
      try {
        await axios.delete(`http://localhost:4040/favoris/remove/${userId}/${filmId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavorisIds(prevFavorisIds => prevFavorisIds.filter(id => id !== filmId));
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:4040/favorisPost/add', {
          userId: userId,
          movieId: filmId
        });
        setFavorisIds(prevFavorisIds => [...prevFavorisIds, filmId]);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  const handleToggleVu = async (filmId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (isFilmInVu(filmId)) {
      try {
        await axios.delete(`http://localhost:4040/vus/remove/${userId}/${filmId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setVuIds(prevVuIds => prevVuIds.filter(id => id !== filmId));
      } catch (error) {
        console.error('Error removing from vu:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:4040/vu/add', {
          userId: userId,
          movieId: filmId
        });
        setVuIds(prevVuIds => [...prevVuIds, filmId]);
      } catch (error) {
        console.error('Error adding to vu:', error);
      }
    }
  };

  const handleToggleAVoir = async (filmId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (isFilmInAVoir(filmId)) {
      try {
        await axios.delete(`http://localhost:4040/aVoir/remove/${userId}/${filmId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAVoirIds(prevAVoirIds => prevAVoirIds.filter(id => id !== filmId));
      } catch (error) {
        console.error('Error removing from à voir:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:4040/aVoir/voirAdd', {
          userId: userId,
          movieId: filmId
        });
        setAVoirIds(prevAVoirIds => [...prevAVoirIds, filmId]);
      } catch (error) {
        console.error('Error adding to à voir:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const isFilmInFavoris = (filmId) => favorisIds.includes(filmId);
  const isFilmInVu = (filmId) => vuIds.includes(filmId);
  const isFilmInAVoir = (filmId) => aVoirIds.includes(filmId);

  const handlePageChange = (newPage) => setPage(newPage);

  const openPopup = (film) => {
    setSelectedFilm(film);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedFilm(null);
    setIsPopupOpen(false);
  };

  const handleCarouselImageClick = (film) => {
    setSelectedFilm(film);
    setIsPopupOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header handleLogout={handleLogout} />
      <div className="bg-black text-white min-h-screen">
        <div className="container mx-auto py-8 px-12">
          <Slider {...settings}>
            {films.map((film) => (
              <div key={film._id} className="w-full px-1 pt-20" onClick={() => handleCarouselImageClick(film)}>
                <img src={film.posterPath ? `https://image.tmdb.org/t/p/w500/${film.posterPath}` : filmImage} alt={film.originalTitle} className="w-full h-auto" />
              </div>
            ))}
          </Slider>

          {/* Liste des films */}
          <div className="container mx-auto p-12">
            <h1 className="text-3xl text-center font-bold mb-8">Liste des films</h1>
            {films.length === 0 && (
              <div className="text-center mt-8">
                <p className="text-xl">Aucun film trouvé.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
              {films.map((film) => (
                <div key={film._id} className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-red-500 w-full max-w-xs cursor-pointer">
                  <img src={film.posterPath ? `https://image.tmdb.org/t/p/w500/${film.posterPath}` : filmImage} alt={film.originalTitle} className="w-full h-45 object-cover" onClick={() => openPopup(film)} />
                  <hr className="border-gray-400" />
                  <div className="px-6 py-4" onClick={() => openPopup(film)}>
                    <div className="text-black font-bold text-sm">{film.originalTitle}</div>
                    <p className="text-black font-bold text-sm">Réalisateurs: {film.director}</p>
                    <p className="text-black font-bold text-sm">Pays: {film.country}</p>
                    <p className="text-black font-bold text-sm">Genre: {film.gender}</p>
                    <p className="text-black font-bold text-sm">Temps: {film.time}</p>
                    <p className="text-black font-bold text-sm">Année: {film.years}</p>
                  </div>
                  <div className="flex justify-between px-6 py-2 space-x-2">

                  <button onClick={() => handleToggleFavoris(film._id)} className={`px-1 py-1 rounded-md text-xs ${isFilmInFavoris(film._id) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
                {isFilmInFavoris(film._id) ? <IoBookmarkSharp size={20} /> : <IoBookmarkOutline size={20} />}
                </button>

                    
               <button
                onClick={() => handleToggleVu(film._id)}
                className={`px-1 py-1 rounded-md text-xs ${isFilmInVu(film._id) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
               {isFilmInVu(film._id) ? <IoEyeOutline size={20}/> : <IoEyeOffOutline size={20}/>} {/* Utilisation de IoEyeOutline pour les vus */}
              </button>

<button
  onClick={() => handleToggleAVoir(film._id)}
  className={`px-1 py-1 rounded-md text-xs ${isFilmInAVoir(film._id) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
>
  {isFilmInAVoir(film._id) ? <MdOutlineWatchLater size={20} /> : <MdWatchLater size={20}/>}  {/* Utilisation de IoEyeOutline également pour les à voir */}
</button>

                  </div>
                </div>
              ))}
            </div>

            {films.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Page Suivante
                </button>
              </div>
            )}
          </div>
        </div>

        {showScrollButton && (
          <button
            className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg"
            onClick={scrollToTop}
          >
            ↑
          </button>
        )}

{isPopupOpen && selectedFilm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75" onClick={closePopup}>
<div className="bg-white text-black p-2 rounded-lg shadow-lg max-w-screen-sm w-full md:w-1/2 lg:w-1/3 relative mt-3" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-sm font-semibold mb-1 text-center">{selectedFilm.originalTitle}</h3>
      <div className="aspect-w-16 aspect-h-9 mb-1">
        <img
          src={selectedFilm.posterPath ? `https://image.tmdb.org/t/p/w200${selectedFilm.posterPath}` : filmImage}
          alt={selectedFilm.originalTitle}
          className="object-cover w-full"
          style={{
            height: "50vh",
            width: "70%",
            margin:"auto"
          }}
        />
      </div>
              <p className="mb-1 p-4 text-1.3em">{selectedFilm.synopsis}
              </p>
      <div className="flex justify-between px-1 py-1 space-x-1">
        <button
          onClick={() => handleToggleFavoris(selectedFilm._id)}
          className={`px-1 py-1 rounded-md text-xs ${isFilmInFavoris(selectedFilm._id) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isFilmInFavoris(selectedFilm._id) ? <IoBookmarkSharp size={20} /> : <IoBookmarkOutline size={20}/>}
        </button>
        <button
          onClick={() => handleToggleVu(selectedFilm._id)}
          className={`px-1 py-1 rounded-md text-xs ${isFilmInVu(selectedFilm._id) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isFilmInVu(selectedFilm._id) ? <IoEyeOffOutline size={20}/> : <IoEyeOutline size={20}/>}
        </button>
        <button
          onClick={() => handleToggleAVoir(selectedFilm._id)}
          className={`px-1 py-1 rounded-md text-xs ${isFilmInAVoir(selectedFilm._id) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isFilmInAVoir(selectedFilm._id) ? <MdWatchLater size={20}/> : <MdOutlineWatchLater size={20} />}
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default Film;
