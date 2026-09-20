const products = window.PIXELLAB_PRODUCTS || [];
const kits = window.PIXELLAB_KITS || [];
const defaults = window.PIXELLAB_DEFAULTS;
let cart = JSON.parse(localStorage.getItem('pixellab-cart') || '[]');
let selectedUse = 'desk';

const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n);
const product = id => products.find(x=>x.id===id);

function visual(type){
  if(type==='strip') return '<div class="glow-strip"></div>';
  if(type==='controller') return '<div class="chip"></div>';
  if(type==='power') return '<div class="power-box"></div>';
  return '<div class="chip"></div>';
}
function renderProducts(filter='all'){
  const grid = document.getElementById('productGrid');
  const list = filter==='all' ? products : products.filter(p=>p.type===filter);
  grid.innerHTML=list.map(p=>`<article class="product"><div class="product-visual">${visual(p.type)}</div><h3>${p.name}</h3><p>${p.subtitle}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}">Agregar</button></div></article>`).join('');
}
function renderKits(){
 document.getElementById('kitGrid').innerHTML=kits.map((k,i)=>`<article class="kit ${i===0?'featured':''}"><span class="kit-badge">${k.badge}</span><h3>${k.name}</h3><p>${k.copy}</p><ul>${k.components.map(c=>`<li>${c}</li>`).join('')}</ul><div class="kit-price">${money(k.price)}</div><div class="market">Referencia: ${money(k.market)}</div><div class="modal-actions"><button class="btn" data-kit="${k.id}">Ver kit</button><button class="btn primary" data-kit-add="${k.id}">Agregar kit</button></div></article>`).join('');
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
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('overlay').classList.remove('open')}
function openProduct(id){const p=product(id);if(!p)return;document.getElementById('modalBody').innerHTML=`<span class="eyebrow">${p.type}</span><h2>${p.name}</h2><p>${p.description}</p><div class="specs">${p.specs.map(s=>`<span class="spec">${s}</span>`).join('')}</div><div class="modal-price">${money(p.price)}</div><div class="modal-actions"><button class="btn primary" data-modal-add="${p.id}">Agregar al carrito</button><button class="btn" onclick="location.hash='configurador';closeModal()">Configurar proyecto</button></div>`;document.getElementById('productModal').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeModal(){document.getElementById('productModal').classList.remove('open');document.getElementById('overlay').classList.remove('open')}

function calculate(){
 const id=document.getElementById('stripSelect').value;const len=Number(document.getElementById('lengthInput').value||0);const brightness=Number(document.getElementById('brightnessInput').value||100);const ampsPerM=defaults.currentByMeter[id]||3.6;const amps=ampsPerM*len*(brightness/100);const recommended=amps*defaults.safetyFactor;const watts=amps*(id.includes('12v')?12:5);const voltage=id.includes('12v')?12:5;const sourceA=Math.ceil(recommended);const sourceW=Math.ceil(watts*defaults.safetyFactor);const needsInjection=voltage===5 ? len>3 : len>5;const strip=product(id);
 document.getElementById('builderResult').innerHTML=`<div class="mini-label">RESULTADO PRELIMINAR</div><h3>${strip.name} · ${len} m</h3><div class="result-grid"><div class="metric"><span>Corriente estimada</span><strong>${amps.toFixed(1)} A</strong></div><div class="metric"><span>Potencia estimada</span><strong>${watts.toFixed(0)} W</strong></div><div class="metric"><span>Fuente sugerida</span><strong>${voltage}V / ${sourceA}A</strong></div><div class="metric"><span>Inyección</span><strong>${needsInjection?'Revisar':'Según instalación'}</strong></div></div><div class="result-actions"><button class="btn primary" id="addRecommended">Agregar producto</button><span style="color:#aaa;font-size:13px">Este cálculo es orientativo; la versión final debe considerar cableado, fusible, longitud de alimentación y condiciones de instalación.</span></div>`;
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
  box.innerHTML=`<div class="calc-panel"><h3>Comparador de tiras</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px">Producto</th><th>Voltaje</th><th>Densidad</th><th>Tipo</th><th>Precio</th></tr></thead><tbody>${products.filter(p=>p.type==='strip').map(p=>`<tr><td style="padding:10px">${p.name}</td><td>${p.specs[2]}</td><td>${p.specs[3]}</td><td>${p.specs[1]}</td><td>${money(p.price)}</td></tr>`).join('')}</tbody></table></div></div>`;
 } else if(tool==='power'){
  box.innerHTML=`<div class="calc-panel"><h3>Calculadora de potencia</h3><div class="calc-form"><label>Tira<select id="calcStrip">${products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Longitud (m)<input id="calcLen" type="number" value="5" min="0.5" step="0.5"></label><label>Brillo máximo (%)<input id="calcBright" type="number" value="80" min="20" max="100"></label></div><div class="calc-output" id="calcOutput"></div></div>`;
  const recalc=()=>{const p=document.getElementById('calcStrip').value;const l=+document.getElementById('calcLen').value;const b=+document.getElementById('calcBright').value;const a=(defaults.currentByMeter[p]||3.6)*l*b/100;const v=p.includes('12v')?12:5;document.getElementById('calcOutput').innerHTML=`<div class="metric"><span>Corriente</span><strong>${a.toFixed(1)} A</strong></div><div class="metric"><span>Potencia</span><strong>${(a*v).toFixed(0)} W</strong></div><div class="metric"><span>Fuente con margen 25%</span><strong>${v}V / ${Math.ceil(a*1.25)}A</strong></div>`};
  ['calcStrip','calcLen','calcBright'].forEach(id=>box.querySelector('#'+id).addEventListener('input',recalc));recalc();
 } else {
  box.innerHTML=`<div class="calc-panel"><h3>Caída de voltaje — módulo inicial</h3><p style="color:#aaa">La versión siguiente incorporará resistencia por calibre, longitud, corriente y puntos de inyección. Dejamos la interfaz preparada para conectar la fórmula final.</p></div>`;
 }
 box.scrollIntoView({behavior:'smooth',block:'center'});
}

