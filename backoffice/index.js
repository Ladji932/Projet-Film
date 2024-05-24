//mongoose.connect('mongodb://localhost:27017/filmsDB');
const express = require('express');
const app = express();
const routes = require('./Routes/router');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
app.set('view engine', 'ejs');

dotenv.config();

// Log pour vérifier le chargement du fichier .env
console.log('Configuration chargée depuis le fichier .env');
console.log('URI MongoDB :', process.env.MONGODB_URI);

// Connexion simplifiée à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
