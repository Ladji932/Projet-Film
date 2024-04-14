import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignupForm = ({ csrfToken }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null); // Ajout de l'état pour l'avatar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (avatar) { 
        formData.append('avatar', avatar);
      }
      // Ajouter le jeton CSRF à votre requête POST
      const response = await axios.post(
        'http://localhost:4040/inscription',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'CSRF-Token': csrfToken
          }
        }
      );
      console.log('Inscription réussie:', response.data);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.response.data.message);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]); // Mettre à jour l'état de l'avatar avec le fichier sélectionné
  };

  return (
    <div className='Home'>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleAvatarChange} /> {/* Champ de téléversement d'avatar */}
        <button type="submit">S'inscrire</button>
      </form>
      <Link to="/accueil">Se connecter</Link>
    </div>
  );
};

export default SignupForm;
