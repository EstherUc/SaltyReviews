import { Router } from "express";
import favoriteViewController from "../../controllers/favorite/favorite.view.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const router = Router();

// ------------------ Vistas de favoritos ------------------

router.use(isAuthenticated);

// ------------------ R (Read) ------------------

// Mostrar todos los favoritos de un usuario
router.get("/", favoriteViewController.getAllByUser);


// ------------------ C (Create) ------------------

// Añadir un favorito
router.post("/toggle", favoriteViewController.toggle);
// router.post("/", favoriteViewController.create);



// Mostrar un favorito concreto
//router.get("/:id", favoriteViewController.getById);


// ------------------ U (Update) ------------------

// Actualizar want_to_visit de un favorito
//router.post("/:id/update", favoriteViewController.update);


// ------------------ D (Delete) ------------------

// Eliminar todos los favoritos de un usuario
router.post("/delete-all", favoriteViewController.removeAllByUser);

// Eliminar un favorito concreto
router.post("/:id/delete", favoriteViewController.remove);



export default router;