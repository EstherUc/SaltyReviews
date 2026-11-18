import Category from "../models/category.model.js";
import { throwError, NotFoundError } from "../utils/errors.js";
import { fn, col, where, Op } from "sequelize";


// ------------------ CRUD de hero ----------------------------

// ------------------ C (Create) ------------------------------------------

// endpoint para crear dato
const create = async (data) => {

    try {

        const category = await Category.create(data)
        return category;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
}


// ------------------ R (Read)---------------------------------------------

// endpoint lista de datos
const getAll = async () => {

    try {

        const categories = await Category.findAll();
        return categories;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

// endpoint dato individual
const getById = async (id) => {

    try {

        const category = await Category.findByPk(id);
        return category;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

//buscar por nombre
const findName = async (name_category) => {
    try {
        if (typeof name_category !== "string" || !name_category.trim()) {
            return null;
        }

        const normalizedName = name_category.trim().toLowerCase();

        const existName = await Category.findOne({
            where: where(
                fn("LOWER", col("name_category")),
                normalizedName
            )
        });

        return existName;

    } catch (error) {
        console.error("Error en findName:", error);
        throw error;
    }
};



// ---------------- U (Update) -----------------------------------

// endpoint para cambiar dato por completo
const update = async (id, data) => {

    try {

        const { name_category } = data;
        const category = await Category.findByPk(id);
        if (category) {
            category.name_category = name_category;
            await category.save();
            return category;
        } else {
            return null;
        }

    } catch (error) {
        console.error(error);
        throwError(error);
    }

}

const modify = async (id, data) => {

    try {

        const { name_category } = data;
        const category = await Category.findByPk(id);
        if (!category) {
            return null;
        }
        category.name_category = name_category || category.name_category;
        await category.save();
        return category;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
}


// ------------------------ D (Delete)------------

const remove = async (id) => {

    try {

        const category = await Category.findByPk(id);

        if (!category) {
            throw new NotFoundError("Categoria no encontrada");
        }

        await category.destroy();
        return category;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
}

export default {
    create,
    getAll,
    getById,
    findName,
    update,
    modify,
    remove
}