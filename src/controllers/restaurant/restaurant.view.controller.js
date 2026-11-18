import restaurantRepository from "../../repositories/restaurant.repository.js";
import categoriesRepo from "../../repositories/category.repository.js";

// ------------------ CRUD de restaurant ----------------------------


// ------------------ C (Create) ------------------

// Crear un restaurante desde un formulario
const create = async (req, res) => {
    try {
        // Recoger los datos enviados desde el formulario
        const { name_restaurant, address, id_category } = req.body;

        // Comprobar que se hayan enviado todos los campos obligatorios
        if (!name_restaurant || !address || !id_category) {
            return res.status(400).send("Todos los campos son obligatorios");
        }

        // Crear el restaurante mediante el repositorio
        await restaurantRepository.create({
            name_restaurant,
            address,
            id_category
        });

        // Redirigir a la lista de restaurantes
        return res.redirect("/restaurant");

    } catch (error) {
        console.error("Error al crear el restaurante:", error);
        return res.status(500).send("Error al crear el restaurante");
    }
};

// Mostrar formulario de creación de restaurantes
const createForm = async (req, res) => {
    try {
        // Obtener las categorías de PostgreSQL
        const categories = await categoriesRepo.getAll();

        // Mostrar el formulario
        res.render("restaurant/create", { categories });

    } catch (error) {
        console.error("Error al cargar el formulario:", error);

        res.status(500).send("Error al cargar el formulario");
    }
};

// ------------------ R (Read) ------------------
// Mostrar todos los restaurantes
const getAll = async (req, res) => {
    try {
        // Obtener todos los restaurantes
        const restaurants = await restaurantRepository.getAll();

        // Calcular la puntuación media de cada restaurante
        const restaurantsWithRating = await Promise.all(
            restaurants.map(async (restaurant) => {

                const averageRating =
                    await restaurantRepository.getAverageRating(
                        restaurant.id_restaurant
                    );

                return {
                    ...restaurant.toJSON(),
                    averageRating: averageRating
                };
            })
        );

        // Mostrar los restaurantes y sus puntuaciones
        return res.render("restaurant/list", {
            restaurants: restaurantsWithRating
        });

    } catch (error) {
        console.error("Error al obtener los restaurantes:", error);

        return res.status(500).send(
            "Error al cargar los restaurantes"
        );
    }
};

// Mostrar restaurantes según su ID
const getById = async (req, res) => {
    try {

        // Obtener el ID del restaurante desde la URL
        const id = req.params.id;

        // Buscar el restaurante en PostgreSQL por su clave primaria
        const restaurant = await restaurantRepository.getById(id);

        // Si no existe el restaurante, devolver un error 404
        if (!restaurant) {
            return res.status(404).send("Restaurante no encontrado");
        }
        // Enviar el restaurante encontrado a la vista show.ejs
        res.render("restaurant/show", { restaurant });
    } catch (error) {
        // Mostrar el error en la consola si falla la consulta
        console.error("Error al obtener el restaurante:", error);

        // Devolver un error 500 al navegador
        res.status(500).send("Error al cargar el restaurante");
    }
};

// ------------------ U (Update) ------------------

// Mostrar el formulario para editar un restaurante
const updateForm = async (req, res) => {
    try {
        // Obtener el ID del restaurante desde la URL
        const id = req.params.id;

        // Buscar el restaurante mediante el repositorio
        const restaurant = await restaurantRepository.getById(id);

        // Comprobar si existe
        if (!restaurant) {
            return res.status(404).send("Restaurante no encontrado");
        }

        // Mostrar el formulario con los datos del restaurante
        return res.render("restaurant/update", { restaurant });

    } catch (error) {
        console.error("Error al cargar el formulario:", error);
        return res.status(500).send("Error al cargar el formulario");
    }
};

// Actualizar un restaurante desde el formulario
const update = async (req, res) => {
    try {
        // Obtener el ID del restaurante
        const id = req.params.id;

        // Recoger los datos enviados desde el formulario
        const { name_restaurant, address, id_category } = req.body;

        // Comprobar que todos los campos estén completos
        if (!name_restaurant || !address || !id_category) {
            return res.status(400).send("Todos los campos son obligatorios");
        }

        // Actualizar el restaurante mediante el repositorio
        const restaurant = await restaurantRepository.update(id, {
            name_restaurant,
            address,
            id_category
        });

        // Comprobar si existe el restaurante
        if (!restaurant) {
            return res.status(404).send("Restaurante no encontrado");
        }

        // Redirigir a la página del restaurante actualizado
        return res.redirect(`/restaurant/${id}`);

    } catch (error) {
        console.error("Error al actualizar el restaurante:", error);
        return res.status(500).send("Error al actualizar el restaurante");
    }
};

// ------------------ D (Delete) ------------------

// Eliminar un restaurante
const remove = async (req, res) => {
    try {
        // Obtener el ID del restaurante desde la URL
        const id = req.params.id;

        // Eliminar el restaurante mediante el repositorio
        const restaurant = await restaurantRepository.remove(id);

        // Comprobar si el restaurante existía
        if (!restaurant) {
            return res.status(404).send("Restaurante no encontrado");
        }

        // Redirigir a la lista de restaurantes
        return res.redirect("/restaurant");

    } catch (error) {
        console.error("Error al eliminar el restaurante:", error);
        return res.status(500).send("Error al eliminar el restaurante");
    }
};

export default {
    create, getAll, getById, updateForm, update, remove, createForm
};