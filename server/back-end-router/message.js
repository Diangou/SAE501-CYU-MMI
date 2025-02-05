import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import querystring from "querystring";

import upload from "#server/uploader.js";

const base = "messages";
const router = express.Router();

// Get multiple authors
router.get(`/${base}`, async (req, res) => {
    const queryParams = querystring.stringify({ per_page: 7, ...req.query });
    let options = {
        method: "GET",
        url: `${res.locals.base_url}/api/${base}?${queryParams}`,
    };
    let result = {};
    try {
        result = await axios(options);
    } catch {}

    res.render("pages/back-end/messages/list.njk", {
        list_messages: result.data,
    });
});

export default router;
