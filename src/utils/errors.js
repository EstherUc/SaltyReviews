/**
 * Clase base para representar errores con un código de estado HTTP.
 * 
 * @class
 * @extends Error
 */

class ErrorWithStatus extends Error {

        /**
     * Crea un error con un mensaje y un código de estado HTTP.
     * 
     * @param {string} message - Descripción del error.
     * @param {number} status - Código de estado HTTP asociado al error.
     */
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}


/**
 * Representa un error interno del servidor.
 *
 * @class
 * @extends ErrorWithStatus
 */

class GenericError extends ErrorWithStatus {
    /**
     * @param {string} [message="Ha ocurrido un error de servidor"] - Mensaje del error.
     */
    constructor(message="Ha ocurrido un error de servidor"){
        super(message,500);
        this.name = "GenericError"
    }
}

// --------------------------- errores de unicidad


/**
 * Representa un error producido por la duplicación de un valor
 * que debe ser único en la base de datos.
 *
 * @class
 * @extends ErrorWithStatus
 */
class UniqueConstraintError extends ErrorWithStatus {

    /**
     * @param {string} [message="Ya existe un registro con estos valores"] - Mensaje del error.
     */
    constructor(message = "Ya existe un registro con estos valores"){
        super(message);
        this.status = 409;
        this.name="UniqueConstraintError";
    }
}
/**
 * Representa un error cuando se intenta registrar un email
 * que ya existe en la base de datos.
 *
 * @class
 * @extends UniqueConstraintError
 */
class UniqueEmailError extends UniqueConstraintError {

    /**
     * @param {string} email - Email que ya está registrado.
     */
    constructor(email) {

        super(`Ya existe un usuario con el email ${email}`);
        this.name = "UniqueEmailError";
    }
}

/**
 * Representa un error cuando se intenta registrar un nombre
 * de usuario que ya existe en la base de datos.
 *
 * @class
 * @extends UniqueConstraintError
 */

class UniqueUsernameError extends UniqueConstraintError {

    /**
     * @param {string} username - Nombre de usuario que ya está registrado.
     */
    constructor(username) {
        super(`Ya existe un usuario con el username ${username}`);
        this.name = "UniqueUsernameError";
    }
}

// --------------- errores de validación



/**
 * Representa un error producido cuando los datos recibidos
 * no cumplen las reglas de validación.
 *
 * @class
 * @extends ErrorWithStatus
 */


class ValidationError extends ErrorWithStatus {

    /**
     * @param {string} [message="Error de validación de datos"] - Mensaje del error.
     */


    constructor(message="Error de validación de datos"){
        super(message,400);
        this.name="ValidationError";
    }
}

// ---------------- errores de no encontrado
/**
 * Representa un error cuando no se encuentra el recurso solicitado.
 *
 * @class
 * @extends ErrorWithStatus
 */
class NotFoundError extends ErrorWithStatus {

    /**
     * @param {string} [message="Recurso no encontrado"] - Mensaje del error.
     */
    constructor(message="Recurso no encontrado"){
        super(message,404);
        this.name="NotFoundError";
    }
}

/**
 * Representa un error relacionado con las restricciones
 * de claves foráneas de la base de datos.
 *
 * @class
 * @extends ErrorWithStatus
 */
class ForeignKeyConstraintError extends ErrorWithStatus {
/**
     * @param {string} [message="No se puede realizar la operación porque existen registros relacionados"] - Mensaje del error.
     */

    constructor(message = "No se puede realizar la operación porque existen registros relacionados") {
        super(message, 409); 
        this.name = "ForeignKeyConstraintError";
    }
}


// --------------------------- FAMILIAS DE ERRORES ---------------------------

/**
 * Relaciona los errores de Sequelize con las clases de errores
 * personalizadas de la aplicación.
 *
 * Permite identificar el tipo de error recibido y seleccionar
 * la clase correspondiente.
 *
 * @type {Object<string, Object<string, Function>>}
 */

const errorFamilies = {
    SequelizeUniqueConstraintError: { // valores que no se pueden repetir
        default: UniqueConstraintError,
        username: UniqueUsernameError,
        email: UniqueEmailError
    },
    SequelizeValidationError:{ // validación incorrecta
        default: ValidationError
    },
    SequelizeForeignKeyConstraintError: { // clave foranea que no apunta correctamente
        default: ForeignKeyConstraintError
    },
    SequelizeDatabaseError:{ // error de base de datos
        default: GenericError
    },


}


// --------------------------- LANZAMIENTO DE ERRORES 

/**
 * Identifica un error y lo transforma en una excepción personalizada.
 *
 * Si el error ya pertenece a ErrorWithStatus, se vuelve a lanzar.
 * Si es un error reconocido de Sequelize, se selecciona la clase
 * correspondiente mediante errorFamilies.
 * Si no se reconoce, se lanza un GenericError.
 *
 * @param {Error} error - Error original que se quiere procesar.
 * @returns {never} Esta función siempre lanza una excepción.
 * @throws {ErrorWithStatus} Error personalizado asociado al problema detectado.
 */

const throwError = (error) =>{
    if(error instanceof ErrorWithStatus){
        throw error;
    }
    if(error.name in errorFamilies){
        const family =  errorFamilies[error.name];
        const path = error.errors && error.errors[0].path;
        const value = error.errors && error.errors[0].value;
        if(path in family){
            const ErrorType = family[path];
            throw new ErrorType(value);
        }else{
            const ErrorType = family["default"];
            throw new ErrorType(value)
        }
    }else{
        throw new GenericError();
    }
}
// --------------------------- MENSAJES DE ERROR ---------------------------

/**
 * Obtiene un mensaje descriptivo y comprensible a partir
 * de un error producido por Sequelize.
 *
 * Se utiliza para mostrar información de error en formularios
 * o devolver mensajes en las respuestas de la API.
 *
 * @param {Error} error - Error recibido durante una operación.
 * @returns {string} Mensaje descriptivo del error.
 */
const getErrorMessage = (error) => {
    switch (error.name) {
        // un campo "unique" repetido (nombre de héroe, email...)
        case "SequelizeUniqueConstraintError":
            return "Ya existe un registro con ese valor de " + Object.keys(error.fields).join(", ");
        // falla alguna validación del modelo (allowNull, min, max...)
        case "SequelizeValidationError":
            return error.errors.map(e => e.message).join(". ");
        // la clave ajena apunta a algo que no existe (userId inexistente...)
        case "SequelizeForeignKeyConstraintError":
            return "El registro relacionado no existe";
        // PostgreSQL rechaza el dato (por ejemplo un texto donde va un número)
        case "SequelizeDatabaseError":
            return "Datos no válidos";
        default:
            return "Ha ocurrido un error inesperado";
    }
}
// --------------------------- ESTADOS HTTP ---------------------------

/**
 * Obtiene el código de estado HTTP correspondiente
 * al tipo de error recibido.
 *
 * @param {Error} error - Error que se quiere evaluar.
 * @returns {number} Código HTTP asociado al error.
 */
const getErrorStatus = (error) => {
    switch (error.name) {
        case "SequelizeUniqueConstraintError":
            return 409; // conflicto: ya existe
        case "SequelizeValidationError":
        case "SequelizeForeignKeyConstraintError":
        case "SequelizeDatabaseError":
            return 400; // datos inválidos
        default:
            return 500; // error nuestro
    }
}

// --------------------------- EXPORTACIONES ---------------------------

export {
    getErrorMessage,
    getErrorStatus,
    UniqueConstraintError,
    UniqueEmailError,
    UniqueUsernameError,
    throwError,
    NotFoundError,
    ForeignKeyConstraintError
}