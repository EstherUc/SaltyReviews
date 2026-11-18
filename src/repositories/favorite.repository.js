import { Favorite, Restaurant, User } from "../models/models.js"

// ------------------ CRUD de favoritos ------------------


// ------------------ C (Create)------------------------------------
// endpoint para crear un favorito evitando duplicados
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

// Añadir o quitar un restaurante de favoritos
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
// endpoint lista de favoritos
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

// Obtener las IDs de los restaurantes favoritos de un usuario
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
//borrar un solo favorito
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

//borrar todos los favoritos
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