import { restaurants } from "../../models/datos_prueba.js";


// ------------------ CRUD de restaurant ----------------------------

// ------------------ R (Read) ---------------------------------------------
// Función para mostrar la lista de restaurantes
const getAll = (req, res) => {
    res.render("restaurant/list", { restaurants });

};

export default {
    getAll
};



