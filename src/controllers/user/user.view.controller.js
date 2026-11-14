import userRepository from "../../repositories/user.repository.js";

//HACK: sustituir por un hash real cuando demos hashing
//Solo es para pruebas locales. No sirve para iniciar sesión.
const PASSWORD_HASH_PRUEBA = "HASH_TEMPORAL_PRUEBAS";


// ------------------ Vistas de usuarios ------------------



// ------------------ C (Create) ------------------

//mostrar el formulario para crear un usuario
const createForm = (req,res) => {
    res.render("user/create");
}

//CREAR un usuario
const create = async(req,res) => {

    const { username, email, password, passwordRepeat } = req.body; //recogemos los datos enviados por el usuario

    //comprobamos que se hayan enviado los datos obligatorios
    if (!username || !email || !password || !passwordRepeat) {
        
        return res.status(400).send("El nombre de usuario, email y las contraseñas son obligatorios"); // HTTP 400 - solicitud incorrecta
    }

    //comprobamos que las dos contraseñas coincidan
    if (password !== passwordRepeat) {
        return res.status(400).send("Las contraseñas no coinciden.");
    }

    const existUser = await userRepository.findEmail(email); //comprobamos si el email ya está registrado

    if (existUser) {
        return res.status(409).send("El email ya está registrado" ); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    //creamos el usuario
    const user = await userRepository.create({
        username,
        email,
        password_hash: PASSWORD_HASH_PRUEBA, //temporal hasta tener la teoría de hash. HACK
    });

    //volvemos al listado de usuarios
    res.redirect("/user/" + user.id_user);

};




// ------------------ R (Read) ------------------


//mostrar todos los usuarios
const getAll = async(req, res) => {

    const users = await userRepository.getAll(); //consultamos los usuarios mediante el repositorio

    //mapeamos para crear otro array con la info de los usuarios sin el password_hash
    const publicUsers = users.map(({ id_user, username, email, rol }) => ({
        id_user,
        username,
        email,
        rol
    }));

    //renderizamos la vista y le pasamos los usuarios
    res.render("user/list", {users: publicUsers});
};


//mostrar un usuario por su ID
const getById = async(req,res) => {

    const id = parseInt(req.params.id);
    const user = await userRepository.getById(id);

    if(!user){
        return res.status(404).send("Usuario no encontrado");
    }

    //desestruturamos el objeto para no devolver el password_hash
    const { id_user,username,email,rol,reviews} = user;

    res.render("user/show", { user: { id_user,username,email,rol,reviews } });
};



// ------------------ U (Update) ------------------

//ACTUALIZAR un usuario completamente
const update = async(req,res) => {

    const id = parseInt(req.params.id);//obtenemos el id de la url
    const user = await userRepository.getById(id); //buscar el usuario

    //comprobar si existe 
    if (!user) {
        return res.status(404).send("Usuario no encontrado" );
    }

    const{ username, email, password, passwordRepeat } = req.body; //recogemos los nuevos datos

    //comprobamos que se hayan enviado todos los datos
    if (!username || !email ) {
        return res.status(400).send("El nombre de usuario y el email son obligatorios.");  // HTTP 400 - solicitud incorrecta
    }

    const existUser = await userRepository.findEmail(email,id); //comprobar email no sea de otro
    if (existUser) {
        return res.status(409).send("El email ya está registrado" ); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    //comprobamos si quieren cambiar la contraseña
    if (password || passwordRepeat) {

        //si rellena uno de los campos tiene que rellenar los dos
        if (!password || !passwordRepeat) {
            return res.status(400).send("Debes escribir y repetir la nueva contraseña.");
        }

        //comprobamos que coincidan
        if (password !== passwordRepeat) {
            return res.status(400).send("Las contraseñas no coinciden.");
        }
    }


    //actualizamos los datos
    let userUpdate;

    if(password){ //cambiamos contraseña solo si recibimos una nueva

        userUpdate = await userRepository.update(id, {
            username,
            email,
            password_hash: PASSWORD_HASH_PRUEBA //HACK temporal
        });

    }else{

        userUpdate = await userRepository.update(id, {
            username,
            email
        });

    }


    //vamos al usuario actualizado si existe
    if (userUpdate) {
        res.redirect("/user/" + userUpdate.id_user);
    } else {
        res.redirect("/user");
    }

};


//mostrar el formulario para actualizar un usuario
const updateForm = async(req, res) => {

    const id = parseInt(req.params.id); //obtenemos el id de la URL
    const user = await userRepository.getById(id); //buscamos el usuario

    //comprobamos si existe
    if (!user) {
        return res.status(404).send("Usuario no encontrado");
    }

    //obtenemos sus datos sin password
    const { id_user, username, email, rol } = user;

    //renderizamos el formulario con los datos actuales
    res.render("user/update", { user: { id_user, username, email, rol } });
};



// ------------------ D (Delete) ------------------

//ELIMINAR un usuario
const remove = async(req,res) => {

    const id = parseInt(req.params.id);  //obtenemos el id de la url
    const user = await userRepository.remove(id); //eliminamos

    //si existe usuario es que lo ha borrado y existía en bd
    if (!user) {
        
        return res.status(404).send("Usuario no encontrado" );
    }

    //volvemos al listado de usuarios
    res.redirect("/user");
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