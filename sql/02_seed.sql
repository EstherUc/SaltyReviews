-- Datos NUEVOS de prueba compatibles con el esquema actualizado de pgAdmin.
-- PostgreSQL. Ejecutar tras crear las cinco tablas.
-- Incluye title y comment obligatorios en Reviews, con opiniones variadas de 1 a 5.
-- created_at y updated_at se asignan automáticamente en la base de datos.
-- Clave de las cuentas user demo: Demo1234! (hash bcrypt; solo desarrollo).
-- Clave de la cuenta admin demo: Admin (hash bcrypt; solo desarrollo).


BEGIN;

-- ============================================================
-- PARTE 1: Datos originales de SaltyReviews
-- ============================================================
INSERT INTO public."Categories" (name_category)
SELECT v.name_category FROM (VALUES
  ('Vasca'), ('China'), ('Tailandesa'), ('Peruana'),
  ('Pizzería'), ('Cafetería')
) AS v(name_category)
WHERE NOT EXISTS (
  SELECT 1 FROM public."Categories" c WHERE c.name_category = v.name_category
);

INSERT INTO public."Users" (username, email, password_hash, rol)
SELECT v.username, v.email, v.password_hash, v.rol
FROM (VALUES
  ('irene', 'irene@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
  ('pablo', 'pablo@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
  ('aitor', 'aitor@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
  ('maite', 'maite@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
  ('julia', 'julia@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
  ('hugo', 'hugo@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
  ('admin', 'admin@demo.test', '$2b$10$i/x/yfwFmno.vY86S3xOzuT.4uQtrFSSxYmgxntG6xFineBSvdxRG', 'admin')
) AS v(username, email, password_hash, rol)
WHERE NOT EXISTS (
  SELECT 1 FROM public."Users" u WHERE u.email = v.email
);

INSERT INTO public."Restaurants" (name_restaurant, address, id_category)
SELECT v.restaurant_name, v.address, c.id_category
FROM (VALUES
  ('Asador Arriaga',    'Calle Ribera 10, Bilbao',          'Vasca'),
  ('Itsas Etxea',       'Calle Jardines 6, Bilbao',        'Vasca'),
  ('Dragón Rojo',      'Calle Iparraguirre 22, Bilbao',    'China'),
  ('Bambú Oriental',    'Calle Buenos Aires 13, Bilbao',   'China'),
  ('Bangkok Sabores',   'Calle Licenciado Poza 19, Bilbao','Tailandesa'),
  ('Lima Limón',       'Calle Henao 31, Bilbao',           'Peruana'),
  ('Ceviche Norte',     'Calle Alameda Mazarredo 4',      'Peruana'),
  ('Forno 21',         'Calle Santutxu 21, Bilbao',        'Pizzería'),
  ('Masa Madre',       'Calle Egaña 15, Bilbao',          'Pizzería'),
  ('Café Nube',        'Calle Bidebarrieta 3, Bilbao',     'Cafetería')
) AS v(restaurant_name, address, category_name)
JOIN public."Categories" c ON c.name_category = v.category_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."Restaurants" r
  WHERE r.name_restaurant = v.restaurant_name AND r.address = v.address
);

-- El campo title es obligatorio. El esquema de este ZIP define comment con hasta 300 caracteres.
INSERT INTO public."Reviews" (id_user, id_restaurant, title, rating, comment)
SELECT u.id_user, r.id_restaurant, v.title, v.rating, v.comment
FROM (VALUES
  ('irene', 'Asador Arriaga', 'Una cena para repetir', 5, 'Fuimos a cenar un sábado y salimos encantados. La carne estaba en su punto, las guarniciones eran caseras y nos aconsejaron muy bien con las cantidades. No es barato, pero la calidad justifica el precio.'),
  ('pablo', 'Asador Arriaga', 'Correcto, sin sorprender', 3, 'El comedor es agradable y el personal fue atento, aunque el segundo plato llegó templado y tuvimos que pedir que lo calentaran. Las raciones son generosas, pero esperaba algo más por lo que cuesta.'),
  ('aitor', 'Itsas Etxea', 'Pescado magnífico', 5, 'Pedimos pescado del día para compartir y se notaba que era fresco. Estaba bien cocinado, con una salsa suave que no tapaba el sabor. Los postres también merecen la pena y volveríamos sin dudarlo.'),
  ('maite', 'Itsas Etxea', 'La espera empañó la comida', 2, 'Teníamos reserva y aun así tardaron casi cuarenta minutos en sentarnos. La comida tenía buen sabor, pero entre platos hubo otra espera larga. Es una pena porque el producto parecía de calidad.'),
  ('julia', 'Dragón Rojo', 'Dumplings espectaculares', 5, 'Probamos varios entrantes para compartir y los dumplings fueron lo mejor de la noche. La salsa picante tenía mucho sabor sin ser excesiva. Servicio rápido y relación calidad-precio muy buena.'),
  ('hugo', 'Dragón Rojo', 'No fue lo que esperaba', 2, 'El arroz llegó bastante seco y uno de los platos estaba demasiado salado. Nos cambiaron el acompañamiento sin problema, pero la experiencia general fue irregular. Quizá volvamos para probar otros platos.'),
  ('irene', 'Bambú Oriental', 'Bien para ir en grupo', 4, 'La carta tiene opciones para todos los gustos, incluidos platos poco picantes. Compartimos cuatro platos y las cantidades fueron suficientes. El local estaba lleno y aun así nos atendieron con amabilidad.'),
  ('pablo', 'Bangkok Sabores', 'Mucho sabor y picante real', 5, 'El pad thai tenía una mezcla de sabores estupenda y el curry verde picaba de verdad, tal como nos avisaron. Agradecimos poder elegir el nivel de picante. Un sitio al que llevaría a mis amigos.'),
  ('aitor', 'Bangkok Sabores', 'Esperaba algo más', 3, 'La presentación fue cuidada y el camarero nos explicó bien la carta. Sin embargo, el curry me pareció algo aguado y el precio de las bebidas elevado. Está bien, pero no sería mi primera opción.'),
  ('maite', 'Lima Limón', 'Ceviche fresco y equilibrado', 5, 'El ceviche tenía un punto de acidez perfecto y el pescado estaba muy fresco. También nos gustó la causa limeña. El equipo nos recomendó platos según lo que nos apetecía y acertó completamente.'),
  ('julia', 'Lima Limón', 'Muy rico, pero algo ruidoso', 4, 'El lomo saltado estaba tierno y bien sazonado, acompañado de patatas crujientes. Lo único que mejoraría es la acústica: con el restaurante lleno costaba mantener una conversación tranquila.'),
  ('hugo', 'Ceviche Norte', 'Una visita decepcionante', 1, 'Acudimos por las buenas opiniones, pero varios platos llegaron fríos y el arroz estaba pasado. Comentamos el problema y no recibimos una solución satisfactoria. No repetiríamos con esta experiencia.'),
  ('irene', 'Forno 21', 'Pizza con masa excelente', 5, 'La masa era fina en el centro y crujiente por los bordes, con ingredientes frescos y buena cantidad de tomate. Pudimos ver cómo preparaban las pizzas. Merece la pena reservar porque se llena pronto.'),
  ('pablo', 'Masa Madre', 'Buena pizza, servicio mejorable', 3, 'La pizza de cuatro quesos estaba sabrosa y la masa tenía una fermentación muy lograda. Sin embargo, tardaron bastante en tomar nota y nos trajeron una bebida equivocada. Volvería entre semana.'),
  ('aitor', 'Café Nube', 'Desayuno agradable', 4, 'El café estaba bien preparado y las tostadas se servían recién hechas. Hay opciones dulces y saladas, aunque el local es pequeño y a primera hora cuesta encontrar mesa. Buena opción para empezar el día.'),
  ('maite', 'Café Nube', 'No repetiría la merienda', 1, 'Pedimos chocolate y dos porciones de tarta. El chocolate llegó casi frío y las tartas parecían llevar bastante tiempo en vitrina. El personal fue educado, pero por el precio esperaba mucha más calidad.')
) AS v(username, restaurant_name, title, rating, comment)
JOIN public."Users" u ON u.username = v.username
JOIN public."Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."Reviews" re
  WHERE re.id_user = u.id_user AND re.id_restaurant = r.id_restaurant
    AND re.title = v.title
);

INSERT INTO public."Favorites" (id_user, id_restaurant, want_to_visit)
SELECT u.id_user, r.id_restaurant, v.want_to_visit
FROM (VALUES
  ('irene', 'Asador Arriaga', FALSE),
  ('irene', 'Bangkok Sabores', TRUE),
  ('pablo', 'Masa Madre', FALSE),
  ('pablo', 'Café Nube', TRUE),
  ('aitor', 'Itsas Etxea', FALSE),
  ('aitor', 'Lima Limón', TRUE),
  ('maite', 'Lima Limón', FALSE),
  ('maite', 'Forno 21', TRUE),
  ('julia', 'Dragón Rojo', FALSE),
  ('julia', 'Ceviche Norte', TRUE),
  ('hugo', 'Ceviche Norte', FALSE),
  ('hugo', 'Bambú Oriental', TRUE)
) AS v(username, restaurant_name, want_to_visit)
JOIN public."Users" u ON u.username = v.username
JOIN public."Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
  SELECT 1 FROM public."Favorites" f
  WHERE f.id_user = u.id_user AND f.id_restaurant = r.id_restaurant
);

-- ============================================================
-- PARTE 2: Nuevos datos para ampliar la demostracion
-- (4 usuarios, 6 restaurantes, 24 resenas, 18 favoritos)
-- ============================================================

-- 1) USUARIOS DE PRUEBA (no repetir ni email ni username)
INSERT INTO public."Users" (username, email, password_hash, rol)
SELECT v.username, v.email, v.password_hash, v.rol
FROM (VALUES
    ('nerea', 'nerea@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
    ('unai', 'unai@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
    ('leire', 'leire@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user'),
    ('david', 'david@demo.test', '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy', 'user')
) AS v(username, email, password_hash, rol)
WHERE NOT EXISTS (
    SELECT 1 FROM public."Users" u
    WHERE u.email = v.email OR u.username = v.username
);

-- 2) RESTAURANTES DE LAS 6 CATEGORIAS YA EXISTENTES
-- Insertamos image_url directamente para que las fotos funcionen incluso
-- si el fichero 03_restaurant_images.sql se ejecuto antes que este.
INSERT INTO public."Restaurants" (name_restaurant, address, id_category, image_url)
SELECT v.restaurant_name, v.address, c.id_category, v.image_url
FROM (VALUES
    ('Txoko del Norte', 'Calle Somera 18, Bilbao', 'Vasca', '/uploads/restaurants/Txoko_del_Norte.png'),
    ('Jardín de Jade', 'Calle Ledesma 11, Bilbao', 'China', '/uploads/restaurants/Jardin_de_Jade.png'),
    ('Siam Wok', 'Calle Autonomía 25, Bilbao', 'Tailandesa', '/uploads/restaurants/Siam_Wok.png'),
    ('Andes y Mar', 'Calle Fernández del Campo 8, Bilbao', 'Peruana', '/uploads/restaurants/Andes_y_Mar.png'),
    ('La Rueda', 'Calle Hurtado de Amézaga 24, Bilbao', 'Pizzería', '/uploads/restaurants/La_Rueda.png'),
    ('Café Lumbre', 'Calle Colón de Larreátegui 17, Bilbao', 'Cafetería', '/uploads/restaurants/Cafe_Lumbre.png')
) AS v(restaurant_name, address, category_name, image_url)
JOIN public."Categories" c ON c.name_category = v.category_name
WHERE NOT EXISTS (
    SELECT 1 FROM public."Restaurants" r WHERE r.name_restaurant = v.restaurant_name
);

-- 3) RESENAS VARIADAS DE 1 A 5 ESTRELLAS
INSERT INTO public."Reviews" (id_user, id_restaurant, title, rating, comment)
SELECT u.id_user, r.id_restaurant, v.title, v.rating, v.comment
FROM (VALUES
    ('nerea', 'Txoko del Norte', 'Pintxos para volver', 5, 'Probamos varios pintxos y todos estaban recién preparados. La tortilla jugosa y el ambiente de barra nos encantaron.'),
    ('unai', 'Txoko del Norte', 'Buena barra y buen ambiente', 4, 'Gran variedad de bocados y precios razonables. Tuvimos que esperar un poco para encontrar sitio, pero mereció la pena.'),
    ('hugo', 'Txoko del Norte', 'Correcto para picar', 3, 'Los pintxos estaban ricos, aunque algunas opciones se habían enfriado. El trato fue amable y el local estaba animado.'),
    ('david', 'Jardín de Jade', 'Noodles excelentes', 5, 'Los tallarines salteados tenían verduras crujientes y mucho sabor. Nos gustaron también los dumplings al vapor.'),
    ('julia', 'Jardín de Jade', 'Cocina sabrosa para compartir', 4, 'Compartimos platos de noodles y verduras. Las cantidades fueron generosas y el servicio muy atento.'),
    ('pablo', 'Jardín de Jade', 'Demasiada espera en hora punta', 2, 'El sabor era correcto, pero tardaron mucho entre el primero y el segundo plato. Esperábamos un servicio más ágil.'),
    ('leire', 'Siam Wok', 'Curry de diez', 5, 'El curry rojo tenía un equilibrio estupendo de especias y leche de coco. El arroz acompañaba perfectamente.'),
    ('nerea', 'Siam Wok', 'Picante algo fuerte', 3, 'Nos avisaron del nivel de picante, pero aun así el curry me resultó intenso. La presentación y el trato fueron buenos.'),
    ('irene', 'Siam Wok', 'Muy buena opción tailandesa', 4, 'Platos aromáticos y elaborados al momento. Me gustaron especialmente las verduras y las salsas.'),
    ('aitor', 'Andes y Mar', 'Anticuchos memorables', 5, 'La carne estaba jugosa y muy bien marinada. Las patatas doradas y la salsa de ají completaban un plato magnífico.'),
    ('maite', 'Andes y Mar', 'Una comida diferente y rica', 4, 'La carta tiene platos peruanos variados. Nos aconsejaron bien con las raciones y repetiríamos por los anticuchos.'),
    ('unai', 'Andes y Mar', 'La carne llegó demasiado hecha', 2, 'El sabor de las salsas era bueno, pero los pinchos salieron bastante secos. Quizá fue un día complicado.'),
    ('pablo', 'La Rueda', 'Pizza recién salida del horno', 5, 'La masa estaba aireada y los ingredientes frescos. Nos encantó ver el horno de leña al fondo del local.'),
    ('david', 'La Rueda', 'Muy buena masa', 4, 'Pedimos una pizza de cuatro estaciones y salió con la base crujiente. Buen precio para compartir.'),
    ('nerea', 'La Rueda', 'Agradable pero ruidoso', 3, 'La pizza estaba sabrosa, aunque había bastante ruido en el comedor. El personal fue muy amable.'),
    ('maite', 'Café Lumbre', 'Tarta casera estupenda', 5, 'El café tenía buen aroma y la tarta estaba esponjosa. Un sitio acogedor para una merienda tranquila.'),
    ('leire', 'Café Lumbre', 'Un rincón con encanto', 4, 'Muy buena atención y bebidas cuidadas. Las mesas junto a la ventana son perfectas para charlar.'),
    ('hugo', 'Café Lumbre', 'El café estaba tibio', 2, 'La tarta tenía buen aspecto, pero el café llegó templado y tardaron en traer la cuenta. Se puede mejorar.'),
    ('nerea', 'Café Nube', 'Brunch sin prisas', 4, 'Desayunamos con tostadas y café recién hecho. El servicio fue agradable incluso con bastante gente.'),
    ('unai', 'Forno 21', 'Sabor auténtico de horno', 5, 'Nos sorprendió la calidad de la masa y el tomate. La pizza llegó muy caliente y bien horneada.'),
    ('leire', 'Dragón Rojo', 'Para compartir entre amigos', 4, 'Pedimos varios entrantes y los repartimos en la mesa. Los dumplings fueron nuestros favoritos.'),
    ('david', 'Lima Limón', 'Una causa limeña muy rica', 3, 'El entrante estaba estupendo y lleno de sabor. El segundo plato tardó más de lo esperado.'),
    ('nerea', 'Itsas Etxea', 'Pescado fresco y buena atención', 5, 'El pescado estaba muy bien cocinado y los acompañamientos no le restaban protagonismo. Salimos contentos.'),
    ('unai', 'Ceviche Norte', 'Acidez demasiado marcada', 2, 'La presentación era bonita, pero el ceviche nos resultó demasiado ácido. Las raciones eran suficientes.')
) AS v(username, restaurant_name, title, rating, comment)
JOIN public."Users" u ON u.username = v.username
JOIN public."Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
    SELECT 1 FROM public."Reviews" re
    WHERE re.id_user = u.id_user
      AND re.id_restaurant = r.id_restaurant
      AND re.title = v.title
);

-- 4) FAVORITOS DE VARIOS USUARIOS (sin duplicar pares usuario-restaurante)
INSERT INTO public."Favorites" (id_user, id_restaurant, want_to_visit)
SELECT u.id_user, r.id_restaurant, v.want_to_visit
FROM (VALUES
    ('nerea', 'Txoko del Norte', FALSE),
    ('nerea', 'Siam Wok', TRUE),
    ('nerea', 'Café Nube', FALSE),
    ('unai', 'Jardín de Jade', TRUE),
    ('unai', 'La Rueda', FALSE),
    ('unai', 'Asador Arriaga', FALSE),
    ('leire', 'Andes y Mar', TRUE),
    ('leire', 'Café Lumbre', FALSE),
    ('leire', 'Bambú Oriental', TRUE),
    ('david', 'Siam Wok', FALSE),
    ('david', 'Masa Madre', TRUE),
    ('david', 'Itsas Etxea', FALSE),
    ('irene', 'Café Lumbre', TRUE),
    ('pablo', 'Txoko del Norte', TRUE),
    ('aitor', 'Jardín de Jade', FALSE),
    ('maite', 'La Rueda', TRUE),
    ('julia', 'Andes y Mar', FALSE),
    ('hugo', 'Café Lumbre', TRUE)
) AS v(username, restaurant_name, want_to_visit)
JOIN public."Users" u ON u.username = v.username
JOIN public."Restaurants" r ON r.name_restaurant = v.restaurant_name
WHERE NOT EXISTS (
    SELECT 1 FROM public."Favorites" f
    WHERE f.id_user = u.id_user AND f.id_restaurant = r.id_restaurant
);

COMMIT;

-- Totales esperados al inicializar una base limpia:
-- 6 categorias / 11 usuarios / 16 restaurantes / 40 resenas / 30 favoritos.
-- El script 03_restaurant_images.sql se ejecuta despues y asigna las fotos.