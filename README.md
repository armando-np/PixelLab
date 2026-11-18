# PixelLab — sitio inicial

MVP estático para GitHub Pages, con catálogo, precios del modelo financiero, kits Ready-to-Go, configurador y herramientas técnicas iniciales.

## Estructura
- `index.html` — página principal
- `src/styles.css` — estilos
- `src/app.js` — carrito, catálogo, configurador y calculadoras
- `data/products.js` — catálogo, precios y datos técnicos base
- `assets/` — fotos, logo, iconos y otros recursos a incorporar

## Publicar en GitHub Pages
1. Crea un repositorio, por ejemplo `pixellab-web`.
2. Sube estos archivos manteniendo la estructura de carpetas.
3. En GitHub: Settings → Pages → Deploy from a branch → `main` / root.
4. Para producción, conecta el dominio cuando esté definido.

## Datos financieros usados en este MVP
Precios de venta del archivo `modelo_financiero_tiras_led_cdmx-v2.xlsx`:
- SK6812 RGBW 5m: $449 MXN
- WS2815 RGB 12V 5m: $369 MXN
- WS2812B RGB 5m: $249 MXN
- GLEDOPTO Zigbee 3.0 Pro: $399 MXN
- GLEDOPTO WLED ESP32: $479 MXN
- GLEDOPTO Mini WLED: $269 MXN
- Fuente 5V 15A: $269 MXN
- Fuente 12V 5A Slim: $169 MXN
- Fuente 5V 10A: $179 MXN
- Cable 20AWG + JST: $99 MXN

Kits:
- Architectural White & Color: $1,090 MXN
- Pro Long-Run 12V: $990 MXN
- Starter Gamer Volumétrico: $649 MXN

## Importante
Los cálculos técnicos mostrados aquí son un prototipo y no deben presentarse como ingeniería final hasta completar la base de datos de consumos reales, límites de controladores, AWG, resistencia de cables, fusibles y reglas de inyección.


## Actualización
- Añadida sección "¿Por qué PixelLab?" con propuesta de valor, calidad, densidad LED, gestión térmica, kits Plug & Play, soporte e instalación.
- La vida de 50,000+ horas se comunica como referencia nominal cuando la especificación del producto la respalda, equivalente a ~17 años a 8 horas diarias, bajo condiciones saludables de operación. No se presenta como garantía universal.


## Actualizacion v3

Incluye:
- Calculadora de potencia ampliada con densidad 30/60/144 LED/m, longitud, brillo, consumo del controlador, limitador de corriente y recomendaciones orientativas de fuente, fusible y cable.
- Estimador de costo operativo en MXN/kWh por hora, dia, mes y ano, con escenario de potencia maxima. La tarifa mostrada es editable y debe sustituirse por la tarifa real del usuario.
- Boton de WhatsApp a +52 56 3894 4059 y acceso flotante.
- Nueva seccion de contacto y asesoria.

Nota: las calculadoras son orientativas. Para instalaciones finales deben validarse especificaciones del fabricante, caida de voltaje, proteccion, cableado y esquema de inyeccion.


## Actualización v5 — Proyectos
- Se añadieron fotografías reales extraídas de los dos videos proporcionados por el usuario.
- La portada ahora utiliza los proyectos como elemento visual principal.
- Se añadió una sección "Proyectos reales" con galería.
- Las imágenes están en `assets/projects/`.
- Las fotografías son fotogramas representativos de los videos originales para optimizar carga y usarlas como portada.


## Proyecto añadido
- Fachada residencial: `assets/projects/fachada-residencial/fachada-principal.jpeg`
- Segunda escena: `assets/projects/fachada-residencial/fachada-ambiente.jpeg`
