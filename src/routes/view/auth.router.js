import { Router } from "express";
import authViewController from "../../controllers/auth/auth.view.controller.js";

const router = Router();

// -------------------- REGISTER --------------------

router.get("/register", authViewController.registerForm);
router.post("/register", authViewController.register);

// -------------------- LOGIN --------------------

router.get("/login", authViewController.loginForm);
router.post("/login", authViewController.login);

// -------------------- LOGOUT --------------------

router.post("/logout", authViewController.logout); 




export default router;