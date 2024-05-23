const express = require('express');
const app = express();
const routes = require('./Routes/router');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
app.set('view engine', 'ejs');

dotenv.config();

// Connexion à MongoDB avec les options mises à jour
//mongoose.connect('mongodb://localhost:27017/filmsDB');
mongoose.connect('mongodb+srv://maigaladji47:Lmaiga28032002.@cluste0.dsdxrbb.mongodb.net/filmsDB');
/*mongoose.connect(process.env.MONGODB_URI, { 
  serverSelectionTimeoutMS: 30000, // Délai de sélection du serveur (30 secondes)
  connectTimeoutMS: 30000, // 30 secondes pour la connexion
  socketTimeoutMS: 45000 // 45 secondes pour les opérations de socket
});*/

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB : '));
db.once('open', function() {
  console.log("Connecté à MongoDB");
});

app.use('/', routes);

const port = process.env.PORT || 4040;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});