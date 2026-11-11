import { passwordHash, users } from "../../models/datos_prueba.js"; 


// ------------------ CRUD de usuarios ------------------


// ------------------ C (Create) ------------------

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

    //devolvemos el usuario creado sin la password
    res.status(201).json({  // HTTP 201 - Created - éxito en la creación de un nuevo recurso
        data: {
            id_user: user.id_user,
            username: user.username,
            email: user.email,
            rol: user.rol
        }
     });

}



// ------------------ R (Read) ------------------

//obtener todos los usuarios
const getAll = (req, res) => {

    //mapeamos para crear otro array con la info de los usuarios sin el password_hash
    const publicUsers = users.map(({ id_user, username, email, rol }) => ({
        id_user,
        username,
        email,
        rol
    }));

    res.json({data: publicUsers});
};

//obtener un usuario por su ID
const getById = (req,res) => {

    const id = parseInt(req.params.id);
    const user = users.find(u => u.id_user === id);

    if(!user){
        return res.status(404).json({ message: "Usuario no encontrado"});
    }

    //desestruturamos el objeto para no devolver el password_hash
    const { id_user,username,email,rol } = user;

    res.json({ data: { id_user,username,email,rol } });
}



export default {
    create,
    getAll,
    getById
}