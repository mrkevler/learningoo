import { Router } from "express";
import { listMyTransactions } from "../controllers/transaction.controller";

const router = Router();

// For testing allow query param userId
router.get("/", listMyTransactions);

export default router;
