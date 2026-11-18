const products = window.PIXELLAB_PRODUCTS || [];
const kits = window.PIXELLAB_KITS || [];
const defaults = window.PIXELLAB_DEFAULTS || {};
let cart = JSON.parse(localStorage.getItem('pixellab-cart') || '[]');
let selectedUse = 'desk';

const money = n => new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN', maximumFractionDigits:2}).format(Number(n) || 0);
const product = id => products.find(x => x.id === id);
const num = (id, fallback=0) => Math.max(0, Number(document.getElementById(id)?.value ?? fallback) || 0);

function visual(type){
  if(type==='strip') return '<div class="glow-strip"></div>';
  if(type==='controller') return '<div class="chip"></div>';
  if(type==='power') return '<div class="power-box"></div>';
  return '<div class="chip"></div>';
}
function renderProducts(filter='all'){
  const grid = document.getElementById('productGrid');
  const list = filter==='all' ? products : products.filter(p=>p.type===filter);
  grid.innerHTML = list.map(p=>`<article class="product"><div class="product-visual">${visual(p.type)}</div><h3>${p.name}</h3><p>${p.subtitle}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">Agregar</button></div></article>`).join('');
}
function renderKits(){
 document.getElementById('kitGrid').innerHTML = kits.map((k,i)=>`<article class="kit ${i===0?'featured':''}"><span class="kit-badge">${k.badge}</span><h3>${k.name}</h3><p>${k.copy}</p><ul>${k.components.map(c=>`<li>${c}</li>`).join('')}</ul><div class="kit-price">${money(k.price)}</div><div class="market">Referencia: ${money(k.market)}</div><div class="modal-actions"><button class="btn" data-kit="${k.id}">Ver kit</button><button class="btn primary" data-kit-add="${k.id}">Agregar kit</button></div></article>`).join('');
}
function cartAdd(id, qty=1){cart.push({id,qty});persistCart();renderCart();}
function kitAdd(id){const k=kits.find(x=>x.id===id); if(!k)return; cart.push({id:`kit:${k.id}`,qty:1,kit:k});persistCart();renderCart();}
function persistCart(){localStorage.setItem('pixellab-cart',JSON.stringify(cart));document.getElementById('cartCount').textContent=cart.reduce((a,x)=>a+x.qty,0)}
function renderCart(){
 const box=document.getElementById('cartItems');
 if(!cart.length){box.innerHTML='<p style="color:#777">Tu carrito está vacío.</p>';document.getElementById('cartTotal').textContent=money(0);return}
 let total=0;
 box.innerHTML=cart.map((item,i)=>{const p=item.kit||product(item.id);const t=p.price*item.qty;total+=t;return `<div class="cart-row"><div><strong>${p.name}</strong><br><small>${money(p.price)} × ${item.qty}</small></div><button class="text-btn" data-remove="${i}">Eliminar</button></div>`}).join('');
 document.getElementById('cartTotal').textContent=money(total);
}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');if(!document.getElementById('productModal').classList.contains('open'))document.getElementById('overlay').classList.remove('open')}
function openProduct(id){const p=product(id);if(!p)return;document.getElementById('modalBody').innerHTML=`<span class="eyebrow">${p.type}</span><h2>${p.name}</h2><p>${p.description}</p><div class="specs">${p.specs.map(s=>`<span class="spec">${s}</span>`).join('')}</div><div class="modal-price">${money(p.price)}</div><div class="modal-actions"><button class="btn primary" data-modal-add="${p.id}">Agregar al carrito</button><button class="btn" onclick="location.hash='configurador';closeModal()">Configurar proyecto</button></div>`;document.getElementById('productModal').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeModal(){document.getElementById('productModal').classList.remove('open');if(!document.getElementById('cartDrawer').classList.contains('open'))document.getElementById('overlay').classList.remove('open')}

function voltageOf(id){return id.includes('12v') ? 12 : 5;}
function currentPerMeter(id, density){
  const base = defaults.currentByMeter?.[id] ?? 3.6;
  const baseDensity = 60;
  return base * (density / baseDensity);
}
function sourceRecommendation(voltage, current){
  const withMargin = current * 1.25;
  const amps = Math.max(1, Math.ceil(withMargin));
  const common = voltage===5 ? [5,6,10,12,15,20,25,30,40] : [2,3,5,6,8,10,15,20];
  const size = common.find(a=>a>=amps) || amps;
  return {amps:size, watts:size*voltage};
}
function fuseRecommendation(current){
  const target = current * 1.25;
  const standard = [2,3,5,7.5,10,12,15,20,25,30,40,50,60];
  return standard.find(x=>x>=target) || Math.ceil(target);
}
function wireRecommendation(current){
  if(current<=3) return '20 AWG';
  if(current<=5) return '18 AWG';
  if(current<=10) return '16 AWG';
  if(current<=20) return '14 AWG';
  return '12 AWG o mayor';
}

function calculate(){
 const id=document.getElementById('stripSelect').value;
 const len=Math.max(0.1,num('lengthInput',5));
 const brightness=Math.min(100,Math.max(1,num('brightnessInput',80)));
 const density=Number(product(id)?.density || 60);
 const amps= currentPerMeter(id,density)*len*(brightness/100);
 const voltage=voltageOf(id); const watts=amps*voltage;
 const source=sourceRecommendation(voltage,amps); const fuse=fuseRecommendation(amps);
 const injection=voltage===5 ? Math.ceil(len/2) : Math.max(1,Math.ceil(len/5));
 const strip=product(id);
 document.getElementById('builderResult').innerHTML=`<div class="mini-label">RESULTADO PRELIMINAR</div><h3>${strip.name} · ${len} m</h3><div class="result-grid"><div class="metric"><span>Corriente estimada</span><strong>${amps.toFixed(1)} A</strong></div><div class="metric"><span>Potencia estimada</span><strong>${watts.toFixed(0)} W</strong></div><div class="metric"><span>Fuente sugerida</span><strong>${voltage}V / ${source.amps}A</strong></div><div class="metric"><span>Protección base</span><strong>${fuse} A</strong></div></div><div class="result-actions"><button class="btn primary" id="addRecommended">Agregar tira</button><span class="result-note">Cable orientativo: ${wireRecommendation(amps)} · Puntos de alimentación a revisar: ${injection}. Para el diseño final hay que validar caída de voltaje, trazado y protección.</span></div>`;
 document.getElementById('addRecommended').onclick=()=>{cartAdd(id);openCart()};
}
function initBuilder(){
 const select=document.getElementById('stripSelect');select.innerHTML=products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name} — ${money(p.price)}</option>`).join('');
 document.querySelectorAll('#useOptions button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#useOptions button').forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedUse=b.dataset.use;calculate()}));
 document.querySelector('#useOptions button[data-use="desk"]').classList.add('active');
 ['stripSelect','lengthInput','brightnessInput'].forEach(id=>document.getElementById(id).addEventListener('input',calculate));calculate();
}

function openTool(tool){
 const box=document.getElementById('calculator');
 if(tool==='compare'){
  box.innerHTML=`<div class="calc-panel"><div class="calc-title-row"><div><span class="mini-label">REFERENCE</span><h3>Comparador de tiras</h3></div><p>Compara las opciones disponibles en PixelLab sin perderte en especificaciones.</p></div><div style="overflow:auto"><table class="data-table"><thead><tr><th>Producto</th><th>Voltaje</th><th>Densidad</th><th>Tipo</th><th>Precio</th></tr></thead><tbody>${products.filter(p=>p.type==='strip').map(p=>`<tr><td>${p.name}</td><td>${p.specs.find(s=>/V$/.test(s))||'-'}</td><td>${p.specs.find(s=>/LED\/m/.test(s))||'-'}</td><td>${p.specs[1]||'-'}</td><td>${money(p.price)}</td></tr>`).join('')}</tbody></table></div></div>`;
 } else if(tool==='power'){
  box.innerHTML=`<div class="calc-panel"><div class="calc-title-row"><div><span class="mini-label">PIXELLAB POWER TOOL</span><h3>Calculadora de potencia</h3></div><p>Usa el consumo teórico como máximo y un perfil de uso para estimar una fuente con margen.</p></div><div class="calc-form"><label>Tira<select id="calcStrip">${products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Densidad (LED/m)<select id="calcDensity"><option>30</option><option selected>60</option><option>144</option></select></label><label>Longitud (m)<input id="calcLen" type="number" value="5" min="0.1" step="0.5"></label><label>Brillo / uso medio (%)<input id="calcBright" type="number" value="70" min="1" max="100"></label><label>Consumo del controlador (W)<input id="calcCtrlW" type="number" value="1.5" min="0" step="0.1"></label><label><span>Limitador de corriente</span><span class="inline-check"><input id="calcLimitEnabled" type="checkbox"> Usar</span></label><label id="limitWrap" class="hidden-field">Límite (mA)<input id="calcLimit" type="number" value="10000" min="100" step="100"></label></div><div class="calc-output four" id="calcOutput"></div><div class="calc-explain" id="calcExplain"></div></div>`;
  const recalc=()=>{
    const id=document.getElementById('calcStrip').value; const p=product(id); const d=Number(document.getElementById('calcDensity').value); const l=num('calcLen',5); const b=Math.min(100,Math.max(1,num('calcBright',70))); const ctrl=num('calcCtrlW',1.5); const v=voltageOf(id);
    let a=currentPerMeter(id,d)*l*b/100; const peak=currentPerMeter(id,d)*l; const limitOn=document.getElementById('calcLimitEnabled').checked; const limit=limitOn?num('calcLimit',10000)/1000:Infinity; if(limitOn)a=Math.min(a,limit);
    const realisticW=a*v+ctrl; const peakW=peak*v+ctrl; const src=sourceRecommendation(v,a+ctrl/v); const fuse=fuseRecommendation(a+ctrl/v); const wire=wireRecommendation(a+ctrl/v);
    document.getElementById('limitWrap').classList.toggle('hidden-field',!limitOn);
    document.getElementById('calcOutput').innerHTML=`<div class="metric"><span>LEDs totales</span><strong>${Math.round(d*l).toLocaleString('es-MX')}</strong></div><div class="metric"><span>Pico teórico</span><strong>${peakW.toFixed(0)} W</strong></div><div class="metric"><span>Uso estimado</span><strong>${realisticW.toFixed(1)} W</strong></div><div class="metric"><span>Fuente sugerida</span><strong>${v}V / ${src.amps}A</strong></div><div class="metric"><span>Fusible orientativo</span><strong>${fuse} A</strong></div><div class="metric"><span>Cable base</span><strong>${wire}</strong></div>`;
    document.getElementById('calcExplain').innerHTML=`<strong>${p.name}</strong> · ${v}V · ${d} LED/m · ${l} m. El pico supone todos los canales al máximo. El uso estimado aplica el porcentaje que indicaste y suma aproximadamente ${ctrl.toFixed(1)} W para el controlador. <span>Las recomendaciones son orientativas; para instalaciones largas conviene verificar caída de voltaje y esquema de inyección.</span>`;
  };
  ['calcStrip','calcDensity','calcLen','calcBright','calcCtrlW','calcLimitEnabled','calcLimit'].forEach(id=>document.getElementById(id).addEventListener('input',recalc));recalc();
 } else if(tool==='cost'){
  box.innerHTML=`<div class="calc-panel"><div class="calc-title-row"><div><span class="mini-label">RUNNING COST</span><h3>Costo operativo</h3></div><p>Estima el costo eléctrico de tu instalación según uso real y la tarifa que pagas.</p></div><div class="calc-form"><label>Tira<select id="costStrip">${products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Densidad (LED/m)<select id="costDensity"><option>30</option><option selected>60</option><option>144</option></select></label><label>Longitud (m)<input id="costLen" type="number" value="5" min="0.1" step="0.5"></label><label>Brillo / uso medio (%)<input id="costBright" type="number" value="50" min="1" max="100"></label><label>Horas encendido / día<input id="costHours" type="number" value="6" min="0.1" max="24" step="0.5"></label><label>Tarifa eléctrica (MXN/kWh)<input id="costRate" type="number" value="2.50" min="0" step="0.01"></label></div><div class="calc-output four" id="costOutput"></div><div class="calc-explain"><strong>Consejo:</strong> sustituye la tarifa de ejemplo por la que aparece en tu recibo de CFE para obtener una proyección más cercana a tu caso. El consumo real depende del efecto y del color utilizado.</div></div>`;
  const recalc=()=>{
    const id=document.getElementById('costStrip').value; const d=Number(document.getElementById('costDensity').value); const l=num('costLen',5); const b=Math.min(100,Math.max(1,num('costBright',50))); const h=num('costHours',6); const rate=num('costRate',2.5); const v=voltageOf(id); const peakA=currentPerMeter(id,d)*l; const peakW=peakA*v; const realW=peakW*b/100; const kWhDay=realW*h/1000; const hour=realW/1000*rate; const day=kWhDay*rate; const month=day*30.4375; const year=day*365; const peakHour=peakW/1000*rate; const peakDay=peakHour*h;
    document.getElementById('costOutput').innerHTML=`<div class="metric"><span>Pico teórico</span><strong>${peakW.toFixed(0)} W</strong></div><div class="metric"><span>Consumo estimado</span><strong>${realW.toFixed(1)} W</strong></div><div class="metric"><span>Costo por hora</span><strong>${money(hour)}</strong></div><div class="metric"><span>Por día</span><strong>${money(day)}</strong></div><div class="metric"><span>Por mes</span><strong>${money(month)}</strong></div><div class="metric"><span>Por año</span><strong>${money(year)}</strong></div>`;
    document.getElementById('costOutput').insertAdjacentHTML('beforeend', `<div class="cost-peak"><span>Peor caso a potencia máxima: ${money(peakHour)}/h · ${money(peakDay)}/día · ${money(peakDay*30.4375)}/mes · ${money(peakDay*365)}/año.</span></div>`);
  };
  ['costStrip','costDensity','costLen','costBright','costHours','costRate'].forEach(id=>document.getElementById(id).addEventListener('input',recalc));recalc();
 } else {
  box.innerHTML=`<div class="calc-panel"><div class="calc-title-row"><div><span class="mini-label">ENGINEERING</span><h3>Caída de voltaje — módulo inicial</h3></div><p>El siguiente módulo añadirá resistencia por calibre, longitud, corriente, recorrido y puntos de inyección.</p></div><div class="calc-placeholder">Para instalaciones largas, la caída de voltaje debe revisarse además del cálculo de potencia. No compenses una caída excesiva aumentando el voltaje de una tira: usa la tensión nominal, mejor cableado y alimentación adicional cuando corresponda.</div></div>`;
 }
 box.scrollIntoView({behavior:'smooth',block:'center'});
}

document.addEventListener('click',e=>{
 if(e.target.matches('[data-add]')) openProduct(e.target.dataset.add);
 if(e.target.matches('[data-modal-add]')){cartAdd(e.target.dataset.modalAdd);closeModal();openCart()}
 if(e.target.matches('[data-remove]')){cart.splice(Number(e.target.dataset.remove),1);persistCart();renderCart()}
 if(e.target.matches('[data-kit-add]')){kitAdd(e.target.dataset.kitAdd);openCart()}
 if(e.target.matches('[data-kit]')){const k=kits.find(x=>x.id===e.target.dataset.kit);if(k)openProductLikeKit(k)}
 if(e.target.matches('[data-tool]')) openTool(e.target.dataset.tool)
});
function openProductLikeKit(k){document.getElementById('modalBody').innerHTML=`<span class="eyebrow">Kit Ready-to-Go</span><h2>${k.name}</h2><p>${k.copy}</p><ul>${k.components.map(c=>`<li>${c}</li>`).join('')}</ul><div class="modal-price">${money(k.price)}</div><div class="modal-actions"><button class="btn primary" data-kit-add="${k.id}">Agregar kit</button></div>`;document.getElementById('productModal').classList.add('open');document.getElementById('overlay').classList.add('open')}

document.querySelectorAll('.pill').forEach(p=>p.addEventListener('click',()=>{document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));p.classList.add('active');renderProducts(p.dataset.filter)}));
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;document.getElementById('closeModal').onclick=closeModal;document.getElementById('overlay').onclick=()=>{closeCart();closeModal()};document.getElementById('showAll').onclick=()=>{document.querySelector('[data-filter="all"]').click()};document.getElementById('searchBtn').onclick=()=>document.getElementById('tienda').scrollIntoView({behavior:'smooth'});document.getElementById('checkoutBtn').onclick=()=>alert('Checkout pendiente de conectar. En la siguiente fase conectaremos pago, envío y retiro en Coyoacán.');
renderProducts();renderKits();renderCart();initBuilder();
