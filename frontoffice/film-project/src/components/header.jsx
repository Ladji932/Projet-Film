import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';

function Header({ handleLogout }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://maigalm.alwaysdata.net/search', { query: searchTerm });
            const searchData = response.data;
            window.location.href = `/search-results/${encodeURIComponent(JSON.stringify(searchData))}`;
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
        }
    };

    async function fetchAvatar() {
        try {
            const userId = localStorage.getItem('userId');
            const avatarResponse = await axios.get(`https://maigalm.alwaysdata.net/avatar/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            setAvatar(avatarResponse.data.avatar);
        } catch (error) {
            console.error('Error fetching avatar:', error);
        }
    }
    
    useEffect(() => {
        fetchAvatar();
    }, []); 

    return (
        <header className="bg-gray-800 py-4 fixed w-full top-0 z-10">
            <nav className="container mx-auto flex justify-between items-center px-4">
                <div className="flex items-center">
                    <Link to="/film" className="text-white text-xl pr-10">Cinémathèque</Link>

                    <form onSubmit={handleSubmit} className="ml-4">
                        <input
                            type="text"
                            placeholder="Rechercher un film..."
                            value={searchTerm}
                            onChange={handleChange}
                            className="px-2 py-1 rounded-md focus:outline-none"
                        />
                        <button type="submit" className="bg-red-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-red-600 focus:outline-none">Rechercher</button>
                    </form>
                </div>
                <div className="flex items-center justify-center flex-grow">
                    {avatar && <img src={`data:image/jpeg;base64,${avatar}`} alt="Avatar de l'utilisateur"
                           className="h-10 w- bg-cover bg-center"  />}
                </div>
                <div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-red-500 font-bold hover:text-red-300 focus:outline-none">
                        <svg xmlns="https://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <div className={`absolute right-2 mt-5 w-48 bg-gray-800 rounded-md shadow-lg py-2 transition duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 scale-0'}`}>
                        <Link to="/film" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Tous les films</Link>
                        <Link to="/favoris" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Vos films favoris</Link>
                        <Link to="/vus" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Vos films vus</Link>
                        <Link to="/voir" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Vos films à voir</Link>
                        <Link to="/map" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-700 transition-colors duration-300 ease-in-out">Découvrez les festivals à proximité</Link>
                        <button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-500 font-bold hover:text-red-300">Déconnexion</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
