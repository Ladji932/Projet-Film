const Film = require('../Model/Film');
const fs = require("fs");
const XLSX = require('xlsx');
const chokidar = require('chokidar');

const filePath = './film.xlsx';

const fileExists = async (path) => {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Le fichier Excel n\'existe pas.');
                console.error(err);
                reject(false);
            } else {
                console.log('Le fichier Excel existe.');
                resolve(true);
            }
        });
    });
};

const readFilmxlsx = async () => {
    try {
        const exists = await fileExists(filePath);
        if (!exists) {
            console.error("Le fichier Excel n'existe pas.");
            return;
        }

        const data = fs.readFileSync(filePath);
        const workbook = XLSX.read(data, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const filmsData = XLSX.utils.sheet_to_json(worksheet);

        for (const filmData of filmsData) {
            try {
                const existingFilm = await Film.findOne({ originalTitle: filmData.Titre });
                if (existingFilm) {
                    console.log(`Le film "${filmData.Titre}" existe déjà dans la base de données. Ignoré.`);
                    continue; 
                }

                const nouveauFilm = new Film({
                    originalTitle: filmData.Titre,
                    director: filmData.Réalisateurs,
                    years: filmData.Année,
                    country: filmData.Nationalité,
                    time: filmData.Durée,
                    gender: filmData.Genre,
                    synopsis: filmData.Synopsis
                });
                await nouveauFilm.save();
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du film :', error);
                continue;
            }
        }

        console.log('Les films ont été importés avec succès depuis le fichier Excel');
    } catch (error) {
        console.error('Erreur lors de l\'importation des films depuis le fichier Excel :', error);
    }
};


const watchExcelFile = async () => {
    try {
        const watcher = chokidar.watch(filePath, {
            persistent: true
        });

        watcher.on('change', async () => {
             await Film.deleteMany();
            await readFilmxlsx();
        });
    } catch (error) {
        console.error('Erreur lors de la surveillance du fichier Excel :', error);
    }
};

watchExcelFile();

module.exports.FetchMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 70; 
        const startIndex = (page - 1) * limit;

       

        const filmsCount = await Film.countDocuments();

        if (filmsCount === 0) {
            await readFilmxlsx(); 
        }

        const films = await Film.find().skip(startIndex).limit(limit);
        res.json(films);
    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur s'est produite");
    }
};

module.exports.SearchMovies = async (req, res) => {
    try {
        const searchQuery = req.body.query;

        if (typeof searchQuery !== 'string') {
            return res.status(400).json({ message: "Le paramètre de recherche est invalide." });
        }

        if (!searchQuery.trim()) {
            console.log("vide")
            return res.json([]);
        }

        const films = await Film.find({ originalTitle: { $regex: searchQuery.trim(), $options: 'i' } });
        console.log(films)
        
        res.json(films);
    } catch (error) {
        console.error('Erreur lors de la recherche de films:', error);
        res.status(500).json({ message: "Erreur lors de la recherche de films" });
    }
};


module.exports.AddForm = async (req, res) => {
    try {
        let datas = req.body;
        const lastFilm = await Film.findOne().sort({ _id: -1 });
        let lastId = lastFilm ? lastFilm._id : 0;

        const newId = lastId ? parseInt(lastId) + 1 : 1;

        const nouveauFilm = new Film({
            _id: newId,
            originalTitle: datas.originalTitle,
            director: datas.director,
            years: datas.years,
            country: datas.country,
            time: datas.time,
            gender: datas.gender,
            synopsis: datas.text
        });

        await nouveauFilm.save();

        console.log('Formulaire enregistré avec succès');
        res.render("add");
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du formulaire:', error);
        res.status(500).send('Erreur lors de l\'enregistrement du formulaire');
    }
};

module.exports.DeleteFilm = async (req, res) => {
    try {
        const films = await Film.find();
        res.render("delete", { films: films });
    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur s'est produite");
    }
};

module.exports.DeleteFilmId = async (req, res) => {
    try {
        const filmId = req.params.id;
        await Film.findByIdAndDelete(filmId);
        res.redirect("/deleteFilm");
    } catch (error) {
        console.error('Erreur lors de la suppression du film:', error);
        res.status(500).json({ message: "Erreur lors de la suppression du film" });
    }
};

