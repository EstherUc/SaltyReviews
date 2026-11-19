import { User, Favorite, Review, Restaurant, Category } from "../models/models.js";
import { Op, fn, col } from "sequelize";

// ------------------ CRUD de restaurantes ------------------


// ------------------ C (Create) ------------------

/**
 * Crea un nuevo restaurante en la base de datos.
 *
 * Utiliza el método create de Sequelize para insertar
 * un nuevo registro en el modelo Restaurant.
 *
 * @async
 * @param {Object} data - Datos del restaurante que se quiere crear.
 * @returns {Promise<Restaurant>} Restaurante creado.
 */
const create = async (data) => {

    const restaurant = await Restaurant.create(data);
    return restaurant;

};



// ------------------ R (Read) ------------------

/**
 * Obtiene todos los restaurantes registrados en la base de datos.
 *
 * Utiliza el método findAll de Sequelize para recuperar
 * todos los registros del modelo Restaurant.
 *
 * @async
 * @returns {Promise<Restaurant[]>} Lista de restaurantes registrados.
 */
const getAll = async () => {

    const restaurant = await Restaurant.findAll();
    return restaurant;
};


/**
 * Obtiene un restaurante mediante su identificador.
 *
 * Busca el restaurante utilizando su clave primaria
 * mediante el método findByPk de Sequelize.
 *
 * Si el restaurante no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del restaurante.
 * @returns {Promise<Restaurant|null>} Restaurante encontrado o null si no existe.
 */
const getById = async (id) => {
    const restaurant = await Restaurant.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id_category", "name_category"]
                }
            ]
        });
    return restaurant;
};

/**
 * Obtiene todos los restaurantes pertenecientes a una categoría.
 *
 * Filtra los registros del modelo Restaurant mediante
 * el campo id_category utilizando findAll de Sequelize.
 *
 * @async
 * @param {number} id_category - Identificador de la categoría.
 * @returns {Promise<Restaurant[]>} Lista de restaurantes asociados a la categoría.
 */
const getByCategoryId = async (id_category) => {

    const restaurants = await Restaurant.findAll({
        where: {
            id_category: id_category
        }
    });

    return restaurants;
};


/**
 * Busca un restaurante mediante su nombre.
 *
 * Utiliza el método findOne de Sequelize para localizar
 * un restaurante cuyo campo name_restaurant coincida
 * con el nombre proporcionado.
 *
 * Si no existe, devuelve null.
 *
 * @async
 * @param {string} name_restaurant - Nombre del restaurante que se quiere buscar.
 * @returns {Promise<Restaurant|null>} Restaurante encontrado o null si no existe.
 */
const getByRestaurant = async (name_restaurant) => {
    const restaurant = await Restaurant.findOne({
        where: {
            name_restaurant: name_restaurant
        }
    });

    return restaurant;
};
/**
 * Calcula la puntuación media de un restaurante a partir de sus reseñas.
 *
 * Utiliza la función AVG de Sequelize para calcular
 * la media de las puntuaciones asociadas al restaurante.
 *
 * @async
 * @param {number} id - Identificador del restaurante.
 * @returns {Promise<string|null>} Puntuación media del restaurante o null si no tiene valoraciones.
 */
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


/**
 * Actualiza completamente los datos de un restaurante existente.
 *
 * Busca el restaurante mediante su identificador y actualiza
 * su nombre, dirección y categoría.
 *
 * Guarda los cambios mediante el método save de Sequelize.
 * Si el restaurante no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del restaurante que se quiere actualizar.
 * @param {Object} data - Datos para actualizar el restaurante.
 * @param {string} data.name_restaurant - Nuevo nombre del restaurante.
 * @param {string} data.address - Nueva dirección del restaurante.
 * @param {number} data.id_category - Identificador de la nueva categoría.
 * @returns {Promise<Restaurant|null>} Restaurante actualizado o null si no existe.
 */
const update = async (id, data) => {

    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
        return null;
    }

    restaurant.name_restaurant = data.name_restaurant;
    restaurant.address = data.address;
    restaurant.id_category = data.id_category;
    // Conservar la foto al editar otros datos si no llega una nueva imagen
    if (data.image_url !== undefined) {
        restaurant.image_url = data.image_url;
    }

    await restaurant.save();
    return restaurant;
};





/**
 * Modifica parcialmente los datos de un restaurante existente.
 *
 * Busca el restaurante mediante su identificador y modifica
 * únicamente los campos que se hayan proporcionado.
 *
 * Comprueba si cada propiedad es diferente de undefined
 * antes de actualizar su valor.
 *
 * Guarda los cambios mediante el método save de Sequelize.
 * Si el restaurante no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del restaurante que se quiere modificar.
 * @param {Object} data - Datos que se quieren modificar.
 * @param {string} [data.name_restaurant] - Nuevo nombre del restaurante.
 * @param {string} [data.address] - Nueva dirección del restaurante.
 * @param {number} [data.id_category] - Identificador de la nueva categoría.
 * @returns {Promise<Restaurant|null>} Restaurante modificado o null si no existe.
 */

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

/**
 * Elimina un restaurante de la base de datos.
 *
 * Busca el restaurante mediante su identificador y,
 * si existe, elimina su registro utilizando
 * el método destroy de Sequelize.
 *
 * Si el restaurante no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del restaurante que se quiere eliminar.
 * @returns {Promise<Restaurant|null>} Restaurante eliminado o null si no existe.
 */
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