import categoriesRepo from '../../repositories/category.repository.js';


// ------------------ CRUD de category ----------------------------

// ------------------ C (Create) -----------------------------------

const create = (req, res) => {
    const id = categoriesRepo[categoriesRepo.length - 1].id + 1
    const { id_category, name_category } = req.body;
    const category = {
        id_category,
        name_category
    }
    reviews.push(category)
    res.redirect("/category/" + id)
}

const createForm = (req, res) => {
    const categoryId = 1 // después vendrá del middleware
    res.render("category/create", { category_id: categoryId });
}


// ------------------ R (Read)---------------------------------------------

const getAll = async(req, res) => {
    const categories = await categoriesRepo.getAll();
    res.render("category/list", { categories })
};

const getById = (req, res) => {
    const id = parseInt(req.params.id);
    const caterogy = categoriesRepo.find(u => u.id === id)
    res.render("category/show", { category })
};


// ---------------- U (Update) -------------------------------------------
// endpoint para cambiar dato por completo

const update = (req, res) => {
    const { id_category, name_category } = req.body;
    const id = req.params.id;
    const category = categoriesRepo.find(u => u.id === id)
    category.id_category = id_category;
    category.name_category = name_category;
    res.redirect("/category/" + category.id);
}

const updateForm = (req, res) => {
    const id = req.params.id;
    const category = categoriesRepo.find(u => u.id === id)
    res.render("category/update", { category })
}


// ------------------------ D (Delete)----------------------------------

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    const index = categoriesRepo.findIndex(u => u.id === id);
    let category;
    if (index > -1) {
        category = categoriesRepo.splice(index, 1);
    }
    res.redirect("/category");
}

export default {
    create,
    createForm,
    getAll,
    getById,
    update,
    updateForm,
    remove
}
