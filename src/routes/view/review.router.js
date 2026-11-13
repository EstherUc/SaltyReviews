import { Router } from "express";
import reviewViewController from "../../controllers/review/review.view.controller.js";

const router = Router();

// ------------------ CRUD de review ----------------------------

// ------------------ C (Create)
// endpoint para crear dato

// vista de formulario
router.get("/new",reviewViewController.createForm);

// creación de dato
router.post("/",reviewViewController.create);

// ------------------ R (Read)---------------------------------------------
// endpoint lista de datos
router.get("/",reviewViewController.getAll);

// endpoint dato individual
router.get("/:id", reviewViewController.getById)

// ---------------- U (Update) -----------------------------------
// vista de actualización de usuario
router.get("/:id/edit",reviewViewController.updateForm);

// endpoint para cambiar dato por completo
router.post("/:id/edit",reviewViewController.update)

// ------------------------ D (Delete)------------
router.post("/:id/delete",reviewViewController.remove)


export default router;