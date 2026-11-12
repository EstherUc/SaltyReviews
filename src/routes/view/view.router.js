import { Router } from "express";
import reviewRouter from "./review.router.js"
import userRouter from "./user.router.js";
import categoryRouter from "./category.router.js";
import restaurantRouter from "./restaurant.router.js";
import favoriteRouter from "./favorite.router.js";

const router = Router();

//ruta de prueba de las vistas - http://localhost:3000/
router.get("/",(req,res) => {
    res.send("<h1>Welcome from the SaltyReviews view</h1>");
});

//rutas de las vistas de reseñas
router.use("/review", reviewRouter);

//rutas de las vistas de usuarios
router.use("/user", userRouter);

//Rutas de categorias
router.use("/category",categoryRouter); 

//Rutas de favoritos
router.use("/favorite",favoriteRouter); 

//Rutas de restaurantes
router.use("/restaurant",restaurantRouter); 

export default router;