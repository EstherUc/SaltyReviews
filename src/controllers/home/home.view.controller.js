import categoriesRepo from "../../repositories/category.repository.js";
import restaurantRepository from "../../repositories/restaurant.repository.js";

// Mostrar Home con restaurantes filtrados por categoría
const getHome = async (req, res) => {

    try {

        // 1. Recuperar la categoría seleccionada desde la URL
        const categoryParam = req.query.category;

        let selectedCategoryId = null;

        // 2. Validar la categoría, si se ha seleccionado alguna
        if (categoryParam !== undefined) {

            const id = Number(categoryParam);

            if (
                typeof categoryParam !== "string" ||
                !Number.isSafeInteger(id) ||
                id <= 0
            ) {
                return res.status(400).send(
                    "La categoría seleccionada no es válida"
                );
            }

            selectedCategoryId = id;
        }

        // 3. Obtener todas las categorías
        const categories = await categoriesRepo.getAll();

        // 4. Obtener los restaurantes
        let restaurants;

        if (selectedCategoryId === null) {

            // Sin filtro: mostrar todos
            restaurants = await restaurantRepository.getAll();

        } else {

            // Con filtro: mostrar solo los de la categoría
            restaurants = await restaurantRepository.getByCategoryId(
                selectedCategoryId
            );
        }

        // 5. Calcular las puntuaciones medias
        const restaurantsWithRating = await Promise.all(

            restaurants.map(async (restaurant) => {

                const averageRating =
                    await restaurantRepository.getAverageRating(
                        restaurant.id_restaurant
                    );

                return {
                    ...restaurant.toJSON(),
                    averageRating
                };
            })
        );

        // 6. Mostrar Home con todos los datos
        return res.render("home/home", {
            categories,
            restaurants: restaurantsWithRating,
            selectedCategoryId
        });

    } catch (error) {

        console.error("Error al cargar Home:", error);

        return res.status(500).send(
            "Error al cargar la página principal"
        );
    }
};

export default {
    getHome
};