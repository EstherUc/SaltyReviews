import { Router } from "express";
import restaurantViewController from "../../controllers/restaurant/restaurant.view.controller.js";

const router = Router();
// Ruta GET para mostrar todos los restaurantes
router.get("/", restaurantViewController.getAll);

export default router;