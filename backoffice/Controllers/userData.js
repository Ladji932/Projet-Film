const User = require('../Model/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'lad_270'; 
const fs = require('fs');
const upload = require('multer')(); 

// Connexion d'un utilisateur
module.exports.Login = async (req, res) => {
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
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Inscription d'un utilisateur
module.exports.Inscription = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let avatar = null;

        if (req.file) {
            avatar = fs.readFileSync(req.file.path);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, avatar });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur enregistré avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
