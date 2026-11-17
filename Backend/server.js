import "dotenv/config";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
const app = express();
connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);
app.use(cookieParser());
app.use(express.json());
const lazyRouter = (importPath, routerName = "default") => {
  let routerPromise;
  const loadRouter = () => {
    if (!routerPromise) {
      routerPromise = import(importPath)
        .then((module) => module[routerName] || module.default)
        .catch((error) => {
          routerPromise = null;
          throw error;
        });
    }
    return routerPromise;
  };
  return async (req, res, next) => {
    try {
      const router = await loadRouter();
      router(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
app.use("/api/auth", lazyRouter("./routes/authRoutes.js"));
app.use("/api/Product", lazyRouter("./routes/productRoutes.js"));
app.use("/api/cart", lazyRouter("./routes/cartRoutes.js"));
app.use("/api/order", lazyRouter("./routes/orderRoutes.js"));
app.use("/api/appointments", lazyRouter("./routes/appointmentRoutes.js"));
app.use("/api/dashboard", lazyRouter("./routes/dashboardRoutes.js"));
app.use("/api/admin", lazyRouter("./routes/adminRoutes.js"));
app.use("/api/categories", lazyRouter("./routes/categoryRoutes.js"));
app.use("/api/contacts", lazyRouter("./routes/contactRoutes.js"));
app.use("/api/services", lazyRouter("./routes/serviceRoutes.js"));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Beautique Backend API is running!",
  });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Beautique Server Started Successfully!");
  console.log(`Server running on port ${PORT}`);
});
