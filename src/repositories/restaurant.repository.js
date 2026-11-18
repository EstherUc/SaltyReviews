import { User, Favorite, Review, Restaurant } from "../models/models.js";
import { Op, fn, col } from "sequelize";

// ------------------ CRUD de usuarios ------------------


// ------------------ C (Create) ------------------

//crear un resturante
const create = async (data) => {

    const restaurant = await Restaurant.create(data);
    return restaurant;

};



// ------------------ R (Read) ------------------

//obtener todos los restaurantes
const getAll = async () => {

    const restaurant = await Restaurant.findAll();
    return restaurant;
};


// Obtener un restaurante por su ID
const getById = async (id) => {
    const restaurant = await Restaurant.findByPk(id)
    return restaurant;
};

// Obtener restaurantes de una categoría concreta
const getByCategoryId = async (id_category) => {

    const restaurants = await Restaurant.findAll({
        where: {
            id_category: id_category
        }
    });

    return restaurants;
};


// Buscar un restaurante por su nombre
const getByRestaurant = async (name_restaurant) => {
    const restaurant = await Restaurant.findOne({
        where: {
            name_restaurant: name_restaurant
        }
    });

    return restaurant;
};
// Calcular la puntuación media de un restaurante
const getAverageRating = async (id) => {

    const result = await Review.findOne({
        attributes: [
            [fn("AVG", col("rating")), "averageRating"]
        ],
        where: {
            id_restaurant: id
        },
        raw: true
    });

    return result.averageRating;
};
// ------------------ U (Update) ------------------

//Actualizar completamente un restaurante
const update = async (id, data) => {

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
        return null;
    }

    restaurant.name_restaurant = data.name_restaurant;
    restaurant.address = data.address;
    restaurant.id_category = data.id_category;
    restaurant.image_url = data.image_url;

    await restaurant.save();
    return restaurant;
};



// Modificar parcialmente un restaurante
const modify = async (id, data) => {
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
        return null;
    }

    // Modificar únicamente los campos enviados
    if (data.name_restaurant !== undefined) {
        restaurant.name_restaurant = data.name_restaurant;
    }

    if (data.address !== undefined) {
        restaurant.address = data.address;
    }

    if (data.id_category !== undefined) {
        restaurant.id_category = data.id_category;
    }

    if (data.image_url !== undefined) {
        restaurant.image_url = data.image_url;
    }

    await restaurant.save();

    return restaurant;
};

// ------------------ D (Delete) ------------------

// Eliminar un restaurante
const remove = async (id) => {
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
        return null;
    }

    await restaurant.destroy();

    return restaurant;
};

export default {
    create,
    getAll,
    getById,
    getByCategoryId,
    getByRestaurant,
    getAverageRating,
    update,
    modify,
    remove
};