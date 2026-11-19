import reviewRepository from "../repositories/review.repository.js";

/**
 * Comprueba si el usuario ha iniciado sesión.
 *
 * Si existe un usuario en la sesión, permite continuar con la petición.
 * Si no existe, redirige al formulario de inicio de sesión.
 *
 * @param {Object} req - Objeto de petición HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función que permite continuar con el siguiente middleware.
 */
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/auth/login");
    }
}


/**
 * Comprueba si el usuario tiene permisos de administrador.
 *
 * Si no ha iniciado sesión, redirige al login.
 * Si su rol es "admin", permite continuar con la petición.
 * Si no es administrador, devuelve un error HTTP 403.
 *
 * @param {Object} req - Objeto de petición HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función que permite continuar con el siguiente middleware.
 */
const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect("/auth/login");
    } else if (req.session.user.rol === "admin") {
        next();
    } else {
        res.status(403).send("No tienes permisos para acceder");
    }
}

/**
 * Comprueba si el usuario es el propietario del perfil solicitado
 * o tiene permisos de administrador.
 *
 * Si no ha iniciado sesión, redirige al login.
 * Si es administrador o su ID coincide con el ID de la URL,
 * permite continuar con la petición.
 * En caso contrario, devuelve un error HTTP 403.
 *
 * @param {Object} req - Objeto de petición HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función que permite continuar con el siguiente middleware.
 */
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


/**
 * Comprueba si el usuario es el autor de una reseña
 * o tiene permisos de administrador.
 *
 * Primero verifica que el usuario haya iniciado sesión.
 * Después valida que el identificador de la reseña sea un entero positivo.
 * A continuación, busca la reseña mediante el repositorio.
 *
 * Si el identificador no es válido, devuelve un error HTTP 400.
 * Si la reseña no existe, devuelve un error HTTP 404.
 * Si el usuario es el autor de la reseña o es administrador,
 * permite continuar con la petición.
 * Si no tiene permisos, devuelve un error HTTP 403.
 *
 * Si ocurre una excepción durante la comprobación,
 * la captura y devuelve un error HTTP 500.
 *
 * @async
 * @param {Object} req - Objeto de petición HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función que permite continuar con el siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve al finalizar la comprobación.
 */
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




