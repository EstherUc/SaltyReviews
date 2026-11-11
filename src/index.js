import express from "express"; // para crear el servidor y gestionar las peticiones HTTP
import dotenv from "dotenv"; // para cargar variables de entorno desde el archivo .env
import cors from "cors"; // permite recibir peticiones desde otros origenes
import router from "./routes/router.js"; // enrutador principal


dotenv.config(); //carga las variables del archivo .env

const PORT = process.env.PORT || 3000;

const app = express(); // creamos nuestra aplicación Express

// Middlewares - (funciones que procesan una petición antes de que llegue a su controlador)
app.use(cors());
app.use(express.json()); // permite leer el body de los POST en json
app.use(express.urlencoded()); // permite leer el body de los POST en formularios

// Archivos estáticos
app.use(express.static("public"));

// Configuración de las vistas
app.set("views","./src/views");
app.set("view engine","ejs");

// Rutas de la aplicación
app.use("/",router);

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en marcha en http://localhost:${PORT}`);
    
});
