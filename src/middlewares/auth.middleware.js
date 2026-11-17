import reviewRepository from "../repositories/review.repository.js";

//comporbar si el usuario ha iniciado sesión
const isAuthenticated = (req,res,next) =>{
    if(req.session.user){
        next();
    }else{
        res.redirect("/auth/login");
    }
}


//comprobar si el usuario es administrador
const isAdmin = (req,res,next) => {
    if(!req.session.user){
        res.redirect("/auth/login");
    }else if(req.session.user.rol === "admin"){
        next();
    }else{
        res.status(403).send("No tienes permisos para acceder");
    }
}


//comprobar si el usuario es el propietario del perfil o es el admin
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

//comprobar si el usuario es el autor de la reseña o es el admin
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