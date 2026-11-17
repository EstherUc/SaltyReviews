import { Router } from "express";
import reviewApiController from "../../controllers/review/review.api.controller.js"; //el controlador para conectarlo a la ruta

const router = Router();

// ------------------ CRUD de usuarios ------------------

// ------------------ C (Create) ------------------

//crear una review
router.post("/",reviewApiController.create);


// ------------------ R (Read) ------------------

//obtener todas las reviews
router.get("/",reviewApiController.getAll); 

//obtener una review por ID
router.get("/:id",reviewApiController.getById);


// ------------------ U (Update) ------------------

//actualizar una review completamente
router.put("/:id",reviewApiController.update);

//modificar parcialmente una review
router.patch("/:id",reviewApiController.modify);


// ------------------ D (Delete) ------------------

//eliminar una review
router.delete("/:id",reviewApiController.remove);

export default router;