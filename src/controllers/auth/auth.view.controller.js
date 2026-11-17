import bcrypt from "bcrypt";
import userRepository from "../../repositories/user.repository.js";

//función para redirigir con mensajes
function redirect(res, url, data = {}) {
    const urlSearchParams = new URLSearchParams();

    for (const key in data) {
        urlSearchParams.append(key, data[key]);
    }

    res.redirect(url + "?" + urlSearchParams.toString());
}

// ++++++++++++++++++++ REGISTRO +++++++++++++++++++++++++++

//mostrar el formulario de registro
const registerForm = async (req, res) => {
    res.render("auth/register");
};


//registrar un usuario nuevo
const register = async (req, res) => {

    const { username, email, password, passwordRepeat } = req.body;

    if (password !== passwordRepeat) {
        redirect(res, "/auth/register", {error: "Las contraseñas no coinciden"});
        return;
    }

    try {
        let oldUser = await userRepository.findEmail(email);

        if (oldUser) {
            redirect(res, "/auth/register", {error: "Ya existe un usuario con este email"});
            return;
        }

        oldUser = await userRepository.getByUsername(username);

        if (oldUser) {
            redirect(res, "/auth/register", {error: "Ya existe un usuario con este nombre"});
            return;
        }

        const user = await userRepository.create({
            username,
            email,
            password_hash: password
        });

        redirect(res, "/auth/login", {message: "Registro exitoso"});

    } catch (error) {
        console.error(error);
        redirect(res, "/auth/register", {error: "Error al registrarse"});
    }
};


// ++++++++++++++++++++ INICIAR SESIÓN - LOGIN +++++++++++++++++++++++++++

//mostrar el formulario de login
const loginForm = async (req, res) => {

    res.render("auth/login");
};


//iniciar sesión
const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await userRepository.findEmail(email); //buscar el usuario por su email

        //comprobar si existe
        if (!user) {
            redirect(res, "/auth/login", {error: "Credenciales incorrectas"});
            return;
        }

        //comparar la contraseña con la que está cifrada en la BD
        const compare = await bcrypt.compare(password, user.password_hash);

        if (!compare) {
            redirect(res, "/auth/login", {error: "Credenciales incorrectas"});
            return;
        }

        //guardar los datos del usuario en la sesión
        req.session.user = {
            id_user: user.id_user,
            rol: user.rol
        };

        redirect(res, "/", {message: "Login exitoso"});

    } catch (error) {
        console.error(error);
        redirect(res, "/auth/login", {error: "Ha habido un error en el Login"});
    }
};


// ++++++++++++++++++++ CERRAR SESIÓN - LOGOUT +++++++++++++++++++++++++++

//cerrar sesión
const logout = async (req, res) => {

    req.session.destroy();
    res.redirect("/");

};



export default {
    registerForm,
    register,
    loginForm,
    login,
    logout
};