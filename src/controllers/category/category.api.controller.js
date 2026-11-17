import categoriesRepo from '../../repositories/category.repository.js';


// ------------------ CRUD de category ----------------------------

// ------------------ C (Create) -----------------------------------

const create = async (req, res) => {
    const existCat = await categoriesRepo.findName(req.name_category); //comprobamos si el email ya está registrado

    if (existCat) {
        return res.status(409).send("Ya existe una categoria con ese nombre"); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }
    const category = await categoriesRepo.create({
        name_category
    });

    res.status(201).json({  // HTTP 201 - Created - éxito en la creación de un nuevo recurso
        data: category
    });
}


// ------------------ R (Read)---------------------------------------------

const getAll = async (req, res) => {

    const categories = await categoriesRepo.getAll();
    res.json({ data: categories })
};

const getById = async (req, res) => {

    const id = parseInt(req.params.id);
    const category = categoriesRepo.getById(id)

    if (!category) {
        return res.status(404).send("Categoria no encontrada");
    }
    res.json({ data: category })
};


// ---------------- U (Update) -------------------------------------------
// endpoint para cambiar dato por completo

const update = async (req, res) => {
    const id = parseInt(req.params.id);
    const category = categoriesRepo.getById(id)

    if (!category) {
        return res.status(404).send("Categoria no encontrada");
    }

    const { name_category } = req.body; //recogemos los nuevos datos

    const existCategory = await categoriesRepo.findName(name_category);

    if (existCategory) {
        return res.status(409).send("La categoria ya existe"); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    let catUpdate;
    catUpdate = await categoriesRepo.update(id, category);

    const { id_category } = catUpdate;
    res.json({
        data: {
            id_category,
            name_category: catUpdate.name_category
        }
    });
}

const modify = async (req, res) => {
    const id = parseInt(req.params.id);
    const category = categoriesRepo.getById(id)

    if (!category) {
        return res.status(404).send("Categoria no encontrada");
    }

    const { name_category } = req.body; //recogemos los nuevos datos

    const existCategory = await categoriesRepo.findName(name_category, id);

    if (existCategory) {
        return res.status(409).send("La categoria ya existe"); // HTTP 409 - Conflicto - Intento de crear un recurso duplicado    
    }

    let catUpdate;
    catUpdate = await categoriesRepo.update(id, category);

    const { id_category } = catUpdate;
    res.json({
        data: {
            id_category,
            name_category: catUpdate.name_category
        }
    });
}


// ------------------------ D (Delete)----------------------------------

const remove = async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await categoriesRepo.remove(id); //eliminamos
    if (!category) {
        return res.status(404).send("Categoria no encontrada");
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
