const express = require('express');
const app = express();
const routes = require('./Routes/router');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
app.set('view engine', 'ejs');

dotenv.config();

console.log('Configuration chargée depuis le fichier .env');
console.log('URI MongoDB :', process.env.MONGODB_URI);

//mongoose.connect('mongodb://localhost:27017/filmsDB');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('Connecté à MongoDB');
}).catch(err => {
  console.error('Erreur lors de la connexion à MongoDB :', err);
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Erreur de connexion à MongoDB : ', error);
});
db.once('open', function() {
  console.log("Connexion à MongoDB ouverte");
});

app.use((req, res, next) => {
  console.log('Requête reçue pour : ', req.url);
  next();
}, routes);

// Route de test
app.get('/test', (req, res) => {
  res.send('Serveur opérationnel');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
