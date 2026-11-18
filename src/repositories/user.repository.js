import { User, Favorite, Review, Restaurant } from "../models/models.js";
import { Op } from "sequelize";
import { throwError, NotFoundError } from "../utils/errors.js";

// ------------------ CRUD de usuarios ------------------


// ------------------ C (Create) ------------------

/**
 * Crea un nuevo usuario en la base de datos.
 *
 * Utiliza el método create de Sequelize para insertar
 * un nuevo registro en el modelo User.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {Object} data - Datos del usuario que se quiere crear.
 * @returns {Promise<User>} Usuario creado.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const create = async (data) => {

    try {

        const user = await User.create(data);
        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};



// ------------------ R (Read) ------------------
/**
 * Obtiene todos los usuarios registrados en la base de datos.
 *
 * Utiliza el método findAll de Sequelize para recuperar
 * todos los registros del modelo User.
 *
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @returns {Promise<User[]>} Lista de usuarios registrados.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getAll = async () => {

    try {

        const users = await User.findAll();
        return users;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};

/**
 * Obtiene un usuario mediante su identificador.
 *
 * Busca el usuario utilizando su clave primaria
 * e incluye sus restaurantes favoritos y las reseñas
 * que ha publicado.
 *
 * De cada restaurante favorito recupera su identificador,
 * nombre y dirección.
 *
 * De cada reseña recupera su identificador, título,
 * puntuación y comentario.
 *
 * Si el usuario no existe, lanza un NotFoundError.
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador del usuario.
 * @returns {Promise<User>} Usuario encontrado con sus favoritos y reseñas.
 * @throws {NotFoundError} Si el usuario no existe.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getById = async (id) => {

    try {

        const user = await User.findByPk(id, {
            include: [
                {
                    model: Favorite,
                    as: "favorites",

                    // Recuperamos también los restaurantes
                    include: [
                        {
                            model: Restaurant,
                            as: "restaurant",
                            attributes: [
                                "id_restaurant",
                                "name_restaurant",
                                "address"
                            ]
                        }
                    ]
                },


                {
                    model: Review,
                    as: "reviews",
                    attributes: ["id_reviews", "title", "rating", "comment"]
                }]
        });

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


/**
 * Busca un usuario mediante su dirección de correo electrónico.
 *
 * Si se proporciona un identificador, busca usuarios
 * con ese correo electrónico excluyendo al usuario
 * cuyo ID coincida con el indicado.
 *
 * Si no se proporciona un identificador, busca cualquier
 * usuario registrado con ese correo electrónico.
 *
 * Utiliza el operador Op.ne de Sequelize para excluir
 * un identificador concreto de la búsqueda.
 *
 * Si no encuentra ningún usuario, devuelve null.
 *
 * @async
 * @param {string} email - Dirección de correo electrónico que se quiere buscar.
 * @param {number|null} [id=null] - Identificador del usuario que se excluye de la búsqueda.
 * @returns {Promise<User|null>} Usuario encontrado o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const findEmail = async (email, id = null) => {

    try {

        let existEmail = null;

        //si recibimos id miramos emails de otros usuarios  
        if (id !== null) {

            existEmail = await User.findOne({
                where: {
                    email: email,
                    id_user: {
                        [Op.ne]: id  //no miramos ese id (usario) en la busqueda (ne = not equal, distinto)
                    }
                }
            });

        } else {

            //si no recibimos id (buscamos en todos los usuarios)
            existEmail = await User.findOne({
                where: {
                    email: email
                }
            });

        }

        return existEmail;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

}

/**
 * Busca un usuario mediante su nombre de usuario.
 *
 * Utiliza el método findOne de Sequelize para localizar
 * un registro cuyo campo username coincida con
 * el nombre proporcionado.
 *
 * Si no encuentra ningún usuario, devuelve null.
 *
 * @async
 * @param {string} username - Nombre de usuario que se quiere buscar.
 * @returns {Promise<User|null>} Usuario encontrado o null si no existe.
 * @throws {Error} Error procesado mediante throwError si falla la consulta.
 */
