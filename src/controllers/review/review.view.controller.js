import { reviews } from '../../models/datos_prueba.js';
console.log("CONTROLADOR DE REVIEWS CARGADO");

/* const create = (req, res) => {
    const id = reviews[reviews.length - 1].id_reviews + 1
    const { id_reviews, id_user, id_restaurant, title, rating, comment } = req.body;
    const review = {
        id_reviews,
        id_user,
        id_restaurant,
        title,
        rating,
        comment
    }
    reviews.push(review)
    res.redirect("/review/" + id);
} */

const create = (req, res) => {
    const id = reviews.length > 0
        ? Math.max(...reviews.map(review => review.id_reviews)) + 1
        : 1;

    const { title, rating, comment } = req.body;

    const review = {
        id_reviews: id,
        id_user: 1,
        id_restaurant: 1,
        title,
        rating,
        comment
    };

    reviews.push(review);

    console.log("CREATE EJECUTADO");
    console.log("Nueva review:", review);
    console.log("Redirigiendo a /review");

    res.redirect("/review");
};

const createForm = (req, res) => {
    const reviewId = 1 // después vendrá del middleware
    res.render("review/create", { review_id: reviewId });
}

const getAll = (req, res) => {
    res.render("review/list", { reviews })
};

/* const getById = (req, res) => {
    const id = parseInt(req.params.id);
    const review = reviews.find(u => u.id_reviews === id)
    res.render("review/show", { review })
}; */

const getById = (req, res) => {
    console.log("GETBYID EJECUTADO");
    console.log("URL solicitada:", req.originalUrl);

    const id = parseInt(req.params.id);
    const review = reviews.find(u => u.id_reviews === id);
    res.render("review/show", { review });
};

const update = (req, res) => {
    const { id_reviews, id_user, id_restaurant, title, rating, comment } = req.body;
    const id = req.params.id;
    const review = reviews.find(u => u.id_reviews === id)
    review.id_reviews = id_reviews;
    review.id_user = id_user;
    review.id_restaurant = id_restaurant;
    review.title = title;
    review.rating = rating;
    review.comment = comment;
    res.redirect("/review/" + review.id_reviews);
}

const updateForm = (req, res) => {
    const id = req.params.id;
    const review = reviews.find(u => u.id_reviews === id)
    res.render("review/update", { review })
}

/* const remove = (req, res) => {
    const id = parseInt(req.params.id);

    const index = reviews.findIndex(review => review.id_reviews === id);

    if (index > -1) {
        reviews.splice(index, 1);
    }

    res.redirect("/review");
} */

const remove = (req, res) => {
    console.log("¡HE LLEGADO A LA FUNCIÓN REMOVE!");
    console.log("ID recibido:", req.params.id);

    const id = parseInt(req.params.id);

    const index = reviews.findIndex(review => review.id_reviews === id);

    console.log("Índice encontrado:", index);

    if (index > -1) {
        reviews.splice(index, 1);
        console.log("Review eliminada correctamente");
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