import userRepository from "../../repositories/user.repository.js";


// ------------------ Vistas de usuarios ------------------



// ------------------ C (Create) ------------------

//mostrar el formulario para crear un usuario
const createForm = (req,res) => {
    res.render("user/create", {user: {}, error: null});
}

//CREAR un usuario
const create = async(req,res) => {

    const { username, email, password, passwordRepeat } = req.body; //recogemos los datos enviados por el usuario

    //guardar los datos del formulario por si hay algún error
    const formData = { username, email };

    //comprobamos que se hayan enviado los datos obligatorios
    if (!username || !email || !password || !passwordRepeat) {
        
        // HTTP 400 - solicitud incorrecta
        return res.status(400).render("user/create", { user: formData, error: "El nombre de usuario, email y las contraseñas son obligatorios" });

    }

    //comprobamos que las dos contraseñas coincidan
    if (password !== passwordRepeat) {
        return res.status(400).render("user/create", { user: formData, error: "Las contraseñas no coinciden." }); // HTTP 400 - solicitud incorrecta
    }

    try {
        
        const existUser = await userRepository.findEmail(email); //comprobamos si el email ya está registrado
    
        if (existUser) {
            return res.status(409).render("user/create", { user: formData, error: "El email ya está registrado" }); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
        }
    
        //creamos el usuario
        const user = await userRepository.create({
            username,
            email,
            password_hash: password
        });
    
        //volvemos al listado de usuarios
        res.redirect("/user/" + user.id_user);

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("user/create", { user: formData, error: error.message });
    }

};




// ------------------ R (Read) ------------------


//mostrar todos los usuarios
const getAll = async(req, res) => {

    try {
        
        const users = await userRepository.getAll(); //consultamos los usuarios mediante el repositorio
    
        //mapeamos para crear otro array con la info de los usuarios sin el password_hash
        const publicUsers = users.map(({ id_user, username, email, rol }) => ({
            id_user,
            username,
            email,
            rol
        }));
    
        //renderizamos la vista y le pasamos los usuarios
        res.render("user/list", {users: publicUsers, error: null});

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("user/list", { users: [], error: error.message });
    }

};


//mostrar un usuario por su ID
const getById = async(req,res) => {

    try {
        
        const id = parseInt(req.params.id);
        const user = await userRepository.getById(id);
    
        //desestruturamos el objeto para no devolver el password_hash
        const { id_user,username,email,rol,reviews, favorites} = user;
    
        res.render("user/show", { user: { id_user,username,email,rol,reviews,favorites }, error: null });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("user/show", { user: null, error: error.message });
    }

};



// ------------------ U (Update) ------------------

//ACTUALIZAR un usuario completamente
const update = async(req,res) => {

    const id = parseInt(req.params.id);//obtenemos el id de la url
    const{ username, email, password, passwordRepeat } = req.body; //recogemos los nuevos datos
    const formData = { id_user: id, username, email }; //datos del formulario para conservarlos si ocurre un error

    //comprobamos que se hayan enviado todos los datos obligatorios
    if (!username || !email ) {
        return res.status(400).render("user/update", { user: formData, error: "El nombre de usuario y el email son obligatorios."}); // HTTP 400 - solicitud incorrecta
    }

    //comprobamos si quieren cambiar la contraseña
    if (password || passwordRepeat) {

        //si rellena uno de los campos tiene que rellenar los dos
        if (!password || !passwordRepeat) {
            return res.status(400).render("user/update", { user: formData, error: "Debes escribir y repetir la nueva contraseña." });
        }

        //comprobamos que coincidan
        if (password !== passwordRepeat) {
            return res.status(400).render("user/update", { user: formData, error: "Las contraseñas no coinciden." });
        }
    }

    try {
        
        const existUser = await userRepository.findEmail(email,id); //comprobar email no sea de otro
        if (existUser) {
            return res.status(409).render("user/update", { user: formData, error: "El email ya está registrado" });// HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
        }
    
        //actualizamos los datos
        let userUpdate;
    
        if(password){ //cambiamos contraseña solo si recibimos una nueva
    
            userUpdate = await userRepository.update(id, {
                username,
                email,
                password_hash: password
            });
    
        }else{
    
            userUpdate = await userRepository.update(id, {
                username,
                email
            });
    
        }
    
        //vamos al usuario actualizado
        res.redirect("/user/" + userUpdate.id_user);

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("user/update", { user: formData, error: error.message });
    }


};


//mostrar el formulario para actualizar un usuario
const updateForm = async(req, res) => {

    try {
        
        const id = parseInt(req.params.id); //obtenemos el id de la URL
        const user = await userRepository.getById(id); //buscamos el usuario
    
        //obtenemos sus datos sin password
        const { id_user, username, email, rol } = user;
    
        //renderizamos el formulario con los datos actuales
        res.render("user/update", { user: { id_user, username, email, rol }, error: null });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("user/show", { user: null, error: error.message });
    }
};




// ------------------ D (Delete) ------------------

//ELIMINAR un usuario
const remove = async(req,res) => {

    try {
        
        const id = parseInt(req.params.id);  //obtenemos el id de la url
        await userRepository.remove(id); //eliminamos
    
        //volvemos al listado de usuarios y mensaje
        res.redirect("/user?message=Usuario+eliminado+correctamente");

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("user/show", { user: null, error: error.message });
    }

};





export default {
    createForm,
    create,
    getAll,
    getById,
    update,
    updateForm,
    remove
}