const getByUsername = async (username) => {

    try {

        const user = await User.findOne({
            where: {
                username: username
            }
        });

        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};


// ------------------ U (Update) ------------------


/**
 * Actualiza los datos de un usuario existente.
 *
 * Busca el usuario mediante su identificador
 * y actualiza su nombre de usuario y correo electrónico.
 *
 * La contraseña únicamente se modifica si se proporciona
 * un nuevo valor para password_hash.
 *
 * Guarda los cambios mediante el método save de Sequelize.
 *
 * Si el usuario no existe, lanza un NotFoundError.
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador del usuario que se quiere actualizar.
 * @param {Object} data - Datos para actualizar el usuario.
 * @param {string} data.username - Nuevo nombre de usuario.
 * @param {string} data.email - Nueva dirección de correo electrónico.
 * @param {string} [data.password_hash] - Nuevo hash de contraseña, si se proporciona.
 * @returns {Promise<User>} Usuario actualizado.
 * @throws {NotFoundError} Si el usuario no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const update = async (id, data) => {

    try {

        const { username, email, password_hash } = data;

        const user = await User.findByPk(id);

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }


        user.username = username;
        user.email = email;

        //cambiar contraseña solo si viene una nueva
        if (password_hash !== undefined) {

            user.password_hash = password_hash;
        }

        await user.save();
        return user;


    } catch (error) {
        console.error(error);
        throwError(error);
    }

};



/**
 * Modifica parcialmente los datos de un usuario existente.
 *
 * Busca el usuario mediante su identificador.
 *
 * Actualiza el nombre de usuario y el correo electrónico
 * cuando se proporcionan valores truthy, manteniendo
 * los valores anteriores en caso contrario.
 *
 * La contraseña únicamente se modifica si se proporciona
 * un valor diferente de undefined para password_hash.
 *
 * Guarda los cambios mediante el método save de Sequelize.
 *
 * Si el usuario no existe, lanza un NotFoundError.
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador del usuario que se quiere modificar.
 * @param {Object} data - Datos que se quieren modificar.
 * @param {string} [data.username] - Nuevo nombre de usuario.
 * @param {string} [data.email] - Nueva dirección de correo electrónico.
 * @param {string} [data.password_hash] - Nuevo hash de contraseña, si se proporciona.
 * @returns {Promise<User>} Usuario modificado.
 * @throws {NotFoundError} Si el usuario no existe.
 * @throws {Error} Error procesado mediante throwError si falla la operación.
 */
const modify = async (id, data) => {

    try {

        const { username, email, password_hash } = data;

        const user = await User.findByPk(id);

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        user.username = username || user.username;
        user.email = email || user.email;

        //cambiar contraseña solo si viene una nueva
        if (password_hash !== undefined) {

            user.password_hash = password_hash;
        }

        await user.save();
        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};



// ------------------ D (Delete) ------------------

/**
 * Elimina un usuario de la base de datos.
 *
 * Busca el usuario mediante su identificador
 * y elimina su registro utilizando destroy de Sequelize.
 *
 * Si el usuario no existe, lanza un NotFoundError.
 * Si ocurre un error, lo procesa mediante throwError.
 *
 * @async
 * @param {number} id - Identificador del usuario que se quiere eliminar.
 * @returns {Promise<User>} Usuario eliminado.
 * @throws {NotFoundError} Si el usuario no existe.
 * @throws {Error} Error procesado mediante throwError si falla la eliminación.
 */
const remove = async (id) => {

    try {

        const user = await User.findByPk(id);

        if (!user) {
            throw new NotFoundError("Usuario no encontrado");
        }

        await user.destroy();
        return user;

    } catch (error) {
        console.error(error);
        throwError(error);
    }

};




export default {
    create,
    getAll,
    getById,
    findEmail,
    getByUsername,
    update,
    modify,
    remove
}