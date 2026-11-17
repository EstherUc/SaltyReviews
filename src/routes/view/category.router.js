import { Router } from "express";
import categoryViewController from "../../controllers/category/category.view.controller.js";

const router = Router();

// ------------------ CRUD de review --------------------------------------

// ------------------ C (Create) ------------------------------------------
// endpoint para crear dato

router.get("/create",categoryViewController.createForm);

// creación de dato
router.post("/",categoryViewController.create);


// ------------------ R (Read) --------------------------------------------

// endpoint lista de datos
router.get("/",categoryViewController.getAll);

// endpoint dato individual
router.get("/:id", categoryViewController.getById)


// ------------------ U (Update) ------------------------------------------

// vista de actualización de usuario
router.get("/:id/edit",categoryViewController.updateForm);

// endpoint para cambiar dato por completo
router.post("/:id/edit",categoryViewController.update)


// ------------------ D (Delete) ------------------------------------------

// endpoint para eliminar un dato
router.post("/:id/delete",categoryViewController.remove)


export default router;