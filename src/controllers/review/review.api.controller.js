import reviewRepository from '../../repositories/review.repository.js';

const create = async (req, res) => {
    const review = await reviewRepository.create({ ...req.body, id_user: 1, id_restaurant: 1 })
    res.json({ data: review })
}

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