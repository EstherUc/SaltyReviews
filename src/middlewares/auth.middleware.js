import reviewRepository from "../repositories/review.repository.js";

//comporbar si el usuario ha iniciado sesión
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/auth/login");
    }
}


//comprobar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/auth/login");
    } else if (req.session.user.rol === "admin") {
        next();
    } else {
        res.status(403).send("No tienes permisos para acceder");
    }
}


//comprobar si el usuario es el propietario del perfil o es el admin
const isOwnerOrAdmin = (req, res, next) => {

    if (!req.session.user) {
        res.redirect("/auth/login");
    } else if (req.session.user.rol === "admin" || Number(req.session.user.id_user) === Number(req.params.id)) {
        //si es el administrador o el usuario de la sesión entonces continua
        next();
    } else {
        res.status(403).send("No tienes permisos para acceder");
    }

}

//comprobar si el usuario es el autor de la reseña o es el admin
const isReviewOwnerOrAdmin = async (req, res, next) => {
    try {
        // Comprobar autenticación
        if (!req.session?.user) {
            return res.redirect("/auth/login");
        }

        const id = Number(req.params.id);

        // Validar identificador
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).render("review/show", {
                review: null,
                error: "El identificador de la reseña no es válido."
            });
        }

        // Buscar reseña
        const review = await reviewRepository.getById(id);

        if (!review) {
            return res.status(404).render("review/show", {
                review: null,
                error: "La reseña no existe."
            });
        }

        // Comprobar permisos
        const isAdmin = req.session.user.rol === "admin";

        const isOwner =
            Number(req.session.user.id_user) === Number(review.id_user);

        if (isAdmin || isOwner) {
            return next();
        }

        // Usuario sin permisos
        return res.status(403).render("review/show", {
            review: null,
            error: "No tienes permisos para modificar esta reseña."
        });

    } catch (error) {
        console.error("Error comprobando permisos:", error);

        return res.status(500).render("review/show", {
            review: null,
            error: "No se han podido comprobar los permisos."
        });
    }
};


export {
    isAuthenticated,
    isAdmin,
    isOwnerOrAdmin,
    isReviewOwnerOrAdmin
};




