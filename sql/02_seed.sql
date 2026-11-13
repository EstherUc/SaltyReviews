-- Datos NUEVOS de prueba compatibles con el esquema actualizado de pgAdmin.
-- PostgreSQL. Ejecutar tras crear las cinco tablas.
-- Incluye title y comment obligatorios en Reviews, con opiniones variadas de 1 a 5.
-- created_at y updated_at se asignan automáticamente en la base de datos.
-- Clave de las cuentas demo: Demo1234! (hash bcrypt; solo desarrollo).
-- Es repetible sin duplicar los registros de este lote, suponiendo nombres únicos.

BEGIN;

INSERT INTO public."Categories" (name_category)
SELECT v.name_category FROM (VALUES
  ('Vasca'), ('China'), ('Tailandesa'), ('Peruana'),
  ('Pizzería'), ('Cafetería')
) AS v(name_category)
WHERE NOT EXISTS (
  SELECT 1 FROM public."Categories" c WHERE c.name_category = v.name_category
);

INSERT INTO public."Users" (username, email, password_hash, rol)
SELECT v.username, v.email,
       '$2a$10$RirBfTcH.ZogWWLRg8wxQOn4o1Qx4hHRvNB/E9F0kg/Cp8KC6ONRy',
       v.rol
FROM (VALUES
  ('irene',  'irene@demo.test',  'user'),
  ('pablo',  'pablo@demo.test',  'user'),
  ('aitor',  'aitor@demo.test',  'user'),
  ('maite',  'maite@demo.test',  'user'),
  ('julia',  'julia@demo.test',  'user'),
  ('hugo',   'hugo@demo.test',   'user')
) AS v(username, email, rol)
WHERE NOT EXISTS (SELECT 1 FROM public."Users" u WHERE u.email = v.email);

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

-- El campo title es obligatorio. comment admite hasta 1000 caracteres en el esquema actualizado.
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

COMMIT;

-- Totales esperados en una base vacía: 6 categorías, 6 usuarios,
-- 10 restaurantes, 16 reseñas, 12 favoritos (50 registros).
