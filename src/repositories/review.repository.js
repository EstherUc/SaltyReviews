import { Review, User } from "../models/models.js";
import { Op } from "sequelize";
import { throwError, NotFoundError } from "../utils/errors.js";

// ------------------ CRUD de review ----------------------------

// ------------------ C (Create)

/**
 * Crea una nueva reseña en la base de datos.
 *
 * Utiliza el método create de Sequelize para insertar
 * un nuevo registro en el modelo Review.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {Object} data - Datos de la reseña que se quiere crear.
 * @returns {Promise<Review>} Reseña creada.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
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
/**
 * Obtiene todas las reseñas registradas en la base de datos.
 *
 * Utiliza findAll de Sequelize e incluye los datos
 * del usuario asociado a cada reseña.
 *
 * De cada usuario recupera únicamente su nombre
 * de usuario y dirección de correo electrónico.
 *
 * @async
 * @returns {Promise<Review[]>} Lista de reseñas con sus usuarios asociados.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
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


/**
 * Obtiene todas las reseñas asociadas a un restaurante concreto.
 *
 * Filtra las reseñas mediante el identificador del restaurante.
 * Incluye el nombre del usuario que ha publicado cada reseña.
 *
 * Los resultados se ordenan por fecha de creación,
 * mostrando primero las reseñas más recientes.
 *
 * @async
 * @param {number} id_restaurant - Identificador del restaurante.
 * @returns {Promise<Review[]>} Lista de reseñas del restaurante, ordenadas de más reciente a más antigua.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
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

/**
 * Obtiene una reseña mediante su identificador.
 *
 * Busca la reseña utilizando su clave primaria
 * e incluye el nombre y el email del usuario asociado.
 *
 * Si no existe una reseña con ese identificador,
 * devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la reseña.
 * @returns {Promise<Review|null>} Reseña encontrada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
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

/**
 * Actualiza completamente los datos de una reseña existente.
 *
 * Busca la reseña mediante su identificador y actualiza
 * su título, puntuación y comentario.
 *
 * Guarda los cambios utilizando el método save de Sequelize.
 * Si la reseña no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la reseña que se quiere actualizar.
 * @param {Object} data - Datos para actualizar la reseña.
 * @param {string} data.title - Nuevo título de la reseña.
 * @param {number} data.rating - Nueva puntuación de la reseña.
 * @param {string} data.comment - Nuevo comentario de la reseña.
 * @returns {Promise<Review|null>} Reseña actualizada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
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
/**
 * Modifica parcialmente los datos de una reseña existente.
 *
 * Busca la reseña mediante su identificador y modifica
 * los campos proporcionados.
 *
 * Si no se proporciona un nuevo título, puntuación
 * o comentario, conserva el valor anterior.
 *
 * Guarda los cambios mediante save de Sequelize.
 * Si la reseña no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la reseña que se quiere modificar.
 * @param {Object} data - Datos que se quieren modificar.
 * @param {string} [data.title] - Nuevo título de la reseña.
 * @param {number} [data.rating] - Nueva puntuación de la reseña.
 * @param {string} [data.comment] - Nuevo comentario de la reseña.
 * @returns {Promise<Review|null>} Reseña modificada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
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

/**
 * Elimina una reseña de la base de datos.
 *
 * Busca la reseña mediante su identificador y,
 * si existe, elimina su registro utilizando destroy de Sequelize.
 *
 * Si la reseña no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la reseña que se quiere eliminar.
 * @returns {Promise<Review|null>} Reseña eliminada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la eliminación.
 */

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