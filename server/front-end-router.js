import express from "express";
import axios from "axios";
import { Types } from 'mongoose'; // Si tu utilises Mongoose


import routeName from "#server/utils/name-route.middleware.js";
import parseManifest from "#server/utils/parse-manifest.js";

const router = express.Router();

router.use(async (_req, res, next) => {
    const originalRender = res.render;
    res.render = async function (view, local, callback) {
        const manifest = {
            manifest: await parseManifest("frontend.manifest.json"),
        };

        const args = [view, { ...local, ...manifest }, callback];
        originalRender.apply(this, args);
    };

    next();
});

router.get("/", routeName("homepage"), async (req, res) => {
    const queryParams = new URLSearchParams(req.query).toString();
    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/articles?${queryParams}&is_active=true`,
    };
    let result = {};
    try {
        result = await axios(options);
    } catch (_error) {}

    res.render("pages/front-end/index.njk", {
        list_articles: result.data,
    });
});

// "(.html)?" makes ".html" optional in the url
router.get("/a-propos(.html)?", routeName("about"), async (_req, res) => {
    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/saes?per_page=9`,
    };

    let result = {};
    try {
        result = await axios(options);
    } catch (_error) {}

    res.render("pages/front-end/about.njk", {
        list_saes: result.data,
    });
});


router.get("/nous-contacter", async (req, res) => {
    res.render("pages/front-end/contact.njk");
});

router.get("/lieux", async (req, res) => {
    res.render("pages/front-end/lieux.njk");
});

router.get("/sur-les-medias", async (req, res) => {
    res.render("pages/front-end/sur-les-medias.njk");
});


router.get("/article-details", async (req, res) => {
    res.render("pages/front-end/article-details.njk");
});

router.get("/auteur-details", async (req, res) => {
    res.render("pages/front-end/auteur-details.njk");
});




router.get('/auteur-details/:id', async (req, res) => {
    const { id } = req.params;

    // Validation de l'ID comme ObjectId si tu utilises MongoDB/Mongoose
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            errors: [`"${id}" n'est pas un id valide`],
        });
    }

    try {
        const author = await Author.findById(id);  // Ne pas peupler les articles pour tester
        if (!author) {
            return res.status(404).json({ errors: [`L'auteur avec l'ID ${id} n'existe pas.`] });
        }
        return res.status(200).json(author);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'auteur:', err);
        return res.status(500).json({
            errors: [`Erreur serveur lors de la récupération de l'auteur.`],
        });
    }
    
});


export default router;
