import express from "express";
import axios from "axios";
import { Types } from 'mongoose'; // Si tu utilises Mongoose



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

    res.render("pages/front-end/index.njk", {
        list_articles: result,
        currentPage: page,
        totalPages,
        totalArticles,
    });
});



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


router.get("/article-details/:id", routeName("article-details"), async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(404).render("pages/front-end/article-details.njk", {
            error: "Article non trouvé"
        });
    }

    try {
        const options = {
            method: "GET",
            url: `${res.locals.base_url}/api/articles/${id}`,
        };

        const response = await axios(options);
        const article = response.data;

        
        const commentsOptions = {
            method: "GET",
            url: `${res.locals.base_url}/api/articles/${id}/comments`,
        };

        let comments = { data: [], total_pages: 1, count: 0 };
        try {
            const commentsResponse = await axios(commentsOptions);
            comments = commentsResponse.data;
            console.log("Comments data:", JSON.stringify(comments, null, 2));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }

    
        if (comments && !comments.list_comments && comments.data) {
            comments.list_comments = comments.data;
        }
        
        let youtubeUrl = null;

        if (article.yt_video_id && (article.yt_video_id.includes('youtube.com') || article.yt_video_id.includes('youtu.be'))) {
            youtubeUrl = article.yt_video_id;
            console.log("Using YouTube URL from yt_video_id:", youtubeUrl);
        }
 
        else if (article.yt_video_id && article.yt_video_id.trim() !== '') {
            youtubeUrl = `https://www.youtube.com/watch?v=${article.yt_video_id}`;
            console.log("Creating YouTube URL from video ID:", youtubeUrl);
        }
        
        const bubbleColor = article.author?.color ? article.author.color : "bleu";
        const bubbleBorderColor = article.author?.colorborder ? article.author.colorborder : null;

        res.render("pages/front-end/article-details.njk", {
            article,
            comments,
            youtube_url: youtubeUrl,
            bubble_color: bubbleColor,
            bubble_border_color: bubbleBorderColor
        });
    } catch (error) {
        console.error("Error fetching article details:", error);
        res.status(404).render("pages/front-end/article-details.njk", {
            error: "Article non trouvé ou erreur lors de la récupération des données"
        });
    }
});

router.get("/auteur-details(.html)?", routeName("auteur-details"), async (_req, res) => {


    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/authors/${req.params.id}`,
    };

    let result = {};
    try {
        result = await axios(options);
    } catch (_error) {}

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
            bubble_color: author.color,          // ✅ Couleur de fond
            bubble_border_color: author.colorborder // ✅ Couleur de bordure
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
