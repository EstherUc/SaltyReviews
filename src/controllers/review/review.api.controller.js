import { reviews } from '../../models/datos_prueba.js';

const create = (req,res)=>{
    const id = reviews[reviews.length-1].id_reviews + 1
    const {id_reviews,id_user,id_restaurant,title,rating,comment} = req.body;
    const review = {
        id_reviews,
        id_user,
        id_restaurant,
        title,
        rating,
        comment
    }
    reviews.push(review)
    res.json({data:review})
}

const getAll = (req, res) => {
    res.json({data:reviews})
};

const getById =(req, res) => {
    const id = parseInt(req.params.id);
    const review = reviews.find(u=>u.id_reviews === id)
    res.json({data:review})
};

const update =(req,res)=>{
    const {id_reviews,id_user,id_restaurant,title,rating,comment} = req.body;
    const id = req.params.id;
    const review  = reviews.find(u=>u.id_reviews===id)
    review.id_reviews = id_reviews;
    review.id_user = id_user;
    review.id_restaurant = id_restaurant;
    review.title = title;
    review.rating = rating;
    review.comment = comment;
    res.json({data:review})
}

const modify =(req,res)=>{
    const {id_reviews,id_user,id_restaurant,title,rating,comment} = req.body;
    const id = req.params.id;
    const review  = reviews.find(u=>u.id_reviews===id)

    review.id_reviews = id_reviews;
    review.id_user = id_user;
    review.id_restaurant = id_restaurant;
    review.title = title;
    review.rating = rating;
    review.comment = comment;
    res.json({data:review});
}

const remove =(req,res)=>{
    const id  = parseInt(req.params.id);
    const index = reviews.findIndex(u=>u.id_reviews === id);
    let review;
    if(index > -1){
        review =reviews.splice(index,1);
    }
    res.json({data:review});
}

export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}