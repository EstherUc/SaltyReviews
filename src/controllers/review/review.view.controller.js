import reviewRepository from '../../repositories/review.repository.js';
import restaurantRepository from "../../repositories/restaurant.repository.js";

const create = async (req, res) => {

    // Obtenemos los datos del formulario
    const id_restaurant = Number(req.body.id_restaurant);

    // Guardamos los datos para recuperarlos si hay errores
    const formData = {
        title: typeof req.body.title === "string"
            ? req.body.title.trim()
            : "",

        rating: typeof req.body.rating === "string"
            ? req.body.rating
            : "",

        comment: typeof req.body.comment === "string"
            ? req.body.comment.trim()
            : ""
    };

    let restaurant;
    let reviews;

    // Función para volver al formulario mostrando el error
    const renderError = (status, error) => {
        return res.status(status).render("restaurant/show", {
            restaurant,
            reviews,
            formData,
            error
        });
    };

    try {

        // 1. Comprobar que la ID del restaurante es válida
        if (
            !Number.isSafeInteger(id_restaurant) ||
            id_restaurant <= 0
        ) {
            return res.status(400).send(
                "El restaurante seleccionado no es válido"
            );
        }

        // 2. Buscar el restaurante
        restaurant = await restaurantRepository.getById(id_restaurant);

        if (!restaurant) {
            return res.status(404).send(
                "Restaurante no encontrado"
            );
        }

        // 3. Recuperar sus reseñas para poder volver a mostrar la página
        reviews = await reviewRepository.getByRestaurantId(id_restaurant);

        // 4. Comprobar campos obligatorios
        if (
            !formData.title ||
            !formData.rating.trim() ||
            !formData.comment
        ) {
            return renderError(
                400,
                "El título, la puntuación y el comentario son obligatorios."
            );
        }

        // 5. Comprobar longitud del título
        if (formData.title.length > 100) {
            return renderError(
                400,
                "El título no puede superar los 100 caracteres."
            );
        }

        // 6. Comprobar longitud del comentario
        if (formData.comment.length > 300) {
            return renderError(
                400,
                "El comentario no puede superar los 300 caracteres."
            );
        }

        // 7. Comprobar que la puntuación sea válida
        const rating = Number(formData.rating);

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return renderError(
                400,
                "La puntuación debe ser un número entero entre 1 y 5."
            );
        }

        // 8. Crear la reseña
        await reviewRepository.create({
            id_user: req.session.user.id_user,
            id_restaurant,
            title: formData.title,
            rating,
            comment: formData.comment
        });

        // 9. Volver al restaurante
        return res.redirect(`/restaurant/${id_restaurant}`);

    } catch (error) {

        console.error("Error al crear la reseña:", error);

        // Si no conseguimos cargar los datos del restaurante,
        // no podemos volver a mostrar su ficha.
        if (!restaurant || !reviews) {
            return res.status(500).send(
                "Error al cargar el restaurante"
            );
        }

        // Título duplicado
        if (
            error.name === "UniqueConstraintError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            return renderError(
                409,
                "Ya existe una reseña con ese título."
            );
        }

        // Otros errores de validación
        if (error.status === 400) {
            return renderError(
                400,
                error.message
            );
        }

        // Errores inesperados
        return renderError(
            500,
            "No se ha podido guardar la reseña. Inténtalo de nuevo."
        );
    }
};

const createForm = (req, res) => {
    res.render("review/create");
}

const getAll = async (req, res) => {
    try {
        const reviews = await reviewRepository.getAll();

        return res.render("review/list", {
            reviews,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener las reseñas:", error);

        return res.status(error.status || 500).render("review/list", {
            reviews: [],
            error: "No se ha podido cargar el listado de reseñas."
        });
    }
};

const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Comprobar que la ID es válida
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).render("review/show", {
                review: null,
                error: "El identificador de la reseña no es válido."
            });
        }

        const review = await reviewRepository.getById(id);

        // Comprobar que existe
        if (!review) {
            return res.status(404).render("review/show", {
                review: null,
                error: "La reseña que buscas no existe."
            });
        }

        return res.render("review/show", {
            review,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener la reseña:", error);

        return res.status(error.status || 500).render("review/show", {
            review: null,
            error: "No se ha podido cargar la reseña."
        });
    }
};

