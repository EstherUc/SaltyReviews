import favoriteRepository from "../../repositories/favorite.repository.js";

// ------------------ CRUD de favoritos ------------------

// ------------------ C (Create) ------------------

const create = async(req,res) => {

    const { id_user, id_restaurant, want_to_visit } = req.body;

    //comprueba que se han enviado los datos obligatorios
    if (!id_user || !id_restaurant) {

        return res.status(400).json({
            message: "El usuario y el restaurante son obligatorios"
        });
    }

    //creamos el favorito
    const favorite = await favoriteRepository.create({
        id_user,
        id_restaurant,
        want_to_visit
    });


    res.status(201).json({ data: favorite });

};

// ------------------ R (Read) ------------------

//obtener todos los favoritos de un usuario
const getAllByUser = async(req,res) => {

    const userId = parseInt(req.params.userId);

    const favorites = await favoriteRepository.getAllByUser(userId);

    res.json({ data: favorites });

};

//obtener un solo favorito por su ID
const getById = async(req,res) => {

    const id = parseInt(req.params.id);

    const favorite = await favoriteRepository.getById(id);

    //comprobamos si existe
    if (!favorite) {

        return res.status(404).json({
            message: "Favorito no encontrado"
        });
    }

    res.json({ data: favorite });

};

// ------------------ U (Update) ------------------

/* //actualizar el campo want_to_visit de un favorito
const update = async(req,res) => {

    const id = parseInt(req.params.id);

    const favorite = await favoriteRepository.getById(id);

    if (!favorite) {

        return res.status(404).json({
            message: "Favorito no encontrado"
        });
    }

    const { want_to_visit } = req.body;

    //comprobamos que se haya enviado el campo
    if (want_to_visit === undefined) {

        return res.status(400).json({
            message: "Debes enviar el campo want_to_visit"
        });
    }

    //comprobamos que sea un booleano
    if (typeof want_to_visit !== "boolean") {

        return res.status(400).json({
            message: "want_to_visit debe ser un valor booleano"
        });
    }

    //actualizamos el favorito
    const favoriteUpdate = await favoriteRepository.update(id, {
        want_to_visit
    });

    res.json({ data: favoriteUpdate });

}; */

// ------------------ D (Delete) ------------------

//eliminar un favorito
const remove = async(req,res) => {

    const id = parseInt(req.params.id);

    const favorite = await favoriteRepository.remove(id);

    //comprueba si existe en favoritos
    if (!favorite) {

        return res.status(404).json({
            message: "Favorito no encontrado"
        });
    }

    res.json({ data: favorite });

};

//eliinar todos los favoritos de un usuario
const removeAllByUser = async(req,res) => {

    const userId = parseInt(req.params.userId);

    const deletedFavoritesCount = await favoriteRepository.removeAllByUser(userId);

    res.json({
        message: "Favoritos eliminados correctamente",
        deletedFavoritesCount
    });

};

export default {
    create,
    getAllByUser,
    getById,
    //update,
    remove,
    removeAllByUser
};