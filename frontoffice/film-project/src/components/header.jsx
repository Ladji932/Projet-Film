
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';


function Header({ handleLogout, setIsLoggedIn, isLoggedIn }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [avatar, setAvatar] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isUserLoggedIn = !!localStorage.getItem('token');



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
        if (isUserLoggedIn) {
            fetchAvatar();
        }
    }, [isUserLoggedIn]); 


    return (
        <header className="bg-gray-800 py-4 fixed w-full top-0 z-10">
            <nav className="container mx-auto flex justify-between items-center px-4">
                <div className="flex items-center">
                {isUserLoggedIn ? (
   <button 
   onClick={handleLogout} 
   className="block px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
>
   Déconnexion
</button>

) : (
    <>
        <Link to="/login" className="text-white text-sm bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded mr-2">
            Se connecter
        </Link>
        <Link to="/inscription" className="text-white text-sm bg-green-500 hover:bg-green-700 px-3 py-1 rounded">
            S'inscrire
        </Link>
    </>
)}

                    <form onSubmit={handleSubmit} className="ml-10">
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
                <div className="flex items-center justify-center flex-grow space-x-6">
                <Link 
        to="/" 
        className="hidden md:block px-3 py-1 text-sm text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
    >
        Accueil
    </Link>
    <Link 
        to="/map" 
        className="hidden md:block px-3 py-1 text-sm text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 transition-colors duration-300 ease-in-out"
    >
        Découvrez les festivals à proximité
    </Link>
    {isUserLoggedIn && avatar && (
        <img 
            src={`data:image/jpeg;base64,${avatar}`} 
            alt="Avatar de l'utilisateur" 
            className="h-10 w-10 bg-cover bg-center rounded-full" 
        />
    )}
</div>

                
                    <div>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-red-500 font-bold hover:text-red-300 focus:outline-none">
                            <svg xmlns="https://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <div className={`absolute right-2 mt-5 w-48 bg-gray-800 rounded-md shadow-lg py-2 transition duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 scale-0'}`}>
                            <Link to="/" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Accueil</Link>
                            <Link to="/favoris" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Vos films favoris</Link>
                            <Link to="/vus" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Vos films vus</Link>
                            <Link to="/voir" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-300">Vos films à voir</Link>
                            <Link to="/map" className="block px-4 py-2 text-sm text-blue-500 font-bold hover:text-blue-700 transition-colors duration-300 ease-in-out">Découvrez les festivals à proximité</Link>
                            {isUserLoggedIn ? (
    <button 
        onClick={handleLogout} 
        className="block px-4 py-2 text-sm text-red-500 font-bold hover:text-red-300"
    >
        Déconnexion
    </button>
) : null}

                           
                        </div>
                    </div>
                
            </nav>
        </header>
    );
}

export default Header;