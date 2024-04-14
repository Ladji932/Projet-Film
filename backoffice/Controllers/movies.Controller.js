const Film = require('../Model/Film');

// Récupération des films
module.exports.FetchMovies = async (req, res) => {
    try {
        const filmsCount = await Film.countDocuments();
        if (filmsCount === 0) {
            await readFilmxlsx();
        }
        const films = await Film.find();
        res.json(films);
    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur s'est produite");
    }
};

// Ajouter un Film
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
        res.send("ok");
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du formulaire:', error);
        res.status(500).send('Erreur lors de l\'enregistrement du formulaire');
    }
};

// Supprimer un Film
module.exports.DeleteFilm = async (req, res) => {
    try {
        const films = await Film.find();
        res.render("delete", { films: films });
    } catch (error) {
        console.log(error);
        res.status(500).send("Une erreur s'est produite");
    }
};

// Supprimer un Film par ID
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
