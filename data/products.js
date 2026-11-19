window.LUMICORE_PRODUCTS = [
  {
    id:'sk6812-rgbw-5m', type:'strip', name:'SK6812 RGBW 5m', subtitle:'60 LED/m · 5V · IP65', price:599,
    specs:['SK6812','RGBW','5V','60 LED/m','5 m','IP65','5050'],
    description:'Tira direccionable RGBW para efectos WLED y blanco dedicado. Ideal para proyectos donde quieres color y luz blanca real en el mismo sistema.',
    images:['assets/products/strips/IMG_3230.webp','assets/products/strips/IMG_3231_1_.webp','assets/products/strips/IMG_3232.webp','assets/products/strips/IMG_3234.webp','assets/products/strips/IMG_3236.webp'],
    tags:['WLED','RGBW','Alta densidad'],
    technical:{voltage:5, ledPerMeter:60, currentPerMeter:3.6, ip:'IP65', chipset:'SK6812', ledPackage:'5050'}
  },
  {
    id:'ws2815-12v-5m', type:'strip', name:'WS2815 RGB 12V 5m', subtitle:'60 LED/m · 12V · IP65', price:519,
    specs:['WS2815','RGB','12V','60 LED/m','5 m','IP65','4 pines','Backup data'],
    description:'Tira RGB direccionable WS2815 de 12V, 60 LED/m y 4 pines con línea de respaldo (backup). Ideal para recorridos donde quieres control LED por LED con mayor tolerancia ante fallos de un pixel.',
    images:['assets/products/strips/ws2815-12v/ws2815-01.webp','assets/products/strips/ws2815-12v/ws2815-02.webp','assets/products/strips/ws2815-12v/ws2815-03.webp'],
    tags:['WLED','12V','Long-run'],
    technical:{voltage:12, ledPerMeter:60, currentPerMeter:1.2, ip:'IP65', chipset:'WS2815', ledPackage:'5050'}
  },
  {
    id:'ws2812b-5v-5m', type:'strip', name:'WS2812B RGB 5m', subtitle:'60 LED/m · 5V · IP65', price:549,
    specs:['WS2812B','RGB','5V','60 LED/m','5 m','IP65','5050'],
    description:'Opción de entrada para proyectos WLED, efectos dinámicos y kits compactos.',
    images:['assets/products/strips/IMG_3230.webp','assets/products/strips/IMG_3232.webp','assets/products/strips/IMG_3234.webp'],
    tags:['WLED','RGB','Starter'],
    technical:{voltage:5, ledPerMeter:60, currentPerMeter:3.6, ip:'IP65', chipset:'WS2812B', ledPackage:'5050'}
  },
  {
    id:'gledopto-wled-esp32', type:'controller', name:'GLEDOPTO ESP32 WLED Digital LED Controller', subtitle:'GL-C-015WL-D · Mic / UART', price:629,
    specs:['ESP32','WiFi','WLED','Mic','UART','5-24V'],
    description:'Controlador GLEDOPTO con ESP32 para WLED y tiras digitales. Las fotos corresponden al producto y su empaque original.',
    images:['assets/products/controllers/gledopto/IMG_3242.webp','assets/products/controllers/gledopto/IMG_3243.webp','assets/products/controllers/gledopto/IMG_3244.webp','assets/products/controllers/gledopto/IMG_3245.webp','assets/products/controllers/gledopto/IMG_3246.webp','assets/products/controllers/gledopto/IMG_3247.webp'],
    tags:['WLED','ESP32','GLEDOPTO'],
    technical:{input:'DC 5-24V',maxOutput:'15A total',maxPerChannel:'10A',maxIC:'800'}
  },
  {
    id:'gledopto-017wl-d', type:'controller', name:'GLEDOPTO GL-C-017WL-D', subtitle:'ESP32 WLED · 4 salidas · 5–24V', price:629,
    specs:['ESP32','WLED','WiFi','4 salidas','Mic','UART','5–24V','15A total'],
    description:'Controlador digital GLEDOPTO con ESP32 y WLED, cuatro salidas independientes, micrófono integrado para audio reactive, UART y alimentación DC 5–24V. Ideal para instalaciones multicanal y proyectos WLED que requieren distribución en varias salidas.',
    images:['assets/products/controllers/gledopto/IMG_0690.webp','assets/products/controllers/gledopto/IMG_0691.webp','assets/products/controllers/gledopto/IMG_0692.webp','assets/products/controllers/gledopto/IMG_0693.webp'],
    tags:['WLED','ESP32','4 salidas','GLEDOPTO','Audio Reactive'],
    technical:{input:'DC 5–24V',outputs:4,totalOutput:'15A máx.',mic:'Integrado',uart:'Sí',levelShifter:'Sí'}
  },
  {
    id:'gledopto-zigbee', type:'controller', name:'GLEDOPTO Zigbee 3.0 Pro', subtitle:'GL-C-008P', price:549,
    specs:['Zigbee 3.0','GLEDOPTO','GL-C-008P'],
    description:'Controlador para integración con ecosistemas Zigbee compatibles y automatización del hogar.',
    images:['assets/products/controllers/gledopto/IMG_3246.webp','assets/products/controllers/gledopto/IMG_3247.webp'],
    tags:['Zigbee','Smart Home'],
    technical:{protocol:'Zigbee 3.0'}
  },
  {
    id:'gledopto-mini-wled', type:'controller', name:'GLEDOPTO Mini WLED Controller', subtitle:'Compacto · WiFi', price:419,
    specs:['WLED','WiFi','GLEDOPTO'],
    description:'Controlador compacto pensado para kits de inicio y proyectos de menor escala.',
    images:['assets/products/controllers/gledopto/IMG_3242.webp','assets/products/controllers/gledopto/IMG_3243.webp'],
    tags:['WLED','Mini','Starter'],
    technical:{protocol:'WiFi / WLED'}
  },
  {
    id:'ps-5v-15a', type:'power', name:'Fuente Conmutada 5V 15A', subtitle:'75W', price:419,
    specs:['5V','15A','75W','Conmutada'],
    description:'Fuente conmutada para proyectos de 5V. Dimensiona la fuente con el calculador LumiCore antes de comprar.',
    images:['assets/products/power/IMG_3248.webp','assets/products/power/IMG_3249.webp','assets/products/power/IMG_3250.webp','assets/products/power/IMG_3251.webp'],
    tags:['5V','Fuente','75W'],
    technical:{voltage:5, current:15, watts:75}
  },
  {
    id:'ps-12v-5a-slim', type:'power', name:'Fuente Slim 12V 5A', subtitle:'60W', price:319,
    specs:['12V','5A','60W','Slim'],
    description:'Fuente delgada para proyectos de 12V y configuraciones donde se necesita ahorrar espacio.',
    images:['assets/products/power/IMG_3250.webp','assets/products/power/IMG_3249.webp'],
    tags:['12V','Slim','60W'],
    technical:{voltage:12, current:5, watts:60}
  },
  {
    id:'ps-5v-10a', type:'power', name:'Fuente Conmutada 5V 10A', subtitle:'50W', price:329,
    specs:['5V','10A','50W'],
    description:'Fuente de 5V para kits compactos y proyectos de menor escala.',
    images:['assets/products/power/IMG_3248.webp','assets/products/power/IMG_3251.webp'],
    tags:['5V','50W','Starter'],
    technical:{voltage:5, current:10, watts:50}
  },
  {
    id:'cable-jst', type:'accessory', name:'Kit cable cobre 20AWG + conectores JST', subtitle:'Accesorios de instalación', price:249,
    specs:['20AWG','Cobre','JST'],
    description:'Kit base para cableado y conexiones en proyectos LumiCore.',
    images:['assets/products/strips/IMG_3231_1_.webp'],
    tags:['Cableado','JST']
  }
];

