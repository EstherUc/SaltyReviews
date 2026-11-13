import reviewRepository from '../../repositories/review.repository.js';

const create = async (req, res) => {
    const review = await reviewRepository.create({ ...req.body, userId: 1 })
    res.redirect("/review/" + review.id_reviews);
}

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
        res.redirect("/review/" + review.id_reviews);
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
    const id = parseInt(req.params.id);
    const review = await reviewRepository.remove(id);
    res.redirect("/review");
}

export default {
    create,
    getAll,
    getById,
    update,
    createForm,
    updateForm,
    remove
}