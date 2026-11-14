import userRepository from "../../repositories/user.repository.js";

//HACK: sustituir por un hash real cuando demos hashing
//Solo es para pruebas locales. No sirve para iniciar sesión.
const PASSWORD_HASH_PRUEBA = "HASH_TEMPORAL_PRUEBAS";


// ------------------ CRUD de usuarios ------------------


// ------------------ C (Create) ------------------

//crear un usuario
const create = async(req,res) => {

    //recogemos los datos enviados por el usuario
    const { username, email, password } = req.body;

    //comprobamos que se hayan enviado los datos obligatorios
    if (!username || !email || !password) {
        
        return res.status(400).json({ message: "El nombre de usuario, email y contraseña son obligatorios"}); // HTTP 400 - solicitud incorrecta
    }

    //comprobamos si el email ya está registrado
    const existUser = await userRepository.findEmail(email);


    if (existUser) {
        return res.status(409).json({ message: "El email ya está registrado" }); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }


    //creamos el usuario
    const user = await userRepository.create({
        username,
        email,
        password_hash: PASSWORD_HASH_PRUEBA, //temporal hasta tener la teoría de hash. HACK
    });


    //devolvemos el usuario creado sin la password
    res.status(201).json({  // HTTP 201 - Created - éxito en la creación de un nuevo recurso
        data: {
            id_user: user.id_user,
            username: user.username,
            email: user.email,
            rol: user.rol
        }
     });

};



// ------------------ R (Read) ------------------

//obtener todos los usuarios
const getAll = async(req, res) => {

    //consultamos los usuarios mediante el repositorio
    const users = await userRepository.getAll();

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
const getById = async(req,res) => {

    const id = parseInt(req.params.id);

    const user = await userRepository.getById(id);

    if(!user){
        return res.status(404).json({ message: "Usuario no encontrado"});
    }

    //desestruturamos el objeto para no devolver el password_hash
    const { id_user,username,email,rol } = user;

    res.json({ data: { id_user,username,email,rol } });
};



// ------------------ U (Update) ------------------

//actualizar un usuario completamente
const update = async(req,res) => {
    
    const id = parseInt(req.params.id); //obtenemos el id de la url
    const user = await userRepository.getById(id); //buscar el usuario

    //comprobar si existe 
    if (!user) {
        
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const{ username, email, password } = req.body; //recogemos los nuevos datos

    //comprobamos que se hayan enviado todos los datos (contraseña opcional)
    if (!username || !email) {

        return res.status(400).json({ message: "El nombre de usuario y email son obligatorios." });  // HTTP 400 - solicitud incorrecta
    }

    const existUser = await userRepository.findEmail(email,id); //comprobar email no sea de otro
    if (existUser) {
        return res.status(409).json({ message: "El email ya está registrado" }); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    //comprobamos que si envían contraseña no esté vacía
    if (password !== undefined && !password) {
        return res.status(400).json({ message: "La contraseña no puede estar vacía." });
    }

    //actualizamos los datos
    let userUpdate;

    if(password !== undefined){ //cambiamos contraseña solo si recibimos una nueva

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
    

    //devolvemos el usuario actualizado (sin el password)
    const { id_user, rol } = userUpdate; //cogemos el id y el rol del usuario

    res.json({
        data: {
            id_user,
            username: userUpdate.username,
            email: userUpdate.email,
            rol
        }
    });

};


//modificar parcialmente un usuario
const modify = async(req,res) => {

    const id = parseInt(req.params.id); //obtenemos el id de la url
    const user =  await userRepository.getById(id); //buscar el usuario

    //comprobar si existe 
    if (!user) {
        
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const{ username, email, password } = req.body; //recogemos los nuevos datos

    //comprobamos que haya enviado algún campo
    if (username === undefined && email === undefined && password === undefined) {
        
        return res.status(400).json({ message: "Debes enviar al menos un campo para modificar." }); // HTTP 400 - solicitud incorrecta
    }

    //comprobamos que si envían contraseña no esté vacía
    if (password !== undefined && !password) {
        return res.status(400).json({ message: "La contraseña no puede estar vacía." });
    }

    //comprobamos el email solo si lo han enviado
    if(email !== undefined){

        const existUser = await userRepository.findEmail(email,id);
        if (existUser) {
            return res.status(409).json({ message: "El email ya está registrado" }); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
        }

    }

    //actualizamos los datos
    let userUpdate;
    if(password !== undefined){ //cambiamos contraseña solo si recibimos una nueva

        userUpdate = await userRepository.modify(id, {
            username,
            email,
            password_hash: PASSWORD_HASH_PRUEBA //HACK temporal
        });

    }else{

        userUpdate = await userRepository.modify(id, {
            username,
            email
        });
    }


    //devolvemos el usuario modificado (sin el password)
    const { id_user, rol } = userUpdate; //cogemos el id y el rol del usuario

    res.json({
        data: {
            id_user,
            username: userUpdate.username,
            email: userUpdate.email,
            rol
        }
    });

};




// ------------------ D (Delete) ------------------

//eliminar un usuario
const remove = async (req,res) => {

    //obtenemos el id de la url
    const id = parseInt(req.params.id);
    const user = await userRepository.remove(id);

    //si existe usuario es que lo ha borrado
    if (!user) {
        
        return res.status(404).json({ message: "Usuario no encontrado" });
    }


    //devolvemos el usuario eliminado (menos la password)
    const { id_user, username, email, rol } = user;

    res.json({ data: { id_user, username, email, rol } });
};





export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}