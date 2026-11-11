import { Router } from "express";
import reviewRouter from "./review.router.js"
import userRouter from "./user.router.js";

const router = Router();

//ruta de prueba de la API - http://localhost:3000/api
router.get("/",(req,res) => {
    res.json({message: "Hello, API SaltyReviews working"});
});

//Rutas de reseñas
router.use("/review", reviewRouter); //  /api/review

//Rutas de usuarios
router.use("/user",userRouter); //  /api/user

export default router;