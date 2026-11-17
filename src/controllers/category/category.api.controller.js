import { categoriesRepo } from '../../repositories/category.repository.js';


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
    res.json({ data: category })
}


// ------------------ R (Read)---------------------------------------------

const getAll = async (req, res) => {

    const categories = await categoriesRepo.getAll();
    res.json({ data: categories })
};

const getById = (req, res) => {
    const id = parseInt(req.params.id);
    const category = categoriesRepo.find(u => u.id === id)
    res.json({ data: category })
};


// ---------------- U (Update) -------------------------------------------
// endpoint para cambiar dato por completo

const update = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await categoriesRepo.update(id, req.body);
    res.json({ data: user });
}

const modify = (req, res) => {
    const { id_category, name_category } = req.body;
    const id = req.params.id;
    const category = categoriesRepo.find(u => u.id === id)

    category.id_category = id_category;
    category.name_category = name_category
    res.json({ data: category });
}


// ------------------------ D (Delete)----------------------------------

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    const index = categoriesRepo.findIndex(u => u.id === id);
    let category;
    if (index > -1) {
        category = categoriesRepo.splice(index, 1);
    }
    res.json({ data: category });
}

export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}
