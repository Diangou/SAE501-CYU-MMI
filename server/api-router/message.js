import express from "express";
import mongoose from "mongoose";
import querystring from "querystring";

import Message from "#models/message.js";

const router = express.Router();
const base = "messages";

router.post(`/${base}`, async (req, res) => {
    console.log("Données reçues:", req.body);
    const ressource = new Message({
        ...req.body,
        identity: req.body.je_suis,
    });

    try {
        await ressource.save();
        res.status(201).json(ressource);
    } catch (error) {
        res.status(400).json({
            errors: Object.values(error?.errors || {}).map(item => item.message),
        });
    }
});

router.get(`/${base}`, async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    let perPage = Number(req.query.per_page) || 7;
    
    perPage = Math.min(Math.max(perPage, 1), 20);
    try {
        const listRessources = await Message.aggregate([
            { $sort: { _id: -1 } },
            { $skip: Math.max(page - 1, 0) * perPage },
            { $limit: perPage },
        ]);

        const count = await Message.countDocuments();

        const queryParam = { ...req.query };
        delete queryParam.page;

        res.status(200).json({
            data: listRessources,
            total_pages: Math.ceil(count / perPage),
            count,
            page,
            query_params: querystring.stringify(queryParam),
        });
    } catch (e) {
        res.status(400).json({
            errors: [
                ...Object.values(
                    e?.errors || [{ message: e?.message || "Il y a eu un problème" }]
                ).map(val => val.message),
            ],
        });
    }
})

router.get(`/${base}/:id`, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: "Message non trouvé" });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            errors: [error.message || "Une erreur est survenue lors de la récupération du message"],
        });
    }
});

export default router;
