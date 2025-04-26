import express from "express";
import { createNewsletter } from "../controllers/newsletter.controllers.js";

const router = express.Router();

router.post("/create", createNewsletter);

export const newsletterRoute = router;