window.LUMICORE_KITS = [
  {id:'kit-architectural', name:'Architectural White & Color', badge:'RGBW', price:1390, market:1890, components:['SK6812 RGBW 5m','GLEDOPTO Zigbee 3.0 Pro','Fuente 5V 15A','Cable 20AWG + JST'], copy:'RGBW para ambientación y color con control inteligente.', componentImages:[['Tira LED','assets/products/strips/IMG_3230.webp'],['Controlador','assets/products/controllers/gledopto/IMG_3246.webp'],['Fuente','assets/products/power/IMG_3248.webp']]},
  {id:'kit-pro-longrun', name:'Pro Long-Run 12V', badge:'12V', price:1290, market:1690, components:['WS2815 RGB 12V 5m','GLEDOPTO WLED ESP32','Fuente 12V 5A Slim','Cable 20AWG'], copy:'Configuración orientada a recorridos de 12V.', componentImages:[['Tira LED','assets/products/strips/ws2815-12v/ws2815-01.webp'],['Controlador','assets/products/controllers/gledopto/IMG_0690.webp'],['Fuente','assets/products/power/IMG_3250.webp']]},
  {id:'kit-starter-gamer', name:'Starter Gamer Volumétrico', badge:'STARTER', price:949, market:1190, components:['WS2812B RGB 5m','GLEDOPTO Mini WLED','Fuente 5V 10A','Cable 20AWG + JST'], copy:'Punto de entrada a WLED con un kit completo.', componentImages:[['Tira LED','assets/products/strips/IMG_3230.webp'],['Controlador','assets/products/controllers/gledopto/IMG_3242.webp'],['Fuente','assets/products/power/IMG_3248.webp']]}
];

window.LUMICORE_DEFAULTS = {
  currentByMeter:{'sk6812-rgbw-5m':3.6,'ws2812b-5v-5m':3.6,'ws2815-12v-5m':1.2},
  safetyFactor:1.25,
  defaultPowerReserve:0.2,
  electricityRate:2.25
};
