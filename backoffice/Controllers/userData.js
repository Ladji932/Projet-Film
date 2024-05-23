const User = require('../Model/Users');
const Film = require('../Model/Film');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'lad_270';
const fs = require('fs');
const axios = require('axios')

/********************************FAVORIS*******************************************************************************/


exports.GetFavoris = async (req, res) => {
  
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('favoris');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ favoris: user.favoris });
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.GetSeenMovies = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('vus'); // Assuming 'vus' is an array of Film IDs

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ vus: user.vus });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
};

exports.GetVoirMovies = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('aVoir'); // Assuming 'aVoir' is an array of Film IDs

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ aVoir: user.aVoir });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
};


exports.AddToFavoris = async (req, res) => {
    const { userId, movieId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const film = await Film.findById(movieId);

        if (!film) {
            return res.status(404).json({ message: "Film non trouvé" });
        }

        if (user.favoris.includes(movieId)) {
            return res.status(400).json({ message: "Ce film est déjà dans les favoris de l'utilisateur" });
        }

        user.favoris.push(movieId);

        await user.save();

        res.status(200).json({ message: "Film ajouté aux favoris avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.RemoveFromFavoris = async (req, res) => {
  const { userId, filmId } = req.params;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.favoris.pull(filmId);
    await user.save();

    res.status(200).json({ message: "Film supprimé des favoris avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    res.status(500).json({ message: error.message });
  }
};

/********************************Vu*******************************************************************************/

exports.AddToVu = async (req, res) => {
    const { userId, movieId } = req.body;
    console.log(userId,movieId)

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const film = await Film.findById(movieId);

        if (!film) {
            return res.status(404).json({ message: "Film non trouvé" });
        }

        if (user.vus.includes(movieId)) {
            return res.status(400).json({ message: "Ce film est déjà dans les films vus de l'utilisateur" });
        }

        user.vus.push(movieId);

        await user.save();

        res.status(200).json({ message: "Film ajouté aux films vus avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout aux films vus:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.GetSeenMovies = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('vus');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ vus: user.vus });
  } catch (error) {
    console.error("Erreur lors de la récupération des films vus:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.RemoveFromVus = async (req, res) => {
  const { userId, filmId } = req.params;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.vus.pull(filmId);
    await user.save();

    res.status(200).json({ message: "Film supprimé des favoris avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    res.status(500).json({ message: error.message });
  }
};


/**********************A voir *************************************************************************** */
exports.AddToAVoir = async (req, res) => {
    const { userId, movieId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const film = await Film.findById(movieId);

        if (!film) {
            return res.status(404).json({ message: "Film non trouvé" });
        }

        if (user.aVoir.includes(movieId)) {
            return res.status(400).json({ message: "Ce film est déjà dans les films à voir de l'utilisateur" });
        }

        user.aVoir.push(movieId);

        await user.save();

        res.status(200).json({ message: "Film ajouté aux films à voir avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout aux films à voir:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.GetVoirMovies = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('aVoir');
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ vus: user.aVoir });
  } catch (error) {
    console.error("Erreur lors de la récupération des films vus:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.RemoveFromVoir = async (req, res) => {
  const { userId, filmId } = req.params;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.aVoir.pull(filmId);
    await user.save();

    res.status(200).json({ message: "Film supprimé des favoris avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    res.status(500).json({ message: error.message });
  }
};














exports.Login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }
        const token = jwt.sign({ username: foundUser.username }, secretKey, { expiresIn: '1h' });
        res.status(201).json({ token, userId: foundUser._id }); // Return user ID
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.GetAvatar = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const avatarBase64 = foundUser.avatar ? fs.readFileSync(foundUser.avatar).toString('base64') : null;
        res.status(200).json({ avatar: avatarBase64 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'avatar" });
    }
};

exports.Inscription = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cette adresse email est déjà utilisée." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarPath = req.file ? req.file.path : null;
        const newUser = new User({ username, email, password: hashedPassword, avatar: avatarPath, favoris: [] }); // Ajout du champ favoris
        await newUser.save();
        const token = jwt.sign({ username: newUser.username }, secretKey, { expiresIn: '1h' });
        req.token = token;
        const avatarBase64 = newUser.avatar ? fs.readFileSync(newUser.avatar).toString('base64') : null;

        res.status(201).json({ message: "Utilisateur enregistré avec succès", token, avatar: avatarBase64 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getFestivalsNearUser = async (req, res) => {
  try {
    const { latitude, longitude } = req.params; 
    console.log(latitude, longitude);
    const max_km = 50;
    const limit = 30;

    const url = `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records?where=%20within_distance(geocodage_xy%2C%20geom'POINT(${longitude}%20${latitude})'%2C%20${max_km}km)&limit=${limit}&refine=discipline_dominante%3A"Cinéma%2C%20audiovisuel"`;

    const response = await axios.get(url);
    const festivals = response.data.results;
    return res.status(200).json(festivals);
  } catch (err) {
    console.error("Erreur lors de la récupération des festivals :", err);
    return res.status(500).json({ error: "Erreur lors de la récupération des festivals" });
  }
};
