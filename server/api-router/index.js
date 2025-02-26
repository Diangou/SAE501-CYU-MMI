import express from "express";

import SAERouter from "./sae.js";
import ArticleRouter from "./article.js";
import AuthorRouter from "./author.js";
import ArticleCommentRouter from "./comment-article.js";
import MessageRouter from "./message.js";


const router = express.Router();

router.use(SAERouter);
router.use(ArticleRouter);
router.use(AuthorRouter);
router.use(ArticleCommentRouter);
router.use(MessageRouter);
router.use((req, res, next) => {
    if (!req.path.startsWith("/api")) { 
        return res.status(404).render("pages/front-end/404.njk", {
            path: req.path,
        });
    }
    next(); // Continue vers d'autres middlewares si c'est une API
});

export default router;
