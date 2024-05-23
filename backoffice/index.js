const express = require('express');
const app = express();
const routes = require('./Routes/router');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
app.set('view engine', 'ejs');

dotenv.config();

//mongoose.connect('mongodb://localhost:27017/filmsDB');
//console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB : '));
db.once('open', function() {
  console.log("Connecté à MongoDB");
});


app.use('/', routes);


const port = 4040;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
