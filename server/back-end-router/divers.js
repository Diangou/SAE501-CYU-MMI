// server/back-end-router/divers.js
import express from "express";
import { getJpoData, updateJpoData } from "../utils/jpoManager.js";

const router = express.Router();

// Afficher la page Divers avec la date actuelle des JPO
router.get("/", async (req, res) => {
    const jpoData = await getJpoData();
    res.render("pages/back-end/divers/index.njk", { jpoData });
});

router.post("/", async (req, res) => {
    console.log(" Données reçues sur le serveur :", req.body); 

    if (!req.body.date || !req.body.time) {
        return res.status(400).json({ success: false, message: "Date et heure requises" });
    }

    const success = await updateJpoData({ jpo: [{ date: req.body.date, time: req.body.time }] });

    console.log("Mise à jour réussie ?", success); 

    if (success) {
        res.json({ success: true, message: "Mise à jour réussie !" });
    } else {
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour." });
    }
});


export default router;
