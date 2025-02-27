import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import querystring from "querystring";
import routeName from "#server/utils/name-route.middleware.js";
import upload from "#server/uploader.js";

const base = "articles";
const router = express.Router();

// Get multiple articles
router.get(`/${base}`, routeName("article_list"), async (req, res) => {
    const queryParams = querystring.stringify(req.query);
    const options = {
        method: "GET",
        url: `${res.locals.base_url}/api/${base}?${queryParams}`,
    };
    let result = {};

    try {
        result = await axios(options);
    } catch { }


    const successMessage = req.session.successMessage || null;
    req.session.successMessage = null;

    res.render("pages/back-end/articles/list.njk", {
        list_articles: result.data,
        messages: { success: successMessage },
    });
});


// Get or create article
router
    .route([`/${base}/:id`, `/${base}/add`])
    .get(routeName("article_form"), async (req, res) => {
        const isEdit = req.params.id !== "add";

        let result = {};
        let listErrors = [];
        let listAuthors = [];

        try {
            if (isEdit) {
                const options = {
                    method: "GET",
                    url: `${res.locals.base_url}/api/${base}/${req.params.id}`,
                };
                result = await axios(options);
            }

            // Fetch authors for selection
            const authorsResponse = await axios({
                method: "GET",
                url: `${res.locals.base_url}/api/authors`,
            });
            listAuthors = authorsResponse.data.data;
        } catch (error) {
            listErrors = error.response?.data?.errors || [];
        }

        res.render("pages/back-end/articles/add-edit.njk", {
            article: result?.data || {},
            list_errors: listErrors,
            list_authors: listAuthors,
            is_edit: isEdit,
        });
    });

// Create or update article
router.post([`/${base}/:id`, `/${base}/add`], upload.single("image"), async (req, res) => {
    let ressource = {};
    const isEdit = mongoose.Types.ObjectId.isValid(req.params.id);
    let listErrors = [];
    let listAuthors = [];

    let options = {
        headers: { "Content-Type": "multipart/form-data" },
        data: { ...req.body, file: req.file },
    };

    options.method = isEdit ? "PUT" : "POST";
    options.url = isEdit
        ? `${res.locals.base_url}/api/${base}/${req.params.id}`
        : `${res.locals.base_url}/api/${base}`;

    try {
        const result = await axios(options);
        ressource = result.data;

        // Récupérer à nouveau les auteurs après modification
        const authorsResponse = await axios({
            method: "GET",
            url: `${res.locals.base_url}/api/authors`,
        });
        listAuthors = authorsResponse.data.data;


        req.session.successMessage = isEdit
            ? "L'article a bien été modifié !"
            : "L'article a bien été ajouté !";


        res.redirect(`${res.locals.admin_url}/${base}`);

    } catch (e) {
        listErrors = e.response?.data?.errors || [];
        ressource = e.response?.data?.ressource || {};

        res.render("pages/back-end/articles/add-edit.njk", {
            article: ressource,
            list_errors: listErrors,
            list_authors: listAuthors,
            is_edit: isEdit,
            messages: { success: req.session.successMessage || null },
        });
    }
});



export default router;
