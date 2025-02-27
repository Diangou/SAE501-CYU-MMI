import express from "express";
import axios from "axios";
import { Types } from 'mongoose'; // Si tu utilises Mongoose
import { getJpoData, updateJpoData } from "#server/utils/jpoManager.js";


import routeName from "#server/utils/name-route.middleware.js";
import parseManifest from "#server/utils/parse-manifest.js";
import Author from "#database/models/author.js"; // Assure-toi que le chemin est correct


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
    const page = parseInt(req.query.page) || 1;
    const perPage = 2;

    const queryParams = new URLSearchParams({ page, per_page: perPage, is_active: "true" }).toString();

    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/articles?${queryParams}`,
    };

    let result = { data: [], total_pages: 1, count: 0 };
    try {
        const response = await axios(options);
        result = response.data;

        console.log("Résultat API :", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
    }

    // Utilisation correcte des données de l'API
    const totalPages = result.total_pages || 1;
    const totalArticles = result.count || 0;

    console.log(`Total articles: ${totalArticles}, Total pages: ${totalPages}`);  // Debugging

    const jpoData = await getJpoData();
    console.log("Données JPO récupérées :", jpoData, jpoData.jpo[0]); // Debug

    const firstJpo = jpoData.jpo && jpoData.jpo.length > 0 ? jpoData.jpo[0] : { date: "Non définie", time: "Non défini" };

    res.render("pages/front-end/index.njk", {
        list_articles: result,
        currentPage: page,
        totalPages,
        totalArticles,
        jpo_date: firstJpo.date,
        jpo_time: firstJpo.time
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
    } catch (_error) { }

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

router.get("/auteur-details(.html)?", routeName("auteur-details"), async (_req, res) => {


    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/authors/${req.params.id}`,
    };

    let result = {};
    try {
        result = await axios(options);
    } catch (_error) { }

    res.render("pages/front-end/auteur-details.njk", {
        list_authors: result.data,
    });
});




router.get('/auteur-details/:id', async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            errors: [`"${id}" n'est pas un ID valide.`],
        });
    }

    try {
        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).render("pages/front-end/auteur-details.njk", {
                error: `L'auteur avec l'ID ${id} n'existe pas.`,
            });
        }

        res.render("pages/front-end/auteur-details.njk", {
            author,
            bubble_color: author.color,          
            bubble_border_color: author.colorborder 
        });

    } catch (err) {
        console.error("Erreur lors de la récupération de l'auteur :", err);
        return res.status(500).render("pages/front-end/auteur-details.njk", {
            error: "Erreur serveur lors de la récupération de l'auteur.",
        });
    }
});

router.use((req, res) => {
    res.status(404).render("pages/front-end/404.njk", {
        title: "Page non trouvée",
    });
});






export default router;
