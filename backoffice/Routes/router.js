const { FetchMovies, AddForm } = require('../Controllers/movies.Controller');
const { Inscription, Login } = require('../Controllers/userData');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

router.post('/addForm', csrfProtection, AddForm);
router.get('/', FetchMovies);
router.post('/inscription', Inscription);
router.post('/login', Login);

module.exports = router;    
