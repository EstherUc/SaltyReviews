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
const isAuthenticated = (req,res,next) =>{
    if(req.session.user){
        next();
    }else{
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

const isAdmin = (req,res,next) => {
    if(!req.session.user){
        res.redirect("/auth/login");
    }else if(req.session.user.rol === "admin"){
        next();
    }else{
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

const isOwnerOrAdmin = (req,res,next) => {

    if(!req.session.user){
        res.redirect("/auth/login");
    }else if(req.session.user.rol === "admin" || Number(req.session.user.id_user) === Number(req.params.id)){
        //si es el administrador o el usuario de la sesión entonces continua
        next();
    }else{
        res.status(403).send("No tienes permisos para acceder");
    }

}


/**
 * Comprueba si el usuario es el autor de una reseña
 * o tiene permisos de administrador.
 *
 * Primero verifica que el usuario haya iniciado sesión.
 * Después busca la reseña mediante su ID utilizando el repositorio.
 *
 * Si la reseña no existe, devuelve un error HTTP 404.
 * Si el usuario es el autor de la reseña o es administrador,
 * permite continuar con la petición.
 * En caso contrario, devuelve un error HTTP 403.
 *
 * @async
 * @param {Object} req - Objeto de petición HTTP de Express.
 * @param {Object} res - Objeto de respuesta HTTP de Express.
 * @param {Function} next - Función que permite continuar con el siguiente middleware.
 * @returns {Promise<void>} Promesa que se resuelve al finalizar la comprobación.
 */
const isReviewOwnerOrAdmin = async (req,res,next) => {

    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    //buscar la reseña
    const review = await reviewRepository.getById(req.params.id);

    if (!review) {
        return res.status(404).send("Reseña no encontrada");
    }

    //comprobar si es el user (autor) o el admin
    if (req.session.user.rol === "admin" || parseInt(req.session.user.id_user) === parseInt(review.id_user)) {
        next();
    } else {
        res.status(403).send("No tienes permisos para modificar esta reseña");
    }
}


export {
    isAuthenticated,
    isAdmin,
    isOwnerOrAdmin,
    isReviewOwnerOrAdmin
};




