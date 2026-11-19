import restaurantRepository from "../../repositories/restaurant.repository.js";
import categoriesRepo from "../../repositories/category.repository.js";
import reviewRepository from "../../repositories/review.repository.js";
import favoriteRepository from "../../repositories/favorite.repository.js";

// ------------------ CRUD de restaurant ----------------------------


// ------------------ C (Create) ------------------

// Crear un restaurante desde un formulario
const create = async (req, res) => {

    // Recoger los datos enviados desde el formulario
    const { name_restaurant, address, id_category } = req.body;
    const formData = { name_restaurant, address, id_category };
    let categories = [];
    

    try {

        //recuperamos las categorías para el formulario
        categories = await categoriesRepo.getAll();

        // Comprobar que se hayan enviado todos los campos obligatorios
        if (!name_restaurant || !address || !id_category) {
            return res.status(400).render("restaurant/create", { categories, formData, error: "Todos los campos son obligatorios" });
        }

        // Crear el restaurante mediante el repositorio
        await restaurantRepository.create({
            name_restaurant,
            address,
            id_category
        });

        // Redirigir a la lista de restaurantes
        return res.redirect("/home");

    } catch (error) {
        console.error("Error al crear el restaurante:", error);
        return res.status(500).render("restaurant/create", { categories: categories, formData: formData, error: error.status ? error.message : "Ha ocurrido un error de servidor" });
    }
};

// Mostrar formulario de creación de restaurantes
const createForm = async (req, res) => {
    try {
        // Obtener las categorías de PostgreSQL
        const categories = await categoriesRepo.getAll();

        // Mostrar el formulario
        res.render("restaurant/create", { categories: categories, formData: {}, error: null });

    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).render("restaurant/create", { categories: [], formData: {}, error: "No se han podido cargar las categorías" });
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

        let favoriteIds = [];

        if (req.session?.user) {
            favoriteIds = await favoriteRepository.getRestaurantIdsByUser(
                req.session.user.id_user
            );
        }

        // Mostrar los restaurantes y sus puntuaciones
        return res.render("restaurant/list", {
            restaurants: restaurantsWithRating,
            favoriteIds
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

        // 1. Obtener la ID del restaurante
        const id = req.params.id;

        // 2. Buscar el restaurante
        const restaurant = await restaurantRepository.getById(id);

        // 3. Comprobar que existe
        if (!restaurant) {
            return res.status(404).render("restaurant/show", { restaurant: null, reviews: [], formData: {}, error: "Restaurante no encontrado" });
        }

        // 4. Buscar las reseñas de ESTE restaurante
        const reviews = await reviewRepository.getByRestaurantId(
            restaurant.id_restaurant
        );

        // 5. Enviar restaurante y reseñas a la vista
        return res.render("restaurant/show", {
            restaurant,
            reviews,
            formData: {},
            error: null
        });

    } catch (error) {

        console.error(error);
        return res.status(error.status || 500).render("restaurant/show", { restaurant: null, reviews: [], formData: {}, error: error.status ? error.message : "Ha ocurrido un error de servidor" });
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

        // Obtener las categorías para mostrarlas en el desplegable
        const categories = await categoriesRepo.getAll();

        // Mostrar el formulario con la categoría actual seleccionada
        return res.render("restaurant/update", {
            restaurant,
            categories,
            error: null
        });

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
        await restaurantRepository.remove(id);

        // Redirigir al home con mensaje
        return res.redirect("/home?message=Restaurante+eliminado+correctamente");

    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).render("restaurant/show", { restaurant: null, reviews: [], formData: {}, error: error.status ? error.message : "Ha ocurrido un error de servidor" });
    }
};

export default {
    create, getAll, getById, updateForm, update, remove, createForm
};