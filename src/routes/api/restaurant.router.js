import { Router } from "express";
import restaurantApiController from "../../controllers/restaurant/restaurant.api.controller.js";
import { isAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// ------------------ CRUD de restaurantes ------------------

// ------------------ C (Create) ------------------

// Crear un nuevo restaurante
router.post("/", isAdmin, restaurantApiController.create);

// ------------------ R (Read) ------------------

// Obtener todos los restaurantes
router.get("/", restaurantApiController.getAll);

// Obtener un restaurante por su ID
router.get("/:id", restaurantApiController.getById);

// ------------------ U (Update) ------------------

// Actualizar completamente un restaurante
router.put("/:id", isAdmin, restaurantApiController.update);

// Modificar parcialmente un restaurante
router.patch("/:id", isAdmin, restaurantApiController.modify);

// ------------------ D (Delete) ------------------

// Eliminar un restaurante
router.delete("/:id", isAdmin, restaurantApiController.remove);

export default router;