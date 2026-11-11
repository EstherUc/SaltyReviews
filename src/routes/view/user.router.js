import { Router } from "express";
import userViewController from "../../controllers/user/user.view.controller.js";


const router = Router();


// ------------------ Vistas CRUD de usuarios  ------------------



// ------------------ C (Create) ------------------

//mostrar el formulario para crear un usuario
router.get("/create",userViewController.createForm);

//crear un usuario con los datos del formulario
router.post("/create",userViewController.create);



// ------------------ R (Read) ------------------

//mostrar todos los usuarios
router.get("/", userViewController.getAll);

//mostrar un usuario por su ID
router.get("/:id",userViewController.getById);




export default router;