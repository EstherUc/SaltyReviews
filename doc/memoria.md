Memoria de SaltyReviews


1. Estructura inicial

Lo primero fue preparar la estructura inicial del proyecto y dejar listo el entorno para poder empezar a trabajar.

Creamos los primeros archivos del proyecto.
Preparamos los esquemas de la base de datos.
Añadimos los scripts necesarios para crear las tablas y cargar datos de prueba.
Instalamos y configuramos las dependencias.
Dejamos Docker preparado para poder ejecutar el proyecto.

En este punto todavía no teníamos desarrolladas las funcionalidades, simplemente estábamos preparando todo lo necesario para empezar.


2. Routers y navegación

Una vez preparada la estructura inicial, empezamos a organizar cómo íbamos a gestionar las diferentes partes de la aplicación.

Preparamos el archivo index.js.
Corregimos los datos de prueba, añadiendo el campo title a las reviews.
Creamos el router principal.
Separamos las rutas de las API y las rutas de las vistas.
Empezamos a rellenar los archivos de los diferentes módulos.

La idea era tener separado lo que iba a devolver datos (API) de lo que iba a mostrar las páginas de la aplicación (vistas).


3. CRUD de usuarios

Una de las primeras funcionalidades que empezamos a desarrollar fue la gestión de usuarios.

Fuimos implementando poco a poco las operaciones CRUD, tanto para la API como para las vistas:

Crear usuarios.
Consultar usuarios.
Modificar usuarios.
Eliminar usuarios.

Durante esta parte también tuvimos que corregir algunos problemas de enrutamiento y resolver conflictos al integrar los cambios de las diferentes ramas.


4. CRUD de reviews

Después empezamos con la parte de las reviews.

Creamos los archivos necesarios para poder trabajar con ellas:

Vistas.
Controladores.
API.
Rutas.

En un primer momento implementamos la creación y eliminación de reviews.

Más adelante fuimos ampliando esta parte para poder relacionar las reseñas con los usuarios que las escribían.


5. Modelos y base de datos

A medida que el proyecto iba creciendo, vimos que necesitábamos organizar mejor los archivos comunes y la forma de trabajar con la base de datos.

Creamos la estructura de carpetas y archivos para:

repositories.
models.
config.

También empezamos a modificar las tablas y relaciones de la base de datos.

Entre otras cosas:

Modificamos la tabla Users.
Creamos user.model.js.
Corregimos algunos problemas con el esquema de la base de datos.
Arreglamos la relación Category.hasMany - Restaurant.

Esta parte nos sirvió para dejar una estructura más organizada y poder trabajar mejor con Sequelize.


6. Integración de usuarios y reviews

Seguimos avanzando con los usuarios y las reviews.

En esta fase empezamos a adaptar los controladores para trabajar con Sequelize en lugar de utilizar la estructura que teníamos inicialmente.

Los cambios principales fueron:

Creamos user.repository.
Reconstruimos user.api.controller utilizando Sequelize.
Adaptamos user.view.controller.
Hicimos algunos retoques en las vistas EJS.
Creamos el repositorio de reviews.
Arreglamos los controladores de reviews.
Realizamos algunos cambios en la base de datos.

También empezamos a conectar mejor las reviews con los usuarios, para que cada reseña estuviese relacionada con la persona que la había publicado.


7. Vistas e imports

Una vez que teníamos más avanzada la parte de usuarios y reviews, empezamos a probar cómo funcionaban ambas partes juntas.

Hicimos pruebas de integración entre usuarios y reviews y aprovechamos para mejorar la estructura HTML de las vistas EJS.

También corregimos algunos imports y problemas que estaban dando las API.

Fue una fase más centrada en arreglar cosas y conseguir que lo que habíamos desarrollado hasta entonces funcionase correctamente.


8. Middlewares y header

Empezamos a trabajar en los middlewares y en algunos aspectos de la navegación.

También incorporamos enlaces dinámicos en el header, para que la navegación se adaptase mejor a las diferentes partes de la aplicación.

Esto nos serviría más adelante para poder mostrar diferentes opciones dependiendo de si el usuario había iniciado sesión o no.


9. Autenticación y permisos

En esta parte empezamos a implementar la autenticación.

La idea era que los usuarios pudiesen iniciar sesión y que la aplicación supiese quién estaba utilizando la web.

Además de identificar al usuario, empezamos a trabajar con los permisos para controlar qué podía hacer cada uno.

Esto era importante porque no queríamos que cualquier usuario pudiese realizar todas las acciones de la aplicación.

Más adelante fuimos ampliando esta parte para diferenciar los permisos de usuarios normales y administradores.


10. Sistema de favoritos

Esta parte tuvo un cambio importante respecto a lo que habíamos pensado inicialmente.

La primera idea

Al principio habíamos pensado en añadir un campo booleano llamado quieroVisitar en la tabla de restaurantes.

La idea era bastante sencilla:

