import { Router } from "express";

import poc from "./poc.routes";

const router = Router();

router.use("/poc", poc);

export default router;
