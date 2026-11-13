import { Review,User } from "../models/models.js";

// ------------------ CRUD de review ----------------------------

// ------------------ C (Create)
// endpoint para crear dato
const create = async (data)=>{
    const review = await Review.create(data)
    return review;
}

// ------------------ R (Read)---------------------------------------------
// endpoint lista de datos
const getAll = async() => {
    const reviews = await Review.findAll();
    return reviews;
};

// endpoint dato individual
const getById = async (id) => {
    const review = await Review.findByPk(id,{
        include:{
            model: User,
            as: "owner",
            attributes: ["username","email"]
        }
    });
    return review;
};

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