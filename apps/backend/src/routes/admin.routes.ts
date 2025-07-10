import { Router } from "express";
import {
  adminLogin,
  getSummary,
  listUsers,
  listTransactions,
  getConfigHandler,
  updateConfigHandler,
  updateUserAdmin,
  getSystemOverview,
} from "../controllers/admin.controller";
import { requireAdmin } from "../utils/adminAuth";

const router = Router();

router.post("/login", adminLogin);
router.get("/summary", requireAdmin, getSummary);
router.get("/users", requireAdmin, listUsers);
router.get("/transactions", requireAdmin, listTransactions);
router.get("/config", requireAdmin, getConfigHandler);
router.put("/config", requireAdmin, updateConfigHandler);
router.put("/users/:id", requireAdmin, updateUserAdmin);
router.get("/overview", requireAdmin, getSystemOverview);

export default router;
