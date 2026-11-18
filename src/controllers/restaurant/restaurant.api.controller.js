
import restaurantRepository from "../../repositories/restaurant.repository.js";
// ------------------ C (Create) ------------------

// Crear un nuevo restaurante
const create = async (req, res) => {
    // Recoger los datos enviados por el usuario
    const { name_restaurant, address, id_category } = req.body;

    // Comprobar que se hayan enviado los datos obligatorios
    if (!name_restaurant || !address || !id_category) {
        return res.status(400).json({
            message: "El nombre, la dirección y la categoría son obligatorios"
        });
    }
    try {
        // Crear el restaurante en PostgreSQL mediante Sequelize
       const newRestaurant = await restaurantRepository.create({ name_restaurant, address, id_category });

        console.log("ID del restaurante creado:", newRestaurant.id_restaurant);

        res.status(201).json({
            data: {
                id_restaurant: newRestaurant.id_restaurant,
                name_restaurant: newRestaurant.name_restaurant,
                address: newRestaurant.address,
                id_category: newRestaurant.id_category,
            }
        });
    } catch (error) {
        // Mostrar el error en la terminal
        console.error("Error al registrar el restaurante:", error);

        // Enviar un mensaje de error al navegador
        res.status(500).send("Error al crear el restaurante");
    }
};


// ------------------ R (Read) ------------------

//obtener todos los restaurantes
const getAll = async (req, res) => {

   const restaurant = await restaurantRepository.getAll();

    res.json({ data: restaurant });
};

//obtener un restaurante por su ID
const getById = async (req, res) => {

    const id = parseInt(req.params.id);
   const restaurant = await restaurantRepository.getById(id);

    if (!restaurant) {
        return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    res.json({ data: restaurant });
};





// ------------------ U (Update) ------------------

// Actualizar restaurantes 

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const restaurant = await restaurantRepository.getById(id);

        // Si no existe el restaurante, devolver un error 404
        if (!restaurant) {

            return res.status(404).send("Restaurante no encontrado");
        }
        const { name_restaurant, address, id_category } = req.body;
        // Comprobar que se hayan enviado todos los datos obligatorios
        if (!name_restaurant || !address || !id_category) {
            return res.status(400).json({
                message: "El nombre, la dirección y la categoría son obligatorios"
            });
        }
       await restaurantRepository.update(id, {
    name_restaurant,
    address,
    id_category
});
        return res.status(200).json({
            message: "Restaurante actualizado correctamente"
        });

    } catch (error) {
        // Mostrar el error en la consola si falla la consulta
        console.error("Error al actualizar el restaurante:", error);

        // Devolver un error 500 al navegador
        res.status(500).send("Error al actualizar el restaurante");
    }
};

// Modificar parcialmente un restaurante
const modify = async (req, res) => {
    try {
        // Obtener el ID del restaurante desde la URL
        const id = req.params.id;

        // Buscar el restaurante mediante el repositorio
        const restaurant = await restaurantRepository.getById(id);

        // Comprobar si existe
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurante no encontrado"
            });
        }

        // Recoger los datos enviados
        const { name_restaurant, address, id_category } = req.body;

        // Comprobar que se haya enviado al menos un campo
        if (
            name_restaurant === undefined &&
            address === undefined &&
            id_category === undefined
        ) {
            return res.status(400).json({
                message: "Debes enviar al menos un campo para modificar"
            });
        }

        // Comprobar que los campos enviados no estén vacíos
        if (
            (name_restaurant !== undefined && !name_restaurant) ||
            (address !== undefined && !address) ||
            (id_category !== undefined && !id_category)
        ) {
            return res.status(400).json({
                message: "Los campos enviados no pueden estar vacíos"
            });
        }

        // Modificar únicamente los campos enviados
        const updatedRestaurant = await restaurantRepository.modify(id, {
            name_restaurant,
            address,
            id_category
        });

        return res.status(200).json({
            message: "Restaurante modificado correctamente",
            data: updatedRestaurant
        });

    } catch (error) {
        console.error("Error al modificar el restaurante:", error);

        return res.status(500).json({
            message: "Error al modificar el restaurante"
        });
    }
};

// ------------------ D (Delete) ------------------

// Borrar un restaurante
const remove = async (req, res) => {
    try {
        // Obtener el ID del restaurante desde la URL
        const id = req.params.id;

        // Buscar el restaurante mediante el repositorio
        const restaurant = await restaurantRepository.getById(id);

        // Si no existe el restaurante, devolver un error 404
        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurante no encontrado"
            });
        }

        // Eliminar el restaurante mediante el repositorio
        await restaurantRepository.remove(id);

        // Confirmar que el restaurante se ha eliminado correctamente
        return res.status(200).json({
            message: "Restaurante eliminado correctamente"
        });

    } catch (error) {
        // Mostrar el error en la terminal
        console.error("Error al eliminar el restaurante:", error);

        // Devolver un error 500 al cliente
        return res.status(500).json({
            message: "Error al eliminar el restaurante"
        });
    }
};
export default {
    create,
    getAll,
    getById,
    update,
    modify,
    remove
}