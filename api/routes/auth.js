import express from "express";
import { login, register, createFakeModel } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get('/create-fake-model', createFakeModel)

export default router