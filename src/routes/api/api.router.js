import { Router } from "express";

const router = Router();

//ruta de prueba de la API - http://localhost:3000/api
router.get("/",(req,res) => {
    res.json({message: "Hello, API SaltyReviews working"});
});

export default router;