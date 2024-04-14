import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Film from './components/film';
import SignupForm from './components/SignupForm';
import Home from './home';
import NotFound from './components/404';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [favoris, setFavoris] = useState([]);

  console.log(favoris)

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);


  return (
    <div>
      <BrowserRouter>
        <Routes>
          {isLoggedIn ? (
            <Route path='/Film' element={<Film setIsLoggedIn={setIsLoggedIn} favoris={favoris} setFavoris={setFavoris} />} />
          ) : (
            <Route path='/' element={<Home setIsLoggedIn={setIsLoggedIn} />} />
          )}
          <Route path='/accueil' element={<Home setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/inscription' element={<SignupForm />} />
          <Route path='*' element={<NotFound />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
