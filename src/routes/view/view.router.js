import { Router } from "express";

const router = Router();

//ruta de prueba de las vistas - http://localhost:3000/
router.get("/",(req,res) => {
    res.send("<h1>Welcome from the SaltyReviews view</h1>");
});

export default router;