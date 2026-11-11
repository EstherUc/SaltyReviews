import { users, passwordHash } from "../../models/datos_prueba.js";

// ------------------ Vistas de usuarios ------------------



// ------------------ C (Create) ------------------

//mostrar el formulario para crear un usuario
const createForm = (req,res) => {
    res.render("user/create");
}

//crear un usuario
const create = (req,res) => {

    //recogemos los datos enviados por el usuario
    const { username, email, password } = req.body;

    //comprobamos que se hayan enviado los datos obligatorios
    if (!username || !email || !password) {
        
        return res.status(400).json({ message: "El nombre de usuario, email y contraseña son obligatorios"}); // HTTP 400 - solicitud incorrecta
    }

    //comprobamos si el email ya está registrado
    const existUser = users.find(u => u.email === email);

    if (existUser) {
        return res.status(409).json({ message: "El email ya está registrado" }); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    //generamos el ID del nuevo usuario (es temporal porque cuando conectemos con la BD, lo añadirá y lo incrementara automáticamente la BD) HACK
    const id_user = Math.max(0, ...users.map(u => u.id_user)) + 1;

    //creamos el objeto del nuevo usuario
    const user ={
        id_user,
        username,
        email,
        password_hash: passwordHash, //temporal el hash fijo para pruebas, hasta tener la teoría de hash HACK
        rol: "user"
    };

    //añadir el usuario al array 
    users.push(user);

    //volvemos al listado de usuarios
    res.redirect("/user");

};




// ------------------ R (Read) ------------------


//mostrar todos los usuarios
const getAll = (req, res) => {

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
const getById = (req,res) => {

    const id = parseInt(req.params.id);
    const user = users.find(u => u.id_user === id);

    if(!user){
        return res.status(404).json({ message: "Usuario no encontrado"});
    }

    //desestruturamos el objeto para no devolver el password_hash
    const { id_user,username,email,rol } = user;

    res.render("user/show", { user: { id_user,username,email,rol } });
};



// ------------------ U (Update) ------------------

//actualizar un usuario completamente
const update = (req,res) => {

    //obtenemos el id de la url
    const id = parseInt(req.params.id);

    //buscar el usuario
    const user = users.find(u => u.id_user === id);

    //comprobar si existe 
    if (!user) {
        
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //recogemos los nuevos datos
    const{ username, email } = req.body;

    //comprobamos que se hayan enviado todos los datos
    if (!username || !email ) {

        return res.status(400).json({ message: "El nombre de usuario y el email son obligatorios." });  // HTTP 400 - solicitud incorrecta
    }

    //actualizamos los datos
    user.username = username;
    user.email = email;

    //devolvemos el usuario actualizado (sin el password)
    const { id_user, rol } = user; //cogemos el id y el rol del usuario


    //volvemos al listado de usuarios
    res.redirect("/user");

};


//mostrar el formulario para actualizar un usuario
const updateForm = (req, res) => {

    //obtenemos el id de la URL
    const id = parseInt(req.params.id);

    //buscamos el usuario
    const user = users.find(u => u.id_user === id);

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

//eliminar un usuario
const remove = (req,res) => {

    //obtenemos el id de la url
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id_user === id);

    //comprobar si existe el id
    if (index === -1) {
        
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //eliminamos el usuario dl array
    let user = users.splice(index,1)[0]; // [0] -> splice devuelve array con el eliminado, para coger el elemento 0 y guardar el eliminado en user

    //devolvemos el usuario eliminado (menos la password)
    const { id_user, username, email, rol } = user;

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