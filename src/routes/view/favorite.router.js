import { Router } from "express";
import favoriteViewController from "../../controllers/favorite/favorite.view.controller.js";

const router = Router();

// ------------------ Vistas de favoritos ------------------

// ------------------ C (Create) ------------------

// Añadir un favorito
router.post("/", favoriteViewController.create);


// ------------------ R (Read) ------------------

// Mostrar todos los favoritos de un usuario
router.get("/user/:userId", favoriteViewController.getAllByUser);

// Mostrar un favorito concreto
//router.get("/:id", favoriteViewController.getById);


// ------------------ U (Update) ------------------

// Actualizar want_to_visit de un favorito
//router.post("/:id/update", favoriteViewController.update);


// ------------------ D (Delete) ------------------

// Eliminar un favorito concreto
router.post("/:id/delete", favoriteViewController.remove);

// Eliminar todos los favoritos de un usuario
router.post("/user/:userId/delete", favoriteViewController.removeAllByUser);


export default router;