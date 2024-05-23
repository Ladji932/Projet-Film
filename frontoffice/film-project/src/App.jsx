import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Film from './components/film';
import SignupForm from './components/SignupForm';
import Home from './home';
import Favoris from "./components/Favoris";
import Vu from "./components/Vu";
import SearchResult from "./components/SearchResult"; 
import 'tailwindcss/tailwind.css';
import Voir from './components/Voir';
import Map from './components/Map';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [favoris, setFavoris] = useState(() => {
    const favorisFromStorage = localStorage.getItem('favoris');
    return favorisFromStorage ? JSON.parse(favorisFromStorage) : [];
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);


useEffect(() => {
  const getUserLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserLocation({ latitude: latitude, longitude: longitude });
      });
    } catch (error) {
      console.error(error);
      alert("Merci d'activer votre localisation pour utiliser cette fonctionnalité.");
    }
  };

  getUserLocation();
}, []);



  return (
    <BrowserRouter>
      <div>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path='/*' element={<Film setIsLoggedIn={setIsLoggedIn} favoris={favoris} setFavoris={setFavoris} userLocation={userLocation} />} /> 
              <Route path='/' element={<Film setIsLoggedIn={setIsLoggedIn} favoris={favoris} setFavoris={setFavoris} userLocation={userLocation} />} />
              <Route path='/film' element={<Film setIsLoggedIn={setIsLoggedIn} favoris={favoris} setFavoris={setFavoris} userLocation={userLocation} />} />
              <Route path='/favoris' element={<Favoris favoris={favoris} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path='/vus' element={<Vu setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path='/voir' element={<Voir setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path='/map' element={<Map userLocation= {userLocation} setIsLoggedIn={setIsLoggedIn}/>} />
              <Route path='/search-results/:searchTerm' element={<SearchResult setIsLoggedIn={setIsLoggedIn}/>} />
            </>
          ) : (
            <Route path='/' element={<Home setIsLoggedIn={setIsLoggedIn} />} />
          )}
          <Route path='/accueil' element={<Home setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/inscription' element={<SignupForm />} />
          <Route path='/*' element={<Home setIsLoggedIn={setIsLoggedIn} />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
