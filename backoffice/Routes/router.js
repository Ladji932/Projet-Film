const express = require('express');
const router = express.Router();
const cors = require('cors');
const csrf = require('csurf');
const { FetchMovies, AddForm , SearchMovies } = require('../Controllers/movies.Controller');
const { GetAvatar , AddToFavoris ,Inscription, Login, GetFavoris,RemoveFromFavoris, AddToAVoir, AddToVu, GetSeenMovies, RemoveFromVus, GetVoirMovies, RemoveFromVoir, getFestivalsNearUser, postFestival} = require('../Controllers/userData');
const multer = require('multer');
const fs = require('fs');

const csrfProtection = csrf({ cookie: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const avatarsDir = './image';
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir);
    }
    cb(null, avatarsDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const multerMiddleware = multer({ storage: storage });


router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

router.post('/addForm', csrfProtection, AddForm);
router.get('/', FetchMovies);
router.post('/login', Login);
router.get('/avatar/:userId', GetAvatar);

router.get('/favoris/:userId', GetFavoris);
router.get('/vu/:userId', GetSeenMovies);
router.get('/aVoir/:userId', GetVoirMovies);

router.post('/favorisPost/add', AddToFavoris);
router.post('/vu/add', AddToVu);
router.get('/getSeen/:userId', GetSeenMovies);
router.delete('/favoris/remove/:userId/:filmId', RemoveFromFavoris);
router.delete('/vus/remove/:userId/:filmId', RemoveFromVus);
router.delete('/aVoir/remove/:userId/:filmId', RemoveFromVoir); 
router.get('/getVoirMovies/:userId', GetVoirMovies); 
router.post('/aVoir/voirAdd', AddToAVoir); 
router.post('/search', SearchMovies);
router.post('/inscription', multerMiddleware.single('avatar'), Inscription);
router.get("/festivalOne/:latitude/:longitude", getFestivalsNearUser);
module.exports = router;
