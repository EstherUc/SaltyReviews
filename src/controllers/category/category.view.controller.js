import categoriesRepo from '../../repositories/category.repository.js';


// ------------------ CRUD de category ----------------------------

// ------------------ C (Create) -----------------------------------

const createForm = (req, res) => {
    res.render("category/create");
}

const create = async (req, res) => {

    const existCat = await categoriesRepo.findName(req.name_category); //comprobamos si el email ya está registrado

    if (existCat) {
        return res.status(409).send("Ya existe una categoria con ese nombre"); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    const category = await categoriesRepo.create({
        name_category
    });
    res.redirect("/category/" + category.id_category)
}



// ------------------ R (Read)---------------------------------------------

const getAll = async (req, res) => {
    const categories = await categoriesRepo.getAll();
    res.render("category/list", { categories })
};

const getById = (req, res) => {
    const id = parseInt(req.params.id);
    const category = categoriesRepo.getById(id)

    if (!category) {
        return res.status(404).send("Categoria no encontrada");
    }

    res.render("category/show", { category })
};


// ---------------- U (Update) -------------------------------------------
// endpoint para cambiar dato por completo

const update = async (req, res) => {

    const id = parseInt(req.params.id);
    const category = categoriesRepo.getById(id)

    if (!category) {
        return res.status(404).send("Categoria no encontrada");
    }

    const existCategory = await categoriesRepo.findName(name_category);

    if (existCategory) {
        return res.status(409).send("La categoria ya existe"); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    let catUpdate;
    catUpdate = await categoriesRepo.update(id, category);

    if (catUpdate) {
        res.redirect("/category/" + catUpdate.id_category);
    } else {
        res.redirect("/category");
    }
}

const updateForm = (req, res) => {
    const id = req.params.id;
    const category = categoriesRepo.getById(id)

    if (!category) {
        return res.status(404).send("Categoria no encontrada");
    }

    res.render("category/update", { category })
}


// ------------------------ D (Delete)----------------------------------

const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await categoriesRepo.remove(id); //eliminamos

    //si existe usuario es que lo ha borrado y existía en bd
    if (!category) {
        return res.status(404).send("Categoria no encontrada");
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
