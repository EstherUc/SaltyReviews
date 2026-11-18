import Category from "../models/category.model.js";
import { throwError, NotFoundError } from "../utils/errors.js";
import { fn, col, where, Op } from "sequelize";


// ------------------ CRUD de categorías ----------------------------

// ------------------ C (Create) ------------------------------------------


/**
 * Crea una nueva categoría en la base de datos.
 *
 * Utiliza el método create de Sequelize para insertar
 * un nuevo registro en el modelo Category.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {Object} data - Datos de la categoría que se quiere crear.
 * @returns {Promise<Category>} Categoría creada.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */

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

/**
 * Obtiene todas las categorías registradas en la base de datos.
 *
 * Utiliza el método findAll de Sequelize para recuperar
 * todos los registros del modelo Category.
 *
 * @async
 * @returns {Promise<Category[]>} Lista de categorías registradas.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getAll = async () => {

    try {

        const categories = await Category.findAll();
        return categories;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

/**
 * Obtiene una categoría mediante su identificador.
 *
 * Busca la categoría utilizando su clave primaria
 * mediante el método findByPk de Sequelize.
 *
 * Si la categoría no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la categoría.
 * @returns {Promise<Category|null>} Categoría encontrada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getById = async (id) => {

    try {

        const category = await Category.findByPk(id);
        return category;

    } catch (error) {
        console.error(error);
        throwError(error);
    }
};

/**
 * Busca una categoría mediante su nombre.
 *
 * Primero comprueba que el nombre recibido sea una cadena
 * de texto que no esté vacía.
 *
 * Elimina los espacios al principio y al final del nombre
 * y lo convierte a minúsculas.
 *
 * Utiliza las funciones LOWER y where de Sequelize
 * para realizar una búsqueda sin distinguir
 * entre mayúsculas y minúsculas.
 *
 * Si el nombre no es válido o no se encuentra
 * ninguna categoría, devuelve null.
 *
 * Si ocurre un error durante la consulta,
 * lo registra y vuelve a lanzarlo.
 *
 * @async
 * @param {string} name_category - Nombre de la categoría que se quiere buscar.
 * @returns {Promise<Category|null>} Categoría encontrada o null si no existe.
 * @throws {Error} Error producido durante la consulta.
 */
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


/**
 * Actualiza completamente los datos de una categoría existente.
 *
 * Busca la categoría mediante su identificador
 * y actualiza su nombre utilizando el valor recibido.
 *
 * Guarda los cambios mediante el método save de Sequelize.
 * Si la categoría no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la categoría que se quiere actualizar.
 * @param {Object} data - Datos para actualizar la categoría.
 * @param {string} data.name_category - Nuevo nombre de la categoría.
 * @returns {Promise<Category|null>} Categoría actualizada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
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

/**
 * Modifica parcialmente los datos de una categoría existente.
 *
 * Busca la categoría mediante su identificador.
 *
 * Si se proporciona un nuevo nombre con un valor válido,
 * actualiza el campo name_category.
 *
 * Si no se proporciona un nombre o su valor es falsy,
 * conserva el nombre anterior.
 *
 * Guarda los cambios mediante el método save de Sequelize.
 * Si la categoría no existe, devuelve null.
 *
 * @async
 * @param {number} id - Identificador de la categoría que se quiere modificar.
 * @param {Object} data - Datos que se quieren modificar.
 * @param {string} [data.name_category] - Nuevo nombre de la categoría.
 * @returns {Promise<Category|null>} Categoría modificada o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */

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
/**
 * Elimina una categoría de la base de datos.
 *
 * Busca la categoría mediante su identificador
 * y elimina su registro utilizando destroy de Sequelize.
 *
 * Si la categoría no existe, lanza un NotFoundError.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador de la categoría que se quiere eliminar.
 * @returns {Promise<Category>} Categoría eliminada.
 * @throws {NotFoundError} Si la categoría no existe.
 * @throws {Error} Error procesado mediante throwError si falla la eliminación.
 */
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