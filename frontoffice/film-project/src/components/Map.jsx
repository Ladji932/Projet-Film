import React, { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import Header from './header';
import { useNavigate } from 'react-router-dom';

function Map({ userLocation , setIsLoggedIn }) {
  const [festivals, setFestivals] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedFestivalIndex, setSelectedFestivalIndex] = useState(null);
  const mapRef = useRef(null);
    const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userLocation) return;
        const { latitude, longitude } = userLocation;
        const response = await axios.get(`http://maigalm.alwaysdata.net/festivalOne/${latitude}/${longitude}`);
        setFestivals(response.data);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
    };
  }, [userLocation]);

  useEffect(() => {
    if (dataLoaded && festivals.length > 0) {
      setSelectedFestivalIndex(0);
      handleMarkerClick([festivals[0].geocodage_xy.lat, festivals[0].geocodage_xy.lon], 0);
    }
  }, [dataLoaded, festivals]);

  const handleMarkerClick = (position, index) => {
    setSelectedFestivalIndex(index);
    if (mapRef.current) {
      mapRef.current.flyTo(position, 18);
    }
  };

  const handleDataItemClick = (index) => {
    setSelectedFestivalIndex(index);
    const festival = festivals[index];
    if (mapRef.current && festival) {
      mapRef.current.flyTo([festival.geocodage_xy.lat, festival.geocodage_xy.lon], 18);
    }
  };

    const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };


  return (
  <div>
    <Header handleLogout={handleLogout} />
    <div className="w-full h-screen flex flex-col bg-gradient-to-b from-purple-900 to-purple-800 text-white">
      <div className="h-3/5 border-b-2 border-gray-600 mt-15">
        {userLocation ? (
          <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={12} style={{ height: "100%" , zIndex: "0" }}  ref={mapRef}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
              onLoad={() => console.log("Tile layer loaded successfully")}
            />
            {festivals.map((festival, index) => (
              <Marker
                key={index}
                position={[festival.geocodage_xy.lat, festival.geocodage_xy.lon]}
                eventHandlers={{
                  click: () => handleMarkerClick([festival.geocodage_xy.lat, festival.geocodage_xy.lon], index)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-1">{festival.nom_du_festival}</h3>
                    {festival.adresse_postale && <p className="mb-1"><strong>Adresse :</strong> {festival.adresse_postale}</p>}
                    <p><strong>Lieu :</strong> {festival.libelle_epci_collage_en_valeur}</p>
                    <p><strong>Année de création :</strong> {festival.annee_de_creation_du_festival}</p>
                    <p><strong>Commune principale :</strong> {festival.commune_principale_de_deroulement}</p>
                    <p><strong>Département :</strong> {festival.departement_principal_de_deroulement}</p>
                    <p><strong>Discipline dominante :</strong> {festival.discipline_dominante}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>Votre position n'est pas disponible. Veuillez activer la localisation et recharger votre page pour utiliser cette fonctionnalité.</p>
          </div>
        )}
      </div>
      <div className="h-2/5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-2">
        {festivals.map((festival, index) => (
          <div key={index} className={`p-4 border cursor-pointer ${selectedFestivalIndex === index ? 'bg-blue-500' : 'hover:bg-purple-800'}`} onClick={() => handleDataItemClick(index)}>
            <h3 className="text-lg font-semibold mb-1">{festival.nom_du_festival}</h3>
            {festival.adresse_postale && <p className="mb-1"><strong>Adresse :</strong> {festival.adresse_postale}</p>}
            <p><strong>Lieu :</strong> {festival.libelle_epci_collage_en_valeur}</p>
            <p><strong>Année de création :</strong> {festival.annee_de_creation_du_festival}</p>
            <p><strong>Commune principale :</strong> {festival.commune_principale_de_deroulement}</p>
            <p><strong>Département :</strong> {festival.departement_principal_de_deroulement}</p>
            <p><strong>Discipline dominante :</strong> {festival.discipline_dominante}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}

export default Map;
