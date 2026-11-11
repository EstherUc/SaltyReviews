import { Router } from "express";
import reviewRouter from "./review.router.js"
import userRouter from "./user.router.js";

const router = Router();

//ruta de prueba de las vistas - http://localhost:3000/
router.get("/",(req,res) => {
    res.send("<h1>Welcome from the SaltyReviews view</h1>");
});

//rutas de las vistas de reseñas
router.use("/review", reviewRouter);

//rutas de las vistas de usuarios
router.use("/user", userRouter);

export default router;