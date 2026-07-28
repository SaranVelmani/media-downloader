import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { validateUrlBody } from "../middleware/validateUrl";
import { asyncHandler } from "../middleware/errorHandler";
import { analyzeController } from "../controllers/analyzeController";
import { downloadController } from "../controllers/downloadController";
import { healthController } from "../controllers/healthController";

const router = Router();

const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "SERVER_BUSY", message: "Too many requests. Please slow down." } },
});

router.get("/health", healthController);
router.post("/analyze", limiter, validateUrlBody, asyncHandler(async (req, res) => analyzeController(req, res)));
router.post("/download", limiter, validateUrlBody, asyncHandler(async (req, res) => downloadController(req, res)));

export default router;
