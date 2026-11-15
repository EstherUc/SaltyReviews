import { Favorite, Restaurant} from "../models/models.js"

// ------------------ CRUD de favoritos ------------------


// ------------------ C (Create)------------------------------------
// endpoint para crear un favorito evitando duplicados
const create = async (data) => {
    const existingFav = await Favorite.findOne({
        where: {
            id_user: data.id_user,
            id_restaurant: data.id_restaurant
        }

    });
    
    if(existingFav){
        
        return existingFav;

    }

    const favorite = await Favorite.create(data);
    return favorite;
};


// ------------------ R (Read)---------------------------------------------
// endpoint lista de favoritos
const getAllByUser = async(id_user) => {
    const favorites = await Favorite.findAll({
        where: {
            id_user: id_user
        },
        include: {
            model: Restaurant,
            as: "restaurant"

        } 
    });

    return favorites;
};

// endpoint dato individual
const getById = async (id) =>{
    const favorite = await Favorite.findByPk(id, {
        include:{
            model: Restaurant,
            as: "restaurant"
        }
    
    });
        return favorite;
};


// ---------------- U (Update) -----------------------------------
const update = async (id, data) => {
    const favorite = await Favorite.findByPk(id);

    if(favorite){
        favorite.want_to_visit = data.want_to_visit;

        await favorite.save();
        return favorite;
    }else{
        return null;
    }
};





// ------------------------ D (Delete)----------------------------
//borrar un solo favorito
const remove = async (id)=>{
    const favorite = await Favorite.findByPk(id);
    if(favorite){
        await favorite.destroy();
        return favorite;
    }
    return null;
}

//borrar todos los favoritos
const removeAllByUser = async (id_user) =>{
    const deletedFavs = await Favorite.destroy({
        where:{
            id_user : id_user
        }
    });

    return deletedFavs;

}

export default {
    create,
    getAllByUser,
    getById,
    update,
    remove,
    removeAllByUser
}