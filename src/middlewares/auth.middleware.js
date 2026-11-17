
//comporbar si el usuario ha iniciado sesión
const isAuthenticated = (req,res,next) =>{
    if(req.session.user){
        next();
    }else{
        res.redirect("/auth/login");
    }
}




export default isAuthenticated;