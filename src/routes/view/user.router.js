import { Router } from "express";
import userViewController from "../../controllers/user/user.view.controller.js";
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from "../../middlewares/auth.middleware.js";


const router = Router();


// ------------------ Vistas CRUD de usuarios  ------------------



// ------------------ C (Create) ------------------

//mostrar el formulario para crear un usuario
router.get("/create", isAdmin , userViewController.createForm);

//crear un usuario con los datos del formulario
router.post("/create", isAdmin , userViewController.create);



// ------------------ R (Read) ------------------

//mostrar todos los usuarios
router.get("/", isAdmin, userViewController.getAll);

//mostrar un usuario por su ID
router.get("/:id", isOwnerOrAdmin, userViewController.getById);


// ------------------ U (Update) ------------------

//mostrar formulario de actualización
router.get("/:id/update", isOwnerOrAdmin, userViewController.updateForm);

//actualizar el usuario con los datos cambiados del formulario
router.post("/:id/update", isOwnerOrAdmin, userViewController.update);


// ------------------ D (Delete) ------------------

//eliminar un usuario
router.post("/:id/delete", isAdmin, userViewController.remove);





export default router;