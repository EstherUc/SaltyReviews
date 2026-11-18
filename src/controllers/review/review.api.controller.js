import reviewRepository from '../../repositories/review.repository.js';

const create = async (req, res) => {
    try {

        // 1. Comprobar que el usuario ha iniciado sesión
        if (!req.session?.user) {
            return res.status(401).json({
                error: "Debes iniciar sesión para crear una reseña"
            });
        }

        // 2. Recuperar los datos
        const id_user = req.session.user.id_user;
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
            return res.status(400).json({
                error: "Los datos de la reseña no son válidos"
            });
        }

        // 4. Crear la reseña
        const review = await reviewRepository.create({
            id_user,
            id_restaurant,
            title,
            rating,
            comment
        });

        // 5. Devolver la reseña creada
        return res.status(201).json({
            data: review
        });

    } catch (error) {

        console.error("Error creando reseña:", error);

        return res.status(500).json({
            error: "Error al crear la reseña"
        });
    }
};

const getAll = async (req, res) => {
    const reviews = await reviewRepository.getAll();
    res.json({ data: reviews })
};

const getById = async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await reviewRepository.getById(id);
    res.json({ data: review })
};

const update = async (req, res) => {
    const id = req.params.id;
    const review = await reviewRepository.update(id, req.body);
    res.json({ data: review })
}

const modify = async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await reviewRepository.modify(id, req.body);
    res.json({ data: review });
}

const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const review = await reviewRepository.remove(id);
    res.json({ data: review });
}

export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}