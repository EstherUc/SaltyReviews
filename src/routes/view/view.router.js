import { Router } from "express";
import reviewRouter from "./review.router.js"
import userRouter from "./user.router.js";
<<<<<<< HEAD
//import categoryRouter from "./category.router.js";
import restaurantRouter from "./restaurant.router.js";
//import favoriteRouter from "./favorite.router.js";
=======
import categoryRouter from "./category.router.js";
//import restaurantRouter from "./restaurant.router.js";
import favoriteRouter from "./favorite.router.js";
>>>>>>> origin/dev
import authRouter from "./auth.router.js";


const router = Router();

//ruta de prueba de las vistas - http://localhost:3000/
// router.get("/",(req,res) => {
//     res.send("<h1>Welcome from the SaltyReviews view</h1>");
// });

// Redirigir la raíz a Home
router.get("/", (req, res) => {
    res.redirect("/home");
});

// Mostrar la página Home
router.get("/home", (req, res) => {
    res.render("home/home");
});

//Ruta de la vista de inicio - http://localhost:3000/home
router.get("/home", (req, res) => {
    res.render("home/home");
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

//ruta de autentificación - registo, login y logout
router.use("/auth", authRouter);

export default router;