document.addEventListener('click',e=>{
 if(e.target.matches('[data-add]')){openProduct(e.target.dataset.add)}
 if(e.target.matches('[data-modal-add]')){cartAdd(e.target.dataset.modalAdd);closeModal();openCart()}
 if(e.target.matches('[data-remove]')){cart.splice(+e.target.dataset.remove,1);persistCart();renderCart()}
 if(e.target.matches('[data-kit-add]')){kitAdd(e.target.dataset.kitAdd);openCart()}
 if(e.target.matches('[data-kit]')){const k=kits.find(x=>x.id===e.target.dataset.kit);if(k)openProductLikeKit(k)}
 if(e.target.matches('[data-tool]'))openTool(e.target.dataset.tool)
});
function openProductLikeKit(k){document.getElementById('modalBody').innerHTML=`<span class="eyebrow">Kit Ready-to-Go</span><h2>${k.name}</h2><p>${k.copy}</p><ul>${k.components.map(c=>`<li>${c}</li>`).join('')}</ul><div class="modal-price">${money(k.price)}</div><div class="modal-actions"><button class="btn primary" data-kit-add="${k.id}">Agregar kit</button></div>`;document.getElementById('productModal').classList.add('open');document.getElementById('overlay').classList.add('open')}

document.querySelectorAll('.pill').forEach(p=>p.addEventListener('click',()=>{document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));p.classList.add('active');renderProducts(p.dataset.filter)}));
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;document.getElementById('closeModal').onclick=closeModal;document.getElementById('overlay').onclick=()=>{closeCart();closeModal()};document.getElementById('showAll').onclick=()=>{document.querySelector('[data-filter="all"]').click()};document.getElementById('searchBtn').onclick=()=>document.getElementById('tienda').scrollIntoView({behavior:'smooth'});document.getElementById('checkoutBtn').onclick=()=>alert('Checkout pendiente de conectar. En la siguiente fase conectaremos pago, envío y retiro en Coyoacán.');
renderProducts();renderKits();renderCart();initBuilder();
