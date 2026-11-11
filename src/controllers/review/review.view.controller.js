import { reviews } from '../../models/datos_prueba.js';

const create = (req,res)=>{
    const id = reviews[reviews.length-1].id + 1
    const {id_reviews,id_user,id_restaurant,rating,comment} = req.body;
    const review = {
        id_reviews,
        id_user,
        id_restaurant,
        rating,
        comment
    }
    reviews.push(review)
    res.redirect("/review/"+id);
}

const createForm = (req,res)=>{
    const reviewId = 1 // después vendrá del middleware
    res.render("review/create",{review_id:reviewId});
}

const getAll = (req, res) => {
    res.render("review/list",{reviews})
};

const getById =(req, res) => {
    const id = parseInt(req.params.id);
    const review = reviews.find(u=>u.id === id)
    res.render("review/show",{review})
};

const update =(req,res)=>{
    const {id_reviews,id_user,id_restaurant,rating,comment} = req.body;
    const id = req.params.id;
    const review  = reviews.find(u=>u.id===id)
    review.id_reviews = id_reviews;
    review.id_user = id_user;
    review.id_restaurant = id_restaurant;
    review.rating = rating;
    review.comment = comment;
    res.redirect("/review/"+review.id);
}

const updateForm = (req,res)=>{
    const id = req.params.id;
    const review  = reviews.find(u=>u.id===id)
    res.render("review/update", {review})
}

const remove =(req,res)=>{
    const id  = parseInt(req.params.id);
    const index = reviews.findIndex(u=>u.id === id);
    let review;
    if(index > -1){
        review =reviews.splice(index,1);
    }
    res.redirect("/review");
}

export default {
    create,
    getAll,
    getById,
    update,
    createForm,
    updateForm,
    remove
}