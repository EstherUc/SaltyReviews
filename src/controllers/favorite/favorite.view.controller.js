import favoriteRepository from "../../repositories/favorite.repository.js";

// ------------------ Vistas de favoritos ------------------

// ------------------ C (Create) ------------------

//crear un favorito
const create = async (req, res) => {

    const id_user = req.session.user.id_user;

    const id_restaurant = Number(req.body.id_restaurant);

    if (!Number.isInteger(id_restaurant) || id_restaurant <= 0) {
        return res.status(400).send("ID de restaurante es incorrecta")
    }


    await favoriteRepository.create({
        id_user,
        id_restaurant,

    });

    //vuelve a la lista de favoritos del usuario
    res.redirect("/favorite");

};

// Añadir o quitar un restaurante de favoritos
const toggle = async (req, res) => {

    try {

        // Usuario autenticado
        const id_user = req.session.user.id_user;

        // Restaurante seleccionado
        const id_restaurant = Number(req.body.id_restaurant);

        if (
            !Number.isSafeInteger(id_restaurant) ||
            id_restaurant <= 0
        ) {
            return res.status(400).send(
                "El restaurante seleccionado no es válido"
            );
        }

        // Añadir o quitar favorito
        await favoriteRepository.toggle(
            id_user,
            id_restaurant
        );

        // Recuperar la página de origen
        const returnTo = req.body.returnTo;

        let destination = "/home";

        if (
            typeof returnTo === "string" &&
            returnTo.startsWith("/") &&
            !returnTo.startsWith("//") &&
            !returnTo.includes("\\")
        ) {
            const url = new URL(returnTo, "http://localhost");

            const allowed =
                url.pathname === "/home" ||
                url.pathname === "/restaurant" ||
                url.pathname === "/favorite" ||
                /^\/restaurant\/\d+$/.test(url.pathname) ||
                /^\/user\/\d+$/.test(url.pathname);

            if (allowed) {
                destination = url.pathname + url.search;
            }
        }

        // Volver a la página anterior
        return res.redirect(303, destination);

    } catch (error) {

        console.error("Error al modificar favoritos:", error);

        return res.status(500).send(
            "No se ha podido modificar el favorito"
        );
    }
};

// ------------------ R (Read) ------------------

//mostrar lista con todos los favoritos del usuario
const getAllByUser = async (req, res) => {

    const id_user = req.session.user.id_user;


    //consulta los favoritos del usuario
    const favorites = await favoriteRepository.getAllByUser(id_user);

    //pasamos al render los favoritos segun usuario
    res.render("favorite/list", { favorites });

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
const remove = async (req, res) => {

    const id_favorite = parseInt(req.params.id);
    const deleted = await favoriteRepository.remove(
        id_favorite,
        req.session.user.id_user
    );
    //comprobar si existe el favorito
    if (!id_favorite) {

        return res.status(404).send("Favorito no encontrado");
    }

    res.redirect("/favorite");
};

//eliminar todos los favoritos de un usuario
const removeAllByUser = async (req, res) => {

    const id_user = req.session.user.id_user;

    await favoriteRepository.removeAllByUser(id_user);


    res.redirect("/favorite");

};

export default {
    create,
    toggle,
    getAllByUser,
    remove,
    removeAllByUser
};