import { Review, User } from "../models/models.js";
import { Op } from "sequelize";
import { throwError, NotFoundError } from "../utils/errors.js";

// ------------------ CRUD de review ----------------------------

// ------------------ C (Create)
// endpoint para crear dato
const create = async (data) => {
    try {
        const review = await Review.create(data);
        return review;
    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

// ------------------ R (Read)---------------------------------------------
// endpoint lista de todas las reseñas con sus usuarios 
const getAll = async () => {
    try {
        const reviews = await Review.findAll({
            include: {
                model: User,
                as: "user",
                attributes: ["username", "email"]
            }
        });

        return reviews;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

// Obtener las reseñas de un restaurante concreto
const getByRestaurantId = async (id_restaurant) => {
    try {
        const reviews = await Review.findAll({
            where: {
                id_restaurant
            },
            include: {
                model: User,
                as: "user",
                attributes: ["username"]
            },
            order: [["createdAt", "DESC"]]
        });

        return reviews;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

// endpoint dato individual
const getById = async (id) => {
    try {
        const review = await Review.findByPk(id, {
            include: {
                model: User,
                as: "user",
                attributes: ["username", "email"]
            }
        });
        return review;
    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

// ---------------- U (Update) -----------------------------------
// endpoint para cambiar dato por completo
const update = async (id, data) => {
    try {
        const { title, rating, comment } = data;
        const review = await Review.findByPk(id);
        if (review) {
            review.title = title;
            review.rating = rating;
            review.comment = comment;
            await review.save();
            return review;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        throwError(error);
    }
}

const modify = async (id, data) => {
    try {
        const { title, rating, comment } = data;
        const review = await Review.findByPk(id);
        if (!review) {
            return null;
        }
        review.title = title || review.title;
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();
        return review;
    } catch (error) {
        console.error(error);
        throwError(error);
    }
}

// ------------------------ D (Delete)------------
const remove = async (id) => {
    try {
        const review = await Review.findByPk(id);
        if (review) {
            await review.destroy();
            return review;
        }
        return null;
    } catch (error) {
        console.error(error);
        throwError(error);
    }
}

export default {
    create,
    getAll,
    getByRestaurantId,
    getById,
    update,
    modify,
    remove
};