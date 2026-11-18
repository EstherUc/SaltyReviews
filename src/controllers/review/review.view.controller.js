import reviewRepository from '../../repositories/review.repository.js';
import restaurantRepository from "../../repositories/restaurant.repository.js";

const create = async (req, res) => {

    try {

        // 1. Obtener el usuario desde la sesión
        const id_user = req.session.user.id_user;

        // 2. Obtener los datos del formulario
        const id_restaurant = Number(req.body.id_restaurant);

        const title = req.body.title?.trim();

        const rating = Number(req.body.rating);

        const comment = req.body.comment?.trim();

        // 3. Validar los datos
        if (
            !Number.isInteger(id_restaurant) ||
            id_restaurant <= 0 ||
            !title ||
            !comment ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).send(
                "Los datos de la reseña no son válidos"
            );
        }

        // 4. Comprobar que el restaurante existe
        const restaurant = await restaurantRepository.getById(id_restaurant);

        if (!restaurant) {
            return res.status(404).send(
                "Restaurante no encontrado"
            );
        }

        // 5. Crear la reseña
        await reviewRepository.create({
            id_user,
            id_restaurant,
            title,
            rating,
            comment
        });

        // 6. Volver al restaurante
        return res.redirect(`/restaurant/${id_restaurant}`);

    } catch (error) {

        console.error("Error al crear la reseña:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).send(
                "Ya existe una reseña con ese título"
            );
        }

        return res.status(500).send(
            "Error al crear la reseña"
        );
    }
};

const createForm = (req, res) => {
    res.render("review/create");
}

const getAll = async (req, res) => {
    const reviews = await reviewRepository.getAll();
    res.render("review/list", { reviews })
};

const getById = async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await reviewRepository.getById(id);
    res.render("review/show", { review })
};

const update = async (req, res) => {
    const id = req.params.id;
    const review = await reviewRepository.update(id, req.body);
    if (review) {
        res.redirect(`/restaurant/${review.id_restaurant}`);
    } else {
        res.redirect("/review");
    }
}

const updateForm = async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await reviewRepository.getById(id);
    res.render("review/update", { review })
}

const remove = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const review = await reviewRepository.remove(id);

        if (!review) {
            return res.status(404).send("Reseña no encontrada");
        }

        return res.redirect(
            `/restaurant/${review.id_restaurant}`
        );

    } catch (error) {

        console.error("Error al eliminar la reseña:", error);

        return res.status(500).send(
            "Error al eliminar la reseña"
        );
    }
};

export default {
    create,
    getAll,
    getById,
    update,
    createForm,
    updateForm,
    remove
}