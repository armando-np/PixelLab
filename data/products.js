window.PIXELLAB_PRODUCTS = [
  {id:'sk6812-rgbw-5m', type:'strip', name:'SK6812 RGBW 5m', subtitle:'60 LED/m · 5V · IP65', price:449, specs:['SK6812','RGBW','5V','60 LED/m','5 m','IP65'], description:'Tira direccionable RGBW para efectos WLED y blanco dedicado.'},
  {id:'ws2815-12v-5m', type:'strip', name:'WS2815 RGB 12V 5m', subtitle:'60 LED/m · 12V · IP65', price:369, specs:['WS2815','RGB','12V','60 LED/m','5 m','IP65'], description:'Tira RGB direccionable de 12V para proyectos donde conviene reducir corriente y facilitar recorridos largos.'},
  {id:'ws2812b-5v-5m', type:'strip', name:'WS2812B RGB 5m', subtitle:'60 LED/m · 5V · IP65', price:249, specs:['WS2812B','RGB','5V','60 LED/m','5 m','IP65'], description:'Opción de entrada para proyectos WLED con gran disponibilidad de efectos y accesorios.'},
  {id:'gledopto-zigbee', type:'controller', name:'GLEDOPTO Zigbee 3.0 Pro', subtitle:'GL-C-008P', price:399, specs:['Zigbee 3.0','GLEDOPTO','GL-C-008P'], description:'Controlador orientado a integración con ecosistemas de automatización compatibles.'},
  {id:'gledopto-wled-esp32', type:'controller', name:'GLEDOPTO WLED ESP32 WiFi', subtitle:'GL-C-103P', price:479, specs:['ESP32','WiFi','WLED','GL-C-103P'], description:'Controlador WiFi para proyectos direccionables basados en WLED.'},
  {id:'gledopto-mini-wled', type:'controller', name:'GLEDOPTO Mini WLED Controller', subtitle:'Compacto · WiFi', price:269, specs:['WLED','WiFi','GLEDOPTO'], description:'Controlador compacto para proyectos pequeños y kits de inicio.'},
  {id:'ps-5v-15a', type:'power', name:'Fuente Conmutada 5V 15A', subtitle:'75W', price:269, specs:['5V','15A','75W'], description:'Fuente para proyectos de 5V con demanda elevada.'},
  {id:'ps-12v-5a-slim', type:'power', name:'Fuente Slim 12V 5A', subtitle:'60W', price:169, specs:['12V','5A','60W','Slim'], description:'Formato delgado para proyectos WS2815 y otras cargas de 12V.'},
  {id:'ps-5v-10a', type:'power', name:'Fuente Conmutada 5V 10A', subtitle:'50W', price:179, specs:['5V','10A','50W'], description:'Fuente compacta para kits 5V de menor escala.'},
  {id:'cable-jst', type:'accessory', name:'Kit cable cobre 20AWG + conectores JST', subtitle:'Accesorios de instalación', price:99, specs:['20AWG','Cobre','JST'], description:'Kit base de cableado y conexiones para proyectos PixelLab.'}
];

window.PIXELLAB_KITS = [
  {id:'kit-architectural', name:'Architectural White & Color', badge:'RGBW', price:1090, market:1890, components:['SK6812 RGBW 5m','GLEDOPTO Zigbee 3.0 Pro','Fuente 5V 15A','Cable 20AWG + JST'], copy:'RGBW para ambientación y color con control inteligente.'},
  {id:'kit-pro-longrun', name:'Pro Long-Run 12V', badge:'12V', price:990, market:1690, components:['WS2815 RGB 12V 5m','GLEDOPTO WLED ESP32','Fuente 12V 5A Slim','Cable 20AWG'], copy:'Configuración orientada a recorridos de 12V.'},
  {id:'kit-starter-gamer', name:'Starter Gamer Volumétrico', badge:'STARTER', price:649, market:1190, components:['WS2812B RGB 5m','GLEDOPTO Mini WLED','Fuente 5V 10A','Cable 20AWG + JST'], copy:'Punto de entrada a WLED con un kit completo.'}
];

window.PIXELLAB_DEFAULTS = {
  currentByMeter:{'sk6812-rgbw-5m':3.6,'ws2812b-5v-5m':3.6,'ws2815-12v-5m':1.2},
  safetyFactor:1.25,
  defaultPowerReserve:0.2
};
