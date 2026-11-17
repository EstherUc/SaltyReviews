import favoriteRepository from "../../repositories/favorite.repository.js";

// ------------------ Vistas de favoritos ------------------

// ------------------ C (Create) ------------------

//crear un favorito
const create = async(req,res) => {

    const { id_user, id_restaurant, want_to_visit } = req.body;

  
    const favorite = await favoriteRepository.create({
        id_user,
        id_restaurant,
        want_to_visit
    });

    //vuelve a la lista de favoritos del usuario
    res.redirect("/favorite/user/" + id_user);

};

// ------------------ R (Read) ------------------

//mostrar lista con todos los favoritos del usuario
const getAllByUser = async(req,res) => {

    const userId = parseInt(req.params.userId);


    //consulta los favoritos del usuario
    const favorites = await favoriteRepository.getAllByUser(userId);

    //pasamos al render los favoritos segun usuario
    res.render("favorite/list", { favorites, userId });

};

/* //muestra un favorito por su ID
const getById = async(req,res) => {

    const favorite = await favoriteRepository.getById(id);

    //comproba si existe
    if (!favorite) {

        return res.status(404).send("Favorito no encontrado");
    }

}; */

// ------------------ U (Update) ------------------

/* //actualizar el campo want_to_visit de un favorito
const update = async(req,res) => {

    const id = parseInt(req.params.id);

    //buscamos el favorito
    const favorite = await favoriteRepository.getById(id);

    //comprobamos si existe
    if (!favorite) {

        return res.status(404).send("Favorito no encontrado");
    }

    if (req.body.want_to_visit !== "true" && req.body.want_to_visit !== "false") {

    return res.status(400).send("want_to_visit debe ser true o false");
}

const want_to_visit = req.body.want_to_visit === "true";

    //comprobamos que sea un booleano
    if (typeof want_to_visit !== "boolean") {

        return res.status(400).send("want_to_visit debe ser un valor booleano");
    }

    //actualizamos el favorito
    await favoriteRepository.update(id, {
        want_to_visit
    });

    //volvemos a la lista de favoritos del usuario
    res.redirect("/favorite/user/" + favorite.id_user);

}; */

// ------------------ D (Delete) ------------------

//eliminar un favorito
const remove = async(req,res) => {

    const id = parseInt(req.params.id);

    const favorite = await favoriteRepository.remove(id);

    //comprobar si existe el favorito
    if (!favorite) {

        return res.status(404).send("Favorito no encontrado");
    }

    
    res.redirect("/favorite/user/" + favorite.id_user);

};

//eliminar todos los favoritos de un usuario
const removeAllByUser = async(req,res) => {

    const userId = parseInt(req.params.userId); 

    const deleted = await favoriteRepository.removeAllByUser(userId);
    console.log("Usuario:", userId);
    console.log("Favoritos eliminados:", deleted);

    res.redirect("/favorite/user/" + userId);

};

export default {
    create,
    getAllByUser,
    //getById,
    //update,
    remove,
    removeAllByUser
};