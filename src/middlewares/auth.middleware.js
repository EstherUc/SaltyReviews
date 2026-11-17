
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


//comprobar si el usuario es el propietario del perfil o es administrador
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


export {
    isAuthenticated,
    isAdmin,
    isOwnerOrAdmin
};