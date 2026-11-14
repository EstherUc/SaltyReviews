//import { Review,User } from "../models/models.js";

import User from '../models/user.model.js';  //HACK borrar y descomentar el otro import - pruebas
import Review from '../models/review.model.js';  //HACK borrar y descomentar el otro import - pruebas

Review.belongsTo(User, {foreignKey: 'id_user', as: 'user'}); // HACK temporal para pruebas (hasta que estén los modelos terminados)


// ------------------ CRUD de review ----------------------------

// ------------------ C (Create)
// endpoint para crear dato
const create = async (data)=>{
    const review = await Review.create(data)
    return review;
}

// ------------------ R (Read)---------------------------------------------
// endpoint lista de todas las reseñas con sus usuarios 
const getAll = async() => {
    const reviews = await Review.findAll({
        include: {
            model: User,
            as: "user",
            attributes: ["username", "email"]
        }
    });
    return reviews;
};

// endpoint dato individual
const getById = async (id) => {
    const review = await Review.findByPk(id,{
        include:{
            model: User,
            as: "user",
            attributes: ["username","email"]
        }
    });
    return review;
};

//HACK es para pruebas
// const getById = async (id) => {
//     const review = await Review.findByPk(id);
//     return review;
// };

// ---------------- U (Update) -----------------------------------
// endpoint para cambiar dato por completo
const update =async (id, data)=>{
    const {title,rating,comment} = data;
    const review  = await Review.findByPk(id);
    if(review){
        review.title = title;
        review.rating = rating;
        review.comment = comment;
        await review.save();
        return review;
    }else{
        return null;
    }

}

const modify = async (id,data)=>{
    const {title,rating,comment} = data;
    const review  = await Review.findByPk(id);
    if(!review){
        return null;
    }
    review.title = title || review.title;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();
    return review;
}

// ------------------------ D (Delete)------------
const remove =async (id)=>{
    const review = await Review.findByPk(id);
    if(review){
        await review.destroy();
        return review;
    }
    return null;
}

export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}