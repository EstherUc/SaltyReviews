import { Router } from "express";
import categoryApiController from "../../controllers/category/category.api.controller.js";

const router = Router();

// ------------------ CRUD de usuarios ------------------

// ------------------ C (Create) ------------------

//crear categoria
router.post("/",categoryApiController.create);


// ------------------ R (Read) ------------------

//obtener todas las categorias
router.get("/",categoryApiController.getAll); 

//obtener una categoria por id
router.get("/:id",categoryApiController.getById);


// ------------------ U (Update) ------------------

//actualizar una categoria
router.put("/:id",categoryApiController.update);

//modificar parcialmente una categoria
router.patch("/:id",categoryApiController.modify);


// ------------------ D (Delete) ------------------

//eliminar una categoria
router.delete("/:id",categoryApiController.remove);

export default router;