const update = async (req, res) => {

    const id = Number(req.params.id);

    // Guardamos los datos enviados para conservarlos si ocurre un error
    const formData = {
        id_reviews: id,

        title: typeof req.body.title === "string"
            ? req.body.title.trim()
            : "",

        rating: typeof req.body.rating === "string"
            ? req.body.rating.trim()
            : "",

        comment: typeof req.body.comment === "string"
            ? req.body.comment.trim()
            : ""
    };

    // Volver al formulario mostrando el error correspondiente
    const renderError = (status, message) => {
        return res.status(status).render("review/update", {
            review: formData,
            error: message
        });
    };

    try {

        // Comprobar que la reseña existe
        const existingReview = await reviewRepository.getById(id);

        if (!existingReview) {
            return res.status(404).render("review/show", {
                review: null,
                error: "La reseña que intentas modificar no existe."
            });
        }

        // Comprobar campos obligatorios
        if (
            !formData.title ||
            !formData.rating ||
            !formData.comment
        ) {
            return renderError(
                400,
                "El título, la puntuación y el comentario son obligatorios."
            );
        }

        // Comprobar longitud del título
        if (formData.title.length > 100) {
            return renderError(
                400,
                "El título no puede superar los 100 caracteres."
            );
        }

        // Comprobar longitud del comentario
        if (formData.comment.length > 300) {
            return renderError(
                400,
                "El comentario no puede superar los 300 caracteres."
            );
        }

        // Validar la puntuación
        const rating = Number(formData.rating);

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return renderError(
                400,
                "La puntuación debe ser un número entero entre 1 y 5."
            );
        }

        // Actualizar la reseña
        const review = await reviewRepository.update(id, {
            title: formData.title,
            rating,
            comment: formData.comment
        });

        if (!review) {
            return res.status(404).render("review/show", {
                review: null,
                error: "La reseña ya no existe."
            });
        }

        // Volver al restaurante
        return res.redirect(`/restaurant/${review.id_restaurant}`);

    } catch (error) {
        console.error("Error al actualizar la reseña:", error);

        // Comprobar si existe un título duplicado
        if (
            error.name === "UniqueConstraintError" ||
            error.name === "SequelizeUniqueConstraintError"
        ) {
            return renderError(
                409,
                "Ya existe una reseña con ese título."
            );
        }

        // Errores de validación
        if (
            error.name === "ValidationError" ||
            error.name === "SequelizeValidationError"
        ) {
            return renderError(
                400,
                "Los datos introducidos no son válidos."
            );
        }

        // Error inesperado
        return renderError(
            500,
            "No se ha podido actualizar la reseña. Inténtalo de nuevo."
        );
    }
};

const updateForm = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const review = await reviewRepository.getById(id);

        if (!review) {
            return res.status(404).render("review/show", {
                review: null,
                error: "No se ha encontrado la reseña que quieres editar."
            });
        }

        return res.render("review/update", {
            review,
            error: null
        });

    } catch (error) {
        console.error("Error al cargar el formulario:", error);

        return res.status(error.status || 500).render("review/show", {
            review: null,
            error: "No se ha podido cargar el formulario de edición."
        });
    }
};

const remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Comprobar la ID
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).render("review/show", {
                review: null,
                error: "El identificador de la reseña no es válido."
            });
        }

        // Eliminar la reseña
        const review = await reviewRepository.remove(id);

        // Comprobar si existía
        if (!review) {
            return res.status(404).render("review/show", {
                review: null,
                error: "No se ha encontrado la reseña que quieres eliminar."
            });
        }

        // Volver al restaurante con un mensaje de confirmación
        return res.redirect(
            `/restaurant/${review.id_restaurant}?message=Reseña+eliminada+correctamente`
        );

    } catch (error) {
        console.error("Error al eliminar la reseña:", error);

        return res.status(error.status || 500).render("review/show", {
            review: null,
            error: "No se ha podido eliminar la reseña."
        });
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