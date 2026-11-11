import { Router } from "express"; // permite organizar las rutas en diferentes archivos
import apiRouter from "./api/api.router.js";
import viewRouter from "./view/view.router.js";

const router = Router();

router.use("/",viewRouter);
router.use("/api",apiRouter);


export default router;