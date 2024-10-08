const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./Routes/router');

dotenv.config();

app.set('view engine', 'ejs');

console.log('Configuration chargée depuis le fichier .env');
console.log('URI MongoDB :', process.env.MONGODB_URI);

/*
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 120000,  
      connectTimeoutMS: 120000,          
      socketTimeoutMS: 120000,           
    });
    console.log('Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur lors de la connexion à MongoDB :', err);
  }
};

connectToDatabase();
*/

mongoose.connect('mongodb://localhost:27017/filmsDB');


const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Erreur de connexion à MongoDB : ', error);
});

db.once('open', async function() {
  console.log("Connexion à MongoDB ouverte");

  try {
    const collections = await mongoose.connection.db.listCollections({ name: 'films' }).toArray();
    if (collections.length === 0) {
      console.log("La collection 'films' n'existe pas.");
    } else {
      console.log("La collection 'films' existe.");
      const result = await mongoose.connection.db.collection('films').find().limit(1).toArray();
    }

    const count = await mongoose.connection.db.collection('films').countDocuments();
    console.log('Nombre de documents dans la collection films :', count);
  } catch (err) {
    console.error('Erreur lors de la récupération des films ou du comptage des documents :', err);
  }
});

app.use(routes);

app.use((req, res, next) => {
  console.log('Requête reçue pour : ', req.url);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;

