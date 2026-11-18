import categoriesRepo from '../../repositories/category.repository.js';


// ------------------ CRUD de category ----------------------------

// ------------------ C (Create) -----------------------------------

const createForm = (req, res) => {
    res.render("category/create");
}

const create = async (req, res) => {

    try {

        const { name_category } = req.body;
        const formData = name_category;

        const normalizedName = name_category.trim().toLowerCase();

        const existCat = await categoriesRepo.findName(normalizedName); //comprobamos si la categoria ya está registrada

        if (existCat) {
            return res.status(400).render("category/create", { category: formData, error: "Ya existe una categoría con ese nombre" });
        }
        const category = await categoriesRepo.create({
            name_category
        });
        res.redirect("/category/" + category.id_category)

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("category/create", { category: FormData, error: error.message });
    }
}



// ------------------ R (Read)---------------------------------------------

const getAll = async (req, res) => {

    try {

        const categories = await categoriesRepo.getAll();
        res.render("category/list", { categories })

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("category/list", { categories: [], error: error.message });
    }
};

const getById = async (req, res) => {

    try {

        const id = parseInt(req.params.id);
        const category = await categoriesRepo.getById(id)

        if (!category) {
            return res.status(404).send("Categoria no encontrada");
        }

        res.render("category/show", { category })

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("category/show", { category: null, error: error.message });
    }
};


// ---------------- U (Update) -------------------------------------------
// endpoint para cambiar dato por completo

const update = async (req, res) => {

    const id = parseInt(req.params.id);
    const category = await categoriesRepo.getById(id)

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

const updateForm = async (req, res) => {

    try {

        const id = req.params.id;
        const category = await categoriesRepo.getById(id)

        if (!category) {
            return res.status(404).send("Categoria no encontrada");
        }

        res.render("category/update", { category })

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("category/show", { category: null, error: error.message });
    }
}


// ------------------------ D (Delete)----------------------------------

const remove = async (req, res) => {

    try {

        const id = parseInt(req.params.id);
        const category = await categoriesRepo.remove(id); //eliminamos

        //si existe categoria es que lo ha borrado y existía en bd
        if (!category) {
            return res.status(404).render("Categoria no encontrada");
        }

        res.redirect("/category");

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).render("category/categoryCard", { category: null, error: error.message });
    }
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
