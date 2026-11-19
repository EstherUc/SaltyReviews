import { Router } from "express";
import reviewApiController from "../../controllers/review/review.api.controller.js"; //el controlador para conectarlo a la ruta

const router = Router();

const isAdminApi = (req, res, next) => {

    if (!req.session?.user) {
        return res.status(401).json({
            error: "Debes iniciar sesión"
        });
    }

    if (req.session.user.rol !== "admin") {
        return res.status(403).json({
            error: "No tienes permisos"
        });
    }

    next();
};

// ------------------ CRUD de usuarios ------------------

// ------------------ C (Create) ------------------

//crear una review
router.post("/", isAdminApi, reviewApiController.create);


// ------------------ R (Read) ------------------

//obtener todas las reviews
router.get("/", isAdminApi, reviewApiController.getAll);

//obtener una review por ID
router.get("/:id", reviewApiController.getById);


// ------------------ U (Update) ------------------

//actualizar una review completamente
router.put("/:id", isAdminApi, reviewApiController.update);

//modificar parcialmente una review
router.patch("/:id", isAdminApi, reviewApiController.modify);


// ------------------ D (Delete) ------------------

//eliminar una review
router.delete("/:id", isAdminApi, reviewApiController.remove);



export default router;