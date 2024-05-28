import { Router } from "express";

import usersRouter from "./users.mjs";

import productsRouter from "./products.mjs";
import { resolveIndexByUserId } from "../utilis/middlewares.mjs";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
