import express from "express";
import mongoose from "mongoose";
import querystring from "querystring";

import Message from "#models/message.js";

const router = express.Router();
const base = "messages";


router.post(`/${base}`, async (req, res) => {
    const ressource = new Message(req.body);

    try {
        await ressource.save();
        res.status(201).json(ressource);
    } catch (error) {
        res.status(400).json({
            errors: [
                error,
            ],
        })
    }
    
})



export default router;