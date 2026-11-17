import express from "express";
import { getDashboardStats } from "../Controllers/dashboardController.js";
const dashboardRouter = express.Router();
dashboardRouter.get("/stats", getDashboardStats);
export default dashboardRouter;
