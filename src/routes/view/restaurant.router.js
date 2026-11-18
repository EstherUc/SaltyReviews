import express from "express";
import restaurantViewController from "../../controllers/restaurant/restaurant.view.controller.js";
import { isAdmin } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ------------------ CRUD de restaurantes ------------------

// ------------------ C (Create) ------------------
// Mostrar formulario para crear restaurantes
router.get("/create", isAdmin, restaurantViewController.createForm);
// Crear un restaurante
router.post("/", isAdmin, restaurantViewController.create);

// ------------------ R (Read) ------------------

// Obtener todos los restaurantes
router.get("/", restaurantViewController.getAll);

// Obtener un restaurante por su ID
router.get("/:id", restaurantViewController.getById);

// ------------------ U (Update) ------------------

// Mostrar el formulario de actualización
router.get("/:id/update", isAdmin, restaurantViewController.updateForm);

// Guardar los cambios del restaurante
router.post("/:id/update", isAdmin, restaurantViewController.update);

// ------------------ D (Delete) ------------------

// Eliminar un restaurante
router.post("/:id/delete", isAdmin, restaurantViewController.remove);

export default router;