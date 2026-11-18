import { Router } from "express";
import reviewRouter from "./review.router.js"
import userRouter from "./user.router.js";
import categoryRouter from "./category.router.js";
import restaurantRouter from "./restaurant.router.js";
import favoriteRouter from "./favorite.router.js";

const router = Router();

//ruta de prueba de la API - http://localhost:3000/api
router.get("/",(req,res) => {
    res.json({message: "Hello, API SaltyReviews working"});
});

//Rutas de reseñas
router.use("/review", reviewRouter); //  /api/review

//Rutas de usuarios
router.use("/user",userRouter); //  /api/user

//Rutas de categorias
router.use("/category",categoryRouter); //  /api/category

//Rutas de favoritos
router.use("/favorite",favoriteRouter); //  /api/favorite

//Rutas de restaurantes
router.use("/restaurant",restaurantRouter); //  /api/restaurant

export default router;