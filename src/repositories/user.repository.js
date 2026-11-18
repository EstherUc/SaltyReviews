import { User, Favorite, Review } from "../models/models.js"; 
import { Op } from "sequelize";
import { throwError, NotFoundError } from "../utils/errors.js";

import User from '../models/user.model.js';  //HACK borrar y descomentar el otro import - pruebas
import Review from '../models/review.model.js';  //HACK borrar y descomentar el otro import - pruebas
import Favorite from '../models/favorite.model.js'; //HACK borrar y descomentar el otro import - pruebas

User.hasMany(Review, {foreignKey: 'id_user', as: 'reviews'}); //HACK para pruebas. Cuando estén todos los modelos borrar 
User.hasMany(Favorite, {foreignKey: 'id_user', as: 'favorites'}); //HACK para pruebas. Cuando estén todos los modelos borrar 



// ------------------ CRUD de usuarios ------------------


// ------------------ C (Create) ------------------

//crear un usuario
const create = async (data) => {
    
    try {

        const user = await User.create(data);
        return user;
        
    } catch (error) {
        console.error(error);
        throwError(error);
    }

};



// ------------------ R (Read) ------------------

//obtener todos los usuarios
const getAll = async() => {

    try {
        
        const users = await User.findAll();
        return users;
        
    } catch (error) {
        console.error(error);
        throwError(error);
    }

};

//obtener un usuario por su ID
const getById = async (id) => {

    try {
        
        const user = await User.findByPk(id,{
            include:[
                {
                model: Favorite,
                as: "favorites",
            },
            {
                model: Review,
                as: "reviews",
                attributes: ["id_reviews", "title", "rating", "comment"]
            }]
        });

        if(!user){
            throw new NotFoundError("Usuario no encontrado");
        }

        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


//buscar por email
//para buscar si el email pertenece a algún otro usaurio (distinto del usuario del id mandado)
// o sin id mandado sería buscar cualquier usuario que ya tenga ese email
const findEmail = async (email, id=null) => { 

    try {
        
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
        
    } catch (error) {
        console.error(error);
        throwError(error);
    }

}

//buscar un usuario por su nombre
const getByUsername = async (username) => {

    try {
        
        const user = await User.findOne({
            where: {
                username: username
            }
        });
    
        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


// ------------------ U (Update) ------------------

//actualizar un usuario completamente
const update = async (id, data) => {

    try {
        
        const { username, email, password_hash } = data;
    
        const user = await User.findByPk(id);
        
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        
        user.username = username;
        user.email = email;

        //cambiar contraseña solo si viene una nueva
        if(password_hash !== undefined){
            
            user.password_hash = password_hash;
        }

        await user.save();
        return user;
        

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


//modificar parcialmente un usuario
const modify = async (id, data) => {

    try {
        
        const { username, email, password_hash } = data;
    
        const user = await User.findByPk(id);
    
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }
    
        user.username = username || user.username;
        user.email = email || user.email;
    
        //cambiar contraseña solo si viene una nueva
        if(password_hash !== undefined){
            
            user.password_hash = password_hash;
        }
    
        await user.save();
        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};



// ------------------ D (Delete) ------------------

//eliminar un usuario
const remove = async (id) => {

    try {
        
        const user = await User.findByPk(id);
    
        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }
        
        await user.destroy();
        return user;
        
    } catch (error) {
        console.error(error);
        throwError(error);
    }

};




export default {
    create,
    getAll,
    getById,
    findEmail,
    getByUsername,
    update,
    modify,
    remove
}