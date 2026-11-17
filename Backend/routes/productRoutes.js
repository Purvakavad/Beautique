import express from "express";
import { addProduct, getProducts, updateProduct, deleteProduct, getProductById, getFeaturedProducts } from '../Controllers/ProductController.js'
import upload from '../middleware/upload.js'
const productRouter = express.Router();
productRouter.get("/getProducts", getProducts);
productRouter.post("/addProduct", upload.single("image"), addProduct);
productRouter.put("/updateProduct/:id", upload.single("image"), updateProduct)
productRouter.delete("/deleteProduct/:id", deleteProduct)
productRouter.get("/getProductById/:id", getProductById)
productRouter.get("/getFeaturedProducts", getFeaturedProducts);
export default productRouter;