Si el campo tenía un 0, el restaurante no estaba marcado como favorito.
Si tenía un 1, el restaurante estaba marcado como favorito.

Así, el botón de favoritos aparecería vacío o relleno dependiendo del valor de ese campo.

Por qué cambiamos de idea

Cuando empezamos a pensar cómo funcionaría realmente, nos dimos cuenta de que esta solución se nos quedaba corta.

El problema era que los favoritos dependen de cada usuario, no del restaurante en general.

Por ejemplo, un restaurante puede ser favorito para una persona y no serlo para otra. Si guardábamos esa información directamente en la tabla de restaurantes, no podríamos diferenciar los favoritos de cada usuario.

Por eso decidimos cambiar el planteamiento.

Cómo lo hicimos finalmente

En lugar de utilizar un campo booleano, creamos una relación entre usuarios y restaurantes mediante una tabla de favoritos.

De esta manera, cada registro representa que un usuario concreto ha guardado un restaurante como favorito.

Así conseguimos que:

Un usuario pueda tener muchos restaurantes favoritos.
Un restaurante pueda ser favorito para muchos usuarios.
Cada usuario gestione sus favoritos de manera independiente.

También desarrollamos las operaciones necesarias para añadir y eliminar favoritos, tanto en la API como en las vistas.

Cómo funciona ahora el botón

El botón ya no depende de un campo booleano del restaurante, sino de si existe una relación entre el usuario que ha iniciado sesión y ese restaurante.

Si existe esa relación, el botón aparece relleno.
Si no existe, aparece vacío.
Al pulsarlo, se añade o elimina el favorito correspondiente.

También creamos la carpeta favorites dentro de views y fuimos integrando esta funcionalidad con usuarios y reviews.

Creo que este cambio fue importante porque nos permitió plantear los favoritos de una forma mucho más lógica y evitar una estructura que nos habría dado problemas más adelante.


11. Redirecciones a Home

Seguimos haciendo pequeños ajustes en la navegación de la aplicación.

En este caso, trabajamos en las redirecciones hacia Home para conseguir que el usuario volviese a la página principal cuando correspondiese.


12. Header y footer de favoritos

Aprovechamos para mejorar un poco la parte visual de favoritos.

Añadimos el header y el footer a favorite/list.ejs, ya que queríamos mantener la misma estructura que en el resto de páginas de la aplicación.


13. CRUD de categorías

Después seguimos con la parte de categorías.

Primero añadimos los documentos y archivos necesarios y empezamos a crear las vistas.

Al principio quedaron algunos errores pendientes, así que fuimos haciendo correcciones hasta conseguir que la funcionalidad estuviese operativa.

Entre los cambios realizados:

Añadimos las vistas de categorías.
Corregimos errores que habían aparecido durante su desarrollo.
Arreglamos la creación de categorías.
Hicimos diferentes ajustes hasta conseguir que funcionase correctamente.

Finalmente conseguimos dejar la parte de categorías funcionando.


14. Permisos de categorías y reviews

Una vez que teníamos la autenticación más avanzada, seguimos trabajando en los permisos.

Fuimos añadiendo restricciones para controlar mejor las acciones que podía realizar cada tipo de usuario.

En concreto:

Añadimos control de permisos para el botón de eliminar.
Incorporamos permisos específicos para categorías.
Añadimos permisos para reviews.
Diferenciamos los permisos de usuarios normales y administradores.

Con esto conseguimos que determinadas acciones estuviesen restringidas dependiendo del tipo de usuario y sus permisos.


15. Estado actual

Finalmente integramos los últimos cambios de la rama auth, dejando incorporadas las mejoras de autenticación y permisos.

A estas alturas, el proyecto ya cuenta con bastantes funcionalidades desarrolladas:

Gestión de usuarios (CRUD).
Sistema de reviews.
Autenticación de usuarios.
Control de permisos.
Sistema de favoritos.
Gestión de categorías.
Relaciones entre usuarios, restaurantes y favoritos.
Vistas EJS.
API y rutas.
Navegación mediante header y footer.
Base de datos gestionada con Sequelize.
Cambios de planteamiento

Mirando un poco hacia atrás, el proyecto ha ido cambiando bastante desde la idea inicial.

No todo lo que planteamos al principio se ha quedado igual. Según íbamos desarrollando y entendiendo mejor cómo tenía que funcionar la aplicación, hemos ido modificando algunas decisiones.

El ejemplo más claro es el de favoritos, donde pasamos de utilizar un campo booleano a crear una relación entre usuarios y restaurantes.

También hemos ido reorganizando la estructura del proyecto, adaptando los controladores a Sequelize y conectando funcionalidades que inicialmente habíamos desarrollado por separado.

En general, hemos ido construyendo la aplicación poco a poco, solucionando los problemas que iban apareciendo y adaptando algunas partes cuando veíamos que la idea inicial podía mejorarse.

La idea ha sido intentar que las funcionalidades no solo funcionasen por separado, sino que tuviesen sentido cuando se utilizaban conjuntamente dentro de la aplicación.