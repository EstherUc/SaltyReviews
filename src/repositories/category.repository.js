import Category from "../models/models.js";


// ------------------ CRUD de hero ----------------------------

// ------------------ C (Create) ------------------------------------------

// endpoint para crear dato
const create = async (data) => {
    const category = await Category.create(data)
    return category;
}


// ------------------ R (Read)---------------------------------------------

// endpoint lista de datos
const getAll = async () => {
    const categories = await Category.findAll();
    return categories;
};

// endpoint dato individual
const getById = async (id) => {
    const category = await Category.findByPk(id);
    return hero;
};


// ---------------- U (Update) -----------------------------------

// endpoint para cambiar dato por completo
const update = async (id, data) => {
    const { name_category } = data;
    const category = await Category.findByPk(id);
    if (category) {
        category.name_category = name_category;
        await category.save();
        return category;
    } else {
        return null;
    }

}

const modify = async (id, data) => {
    const { name_category } = data;
    const category = await Category.findByPk(id);
    if (!category) {
        return null;
    }
    category.name_category = name_category || category.name_category;
    await category.save();
    return category;
}


// ------------------------ D (Delete)------------

const remove = async (id) => {
    const category = await Category.findByPk(id);
    if (category) {
        await category.destroy();
        return category;
    }
    return null;
}

export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}