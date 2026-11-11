import { Router } from "express";
import reviewRouter from "./review.router.js"

const router = Router();

//ruta de prueba de la API - http://localhost:3000/api
router.get("/",(req,res) => {
    res.json({message: "Hello, API SaltyReviews working"});
});

router.use("/review", reviewRouter);

export default router;