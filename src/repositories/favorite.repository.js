import { Favorite, Restaurant, User } from "../models/models.js"

// ------------------ CRUD de favoritos ------------------


// ------------------ C (Create)------------------------------------
/**
 * Crea un nuevo registro de favorito en la base de datos.
 *
 * Utiliza el método create de Sequelize para insertar
 * un nuevo registro en el modelo Favorite.
 *
 * @async
 * @param {Object} data - Datos del favorito que se quiere crear.
 * @returns {Promise<Favorite>} Favorito creado.
 */
const create = async (data) => {
    const favorite = await Favorite.create(data);
    return favorite;
    /* const existingFav = await Favorite.findOne({
        where: {
            id_user: data.id_user,
            id_restaurant: data.id_restaurant
        }

    });
    
    if(existingFav){
        
        return existingFav;

    } */
};
/**
 * Añade o elimina un restaurante de los favoritos de un usuario.
 *
 * Primero comprueba si existe un favorito asociado
 * al usuario y al restaurante indicados.
 *
 * Si existe, elimina el registro de favoritos y devuelve false.
 * Si no existe, crea el registro mediante findOrCreate
 * y devuelve true.
 *
 * @async
 * @param {number} id_user - Identificador del usuario.
 * @param {number} id_restaurant - Identificador del restaurante.
 * @returns {Promise<boolean>} true si se añade el favorito o false si se elimina.
 */

const toggle = async (id_user, id_restaurant) => {

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
 * @async
 * @param {number} id_user - Identificador del usuario.
 * @returns {Promise<Favorite[]>} Lista de favoritos del usuario con sus relaciones.
 */
const getAllByUser = async (id_user) => {
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
};

// endpoint dato individual
const getById = async (id) => {
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
};


/**
 * Obtiene un favorito mediante su identificador.
 *
 * Busca el favorito utilizando su clave primaria
 * e incluye los datos del usuario y del restaurante asociados.
 *
 * Si el favorito no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del favorito.
 * @returns {Promise<Favorite|null>} Favorito encontrado o null si no existe.
 */
const getRestaurantIdsByUser = async (id_user) => {

    const favorites = await Favorite.findAll({
        where: {
            id_user
        },
        attributes: ["id_restaurant"]
    });

    return favorites.map(favorite => favorite.id_restaurant);
};


// ---------------- U (Update) -----------------------------------
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
 * Si no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador del favorito que se quiere eliminar.
 * @param {number} id_user - Identificador del usuario propietario del favorito.
 * @returns {Promise<Favorite|null>} Favorito eliminado o null si no existe.
 */
const remove = async (id, id_user) => {

    const favorite = await Favorite.findOne({
        where: {
            id_favorites: id,
            id_user
        }
    });

    if (!favorite) {
        return null;
    }

    await favorite.destroy();

    return favorite;
};


/**
 * Elimina todos los favoritos asociados a un usuario.
 *
 * Utiliza el método destroy de Sequelize para eliminar
 * todos los registros cuyo id_user coincida con el recibido.
 *
 * Devuelve el número de registros eliminados.
 *
 * @async
 * @param {number} userId - Identificador del usuario.
 * @returns {Promise<number>} Número de favoritos eliminados.
 */
const removeAllByUser = async (userId) => {
    const deletedFavs = await Favorite.destroy({
        where: {
            id_user: userId
        }
    });


    return deletedFavs;

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