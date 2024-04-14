import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home({ setIsLoggedIn, csrfToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:4040/login',
        { username, password },
        { headers: { 'CSRF-Token': csrfToken } }
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate('/Film');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response.data.message);
    }
  };

  return (
    <div className='Home'>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Connexion</button>
      </form>
      <Link to="/inscription">Vous n'avez pas de compte ? Inscrivez-vous ici</Link>
    </div>
  );
}

export default Home;
