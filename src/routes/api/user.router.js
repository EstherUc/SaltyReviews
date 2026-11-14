import { Router } from "express"; //para crear las rutas
import userApiController from "../../controllers/user/user.api.controller.js"; //el controlador para conectarlo a la ruta

const router = Router();

// ------------------ CRUD de usuarios ------------------

// ------------------ C (Create) ------------------

//crear un usuario
router.post("/",userApiController.create);


// ------------------ R (Read) ------------------

//obtener todos los usuarios
router.get("/",userApiController.getAll); 

//obtener un usuario por ID
router.get("/:id",userApiController.getById);


// ------------------ U (Update) ------------------

//actualizar un usuario completamente
router.put("/:id",userApiController.update);

//modificar parcialmente un usuario
router.patch("/:id",userApiController.modify);


// ------------------ D (Delete) ------------------

//eliminar un usuario
router.delete("/:id",userApiController.remove);

export default router;