// import { User, Favorite, Review } from "../models/models.js"; 
import { Op } from "sequelize";

import User from '../models/user.model.js';  //HACK borrar y descomentar el otro import - pruebas



// ------------------ CRUD de usuarios ------------------


// ------------------ C (Create) ------------------

//crear un usuario
const create = async (data) => {

    const user = await User.create(data);
    return user;

};



// ------------------ R (Read) ------------------

//obtener todos los usuarios
const getAll = async() => {

    const users = await User.findAll();
    return users;
};

//obtener un usuario por su ID
// const getById = async (id) => {
//     const user = await User.findByPk(id,{
//         include:[
//             {
//             model: Favorite,
//             as: "favorites",
//         },
//         {
//             model: Review,
//             as: "reviews",
//         }]
//     });
//     return user;
// };

// HACK cuando esté favorite y review tengo que quitar
const getById = async (id) => {
    const user = await User.findByPk(id);
    return user;
};



// ------------------ U (Update) ------------------

//actualizar un usuario completamente
const update = async (id, data) => {
    const { username, email, password_hash } = data;

    const user = await User.findByPk(id);

    if (user) {
        user.username = username;
        user.email = email;

        //cambiar contraseña solo si viene una nueva
        if(password_hash !== undefined){
            
            user.password_hash = password_hash;
        }

        await user.save();
        return user;
    }

    return null;
};


//modificar parcialmente un usuario
const modify = async (id, data) => {
    const { username, email, password_hash } = data;

    const user = await User.findByPk(id);

    if (!user) {
        return null;
    }

    user.username = username || user.username;
    user.email = email || user.email;

    //cambiar contraseña solo si viene una nueva
    if(password_hash !== undefined){
        
        user.password_hash = password_hash;
    }

    await user.save();
    return user;
};



// ------------------ D (Delete) ------------------

//eliminar un usuario
const remove = async (id) => {
    const user = await User.findByPk(id);

    if (user) {
        await user.destroy();
        return user;
    }

    return null;
};


//--------------------------------------------------------


//buscar por email
//para buscar si el email pertenece a algún otro usaurio (distinto del usuario del id mandado)
// o sin id mandado sería buscar cualquier usuario que ya tenga ese email
const findEmail = async (email, id=null) => { 

    let existEmail = null;

    //si recibimos id miramos emails de otros usuarios  
    if(id !== null){
        
        existEmail = await User.findOne({
            where: {
                email: email,
                id_user : {
                    [Op.ne]: id  //no miramos ese id (usario) en la busqueda (ne = not equal, distinto)
                }
            }
        });

    }else{

        //si no recibimos id (buscamos en todos los usuarios)
        existEmail = await User.findOne({
            where: {
                email: email
            }
        });

    }


    return existEmail;

}





export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove,
    findEmail
}