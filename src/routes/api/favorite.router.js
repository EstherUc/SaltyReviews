import { Router } from "express";
import favoriteApiController from "../../controllers/favorite/favorite.api.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const router = Router();

// ------------------ CRUD de favoritos ------------------

// ------------------ C (Create) ------------------






// ------------------ R (Read) ------------------

// Obtener todos los favoritos de un usuario
router.get("/:userId", favoriteApiController.getAllByUser);

// Obtener un favorito por su ID
//router.get("/:id", favoriteApiController.getById);


// ------------------ U (Update) ------------------

// Actualizar want_to_visit de un favorito
//router.put("/:id", favoriteApiController.update);


// ------------------ D (Delete) ------------------

// Eliminar un favorito concreto
router.delete("/:id/delete", favoriteApiController.remove);

// Eliminar todos los favoritos de un usuario
router.delete("/:userId", favoriteApiController.removeAllByUser);


export default router;