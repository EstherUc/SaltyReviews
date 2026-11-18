import { Favorite, Restaurant, User } from "../models/models.js"
import { throwError, NotFoundError } from "../utils/errors.js";

// ------------------ CRUD de favoritos ------------------


// ------------------ C (Create)------------------------------------
/**
 * Crea un nuevo registro de favorito en la base de datos.
 *
 * Utiliza el método create de Sequelize para insertar
 * un nuevo registro en el modelo Favorite.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {Object} data - Datos del favorito que se quiere crear.
 * @returns {Promise<Favorite>} Favorito creado.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const create = async (data) => {

    try {
        
        const favorite = await Favorite.create(data);
        return favorite;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
    
};

/**
 * Añade o elimina un restaurante de los favoritos de un usuario.
 *
 * Primero comprueba que el restaurante exista en la base de datos.
 * Si no existe, lanza un NotFoundError.
 *
 * Después comprueba si el usuario ya tiene ese restaurante
 * registrado entre sus favoritos.
 *
 * Si existe, elimina el registro y devuelve false.
 * Si no existe, lo añade mediante findOrCreate y devuelve true.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id_user - Identificador del usuario.
 * @param {number} id_restaurant - Identificador del restaurante.
 * @returns {Promise<boolean>} true si se añade el favorito o false si se elimina.
 * @throws {NotFoundError} Si el restaurante no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const toggle = async (id_user, id_restaurant) => {

    try {

        const restaurant = await Restaurant.findByPk(id_restaurant);

        if (!restaurant) {
            throw new NotFoundError("Restaurante no encontrado");
        }
        
        // Buscamos si el usuario ya tiene ese restaurante
        const existingFavorite = await Favorite.findOne({
            where: {
                id_user,
                id_restaurant
            }
        });
    
        if (existingFavorite) {
    
            // Si existe, quitamos el restaurante de favoritos
            await Favorite.destroy({
                where: {
                    id_user,
                    id_restaurant
                }
            });
    
            return false;
        }
    
        // Si no existe, lo añadimos
        await Favorite.findOrCreate({
            where: {
                id_user,
                id_restaurant
            }
        });
    
        return true;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


// ------------------ R (Read)---------------------------------------------
/**
 * Obtiene todos los favoritos de un usuario.
 *
 * Filtra los registros del modelo Favorite mediante
 * el identificador del usuario.
 *
 * Incluye los datos del usuario y del restaurante
 * asociados a cada favorito.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id_user - Identificador del usuario.
 * @returns {Promise<Favorite[]>} Lista de favoritos del usuario con sus relaciones.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getAllByUser = async (id_user) => {

    try {
        
        const favorites = await Favorite.findAll({
            where: {
                id_user: id_user
            },
            include: [
                {
                    model: User,
                    as: "user"
                },
                {
                    model: Restaurant,
                    as: "restaurant"
    
                }
            ]
        });
    
        return favorites;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};

/**
 * Obtiene un favorito mediante su identificador.
 *
 * Busca el favorito utilizando su clave primaria
 * e incluye los datos del usuario y del restaurante asociados.
 *
 * Si el favorito no existe, devuelve null.
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador del favorito.
 * @returns {Promise<Favorite|null>} Favorito encontrado o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getById = async (id) => {

    try {
        
        const favorite = await Favorite.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user"
                },
                {
                    model: Restaurant,
                    as: "restaurant"
    
                }]
    
        });
        return favorite;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


/**
 * Obtiene los identificadores de los restaurantes favoritos de un usuario.
 *
 * Busca los favoritos asociados al usuario y recupera
 * únicamente el campo id_restaurant de cada registro.
 *
 * Utiliza map para generar un array con los identificadores.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id_user - Identificador del usuario.
 * @returns {Promise<number[]>} Lista de identificadores de restaurantes favoritos.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */

const getRestaurantIdsByUser = async (id_user) => {

    try {
        
        const favorites = await Favorite.findAll({
            where: {
                id_user
            },
            attributes: ["id_restaurant"]
        });
    
        return favorites.map(favorite => favorite.id_restaurant);

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


// ---------------- U (Update) -----------------------------------

/**
 * Actualiza el campo want_to_visit de un favorito existente.
 *
 * Busca el favorito mediante su identificador.
 * Si existe, modifica el valor de want_to_visit
 * y guarda los cambios utilizando save de Sequelize.
 *
 * Si el favorito no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del favorito que se quiere actualizar.
 * @param {Object} data - Datos que se quieren actualizar.
 * @param {boolean} data.want_to_visit - Nuevo valor del campo want_to_visit.
 * @returns {Promise<Favorite|null>} Favorito actualizado o null si no existe.
 */
const update = async (id, data) => {
    const favorite = await Favorite.findByPk(id);

    if (favorite) {
        favorite.want_to_visit = data.want_to_visit;

        await favorite.save();
        return favorite;
    } else {
        return null;
    }
};


// ------------------------ D (Delete)----------------------------
/**
 * Elimina un favorito concreto perteneciente a un usuario.
 *
 * Busca un registro que coincida tanto con el identificador
 * del favorito como con el identificador del usuario.
 *
 * Si lo encuentra, elimina el registro mediante destroy.
 * Si no existe, lanza un NotFoundError.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador del favorito que se quiere eliminar.
 * @param {number} id_user - Identificador del usuario propietario del favorito.
 * @returns {Promise<Favorite>} Favorito eliminado.
 * @throws {NotFoundError} Si el favorito no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const remove = async (id, id_user) => {

    try {
        
        const favorite = await Favorite.findOne({
            where: {
                id_favorites: id,
                id_user
            }
        });
    
        if (!favorite) {
            throw new NotFoundError("Favorito no encontrado");
        }
    
        await favorite.destroy();
    
        return favorite;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};



/**
 * Elimina todos los favoritos asociados a un usuario.
 *
 * Utiliza el método destroy de Sequelize para eliminar
 * todos los registros cuyo id_user coincida con el recibido.
 *
 * Devuelve el número de registros eliminados.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} userId - Identificador del usuario.
 * @returns {Promise<number>} Número de favoritos eliminados.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const removeAllByUser = async (userId) => {

    try {
        
        const deletedFavs = await Favorite.destroy({
            where: {
                id_user: userId
            }
        });

        return deletedFavs;

    } catch (error) {
        console.error(error);
        throwError(error);
    }


}

export default {
    create,
    toggle,
    getRestaurantIdsByUser,
    getAllByUser,
    getById,
    update,
    remove,
    removeAllByUser
};