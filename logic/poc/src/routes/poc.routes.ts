/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from "express";
import { logger } from "../../../common/powertools";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    logger.info("REQUEST", { req });
    res.status(200).json({ path: "/poc/" });
  } catch (error) {
    console.error("An error ocurred:", error);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    logger.info("REQUEST", { req });
    res.status(200).json({ path: "/poc/:id" });
  } catch (error) {
    console.error("An error ocurred:", error);
    res.status(500).json(error);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    res.status(201).json({});
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json(error);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    res.status(200).json({});
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    res.status(200).json({});
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json(error);
  }
});

export default router;
