const products = window.LUMICORE_PRODUCTS || [];
const kits = window.LUMICORE_KITS || [];
const defaults = window.LUMICORE_DEFAULTS || {};
let cart = JSON.parse(localStorage.getItem('lumicore-cart') || '[]');
let selectedUse = 'desk';

const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2}).format(Number(n)||0);
const product = id => products.find(x=>x.id===id);
const num = (id,f=0)=>Math.max(0,Number(document.getElementById(id)?.value ?? f)||0);

function imageFor(p){return p?.images?.[0] || ''}
function gallery(p){return (p.images||[]).map((src,i)=>`<img class="thumb ${i===0?'active':''}" data-src="${src}" src="${src}" alt="${p.name} ${i+1}" loading="lazy" decoding="async">`).join('')}
function thumbFor(src){return src ? src.replace(/\/([^/]+)$/, '/thumbs/$1') : '';}
function cardImage(p){const src=imageFor(p), thumb=thumbFor(src); return src ? `<img src="${thumb}" data-full="${src}" alt="${p.name}" loading="lazy" decoding="async" width="900" height="700">` : `<div class="visual-fallback"><span>${p.type==='strip'?'LED':'P'}</span></div>`;}

function renderProducts(filter='all'){
  const grid=document.getElementById('productGrid');
  const list=filter==='all'?products:products.filter(p=>p.type===filter);
  grid.innerHTML=list.map(p=>`<article class="product-card">
    <button class="product-image" data-open-product="${p.id}" aria-label="Ver ${p.name}">${cardImage(p)}<span class="product-badge">${p.type==='strip'?'TIRA LED':p.type==='controller'?'CONTROLADOR':p.type==='power'?'FUENTE':'ACCESORIO'}</span></button>
    <div class="product-body"><div class="product-kicker">${p.tags?.slice(0,2).join(' · ')||''}</div><h3>${p.name}</h3><p>${p.subtitle}</p><div class="product-bottom"><strong>${money(p.price)}</strong><div class="product-actions"><button class="ghost small" data-open-product="${p.id}">Detalles</button><button class="add" data-add="${p.id}">Agregar</button></div></div></div>
  </article>`).join('');
}
function renderKits(){
  document.getElementById('kitGrid').innerHTML=kits.map((k,i)=>{
    const imgs=(k.componentImages||[]).map(([label,src])=>src?`<div class="kit-component-photo"><img src="${src}" alt="${label} del kit ${k.name}" loading="lazy" decoding="async"><span>${label}</span></div>`:`<div class="kit-component-photo pending"><div>Foto pendiente</div><span>${label}</span></div>`).join('');
    return `<article class="kit-card ${i===0?'featured':''}"><div class="kit-top"><span class="pill-tag">${k.badge}</span><span class="save">Ahorra ${money(k.market-k.price)}</span></div><div class="kit-component-grid">${imgs}</div><h3>${k.name}</h3><p>${k.copy}</p><ul>${k.components.map(c=>`<li>${c}</li>`).join('')}</ul><div class="kit-price"><strong>${money(k.price)}</strong><span>vs ${money(k.market)}</span></div><div class="kit-actions"><button class="ghost small" data-kit="${k.id}">Ver kit</button><button class="btn primary" data-kit-add="${k.id}">Agregar kit</button></div></article>`;
  }).join('');
}
function persistCart(){localStorage.setItem('lumicore-cart',JSON.stringify(cart));document.getElementById('cartCount').textContent=cart.reduce((a,x)=>a+x.qty,0)}
function cartAdd(id,qty=1){const existing=cart.find(x=>x.id===id&&!x.kit); if(existing) existing.qty+=qty; else cart.push({id,qty});persistCart();renderCart()}
function kitAdd(id){const k=kits.find(x=>x.id===id); if(!k)return; cart.push({id:`kit:${k.id}`,qty:1,kit:k});persistCart();renderCart();}
function renderCart(){
 const box=document.getElementById('cartItems');
 if(!cart.length){box.innerHTML='<div class="empty-cart">Tu carrito está vacío.</div>';document.getElementById('cartTotal').textContent=money(0);return}
 let total=0; box.innerHTML=cart.map((item,i)=>{const p=item.kit||product(item.id);const t=p.price*item.qty;total+=t;return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} × ${item.qty}</small></div><button class="text-btn" data-remove="${i}">Eliminar</button></div>`}).join('');document.getElementById('cartTotal').textContent=money(total)
}
function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open'); if(!document.getElementById('productModal').classList.contains('open'))document.getElementById('overlay').classList.remove('open')}
function openProduct(id){
 const p=product(id); if(!p)return;
 document.getElementById('modalBody').innerHTML=`<div class="modal-layout"><div><div class="modal-gallery-main"><img id="modalMainImage" src="${p.images?.[0]||''}" alt="${p.name}" width="1200" height="900"></div><div class="thumb-row">${gallery(p)}</div></div><div><div class="product-kicker">${p.type.toUpperCase()}</div><h2>${p.name}</h2><p class="modal-description">${p.description}</p><div class="specs">${p.specs.map(s=>`<span>${s}</span>`).join('')}</div>${p.technical?`<div class="technical-mini"><strong>Datos técnicos</strong><div>${Object.entries(p.technical).map(([k,v])=>`<span><b>${k}</b> ${v}</span>`).join('')}</div></div>`:''}<div class="modal-price">${money(p.price)}</div><div class="modal-actions"><button class="btn primary" data-modal-add="${p.id}">Agregar al carrito</button><a class="btn secondary" href="https://wa.me/525638944059?text=${encodeURIComponent('Hola LumiCore, me interesa '+p.name)}" target="_blank" rel="noopener">Consultar por WhatsApp</a></div></div></div>`;
 document.getElementById('productModal').classList.add('open');document.getElementById('overlay').classList.add('open')
}
function closeModal(){document.getElementById('productModal').classList.remove('open');if(!document.getElementById('cartDrawer').classList.contains('open'))document.getElementById('overlay').classList.remove('open')}

function voltageOf(id){return product(id)?.technical?.voltage || (id.includes('12v')?12:5)}
function currentPerMeter(id,density=60){const p=product(id);const base=p?.technical?.currentPerMeter ?? defaults.currentByMeter?.[id] ?? 3.6; return base*(density/(p?.technical?.ledPerMeter||60))}
function sourceRecommendation(voltage,current){const ampsNeeded=current*(defaults.safetyFactor||1.25);const common=voltage===5?[5,6,10,12,15,20,25,30,40]:[2,3,5,6,8,10,15,20];const amps=common.find(a=>a>=ampsNeeded)||Math.ceil(ampsNeeded);return {amps,watts:amps*voltage}}
function fuseRecommendation(current){const target=current*1.25;const standard=[2,3,5,7.5,10,12,15,20,25,30,40,50,60];return standard.find(x=>x>=target)||Math.ceil(target)}
function wireRecommendation(current){if(current<=3)return '20 AWG';if(current<=5)return '18 AWG';if(current<=10)return '16 AWG';if(current<=20)return '14 AWG';return '12 AWG o mayor'}
function calculateBuilder(){
 const id=document.getElementById('stripSelect').value; const len=Math.max(.1,num('lengthInput',5)); const brightness=Math.min(100,Math.max(1,num('brightnessInput',80))); const p=product(id); if(!p)return;
 const density=p.technical?.ledPerMeter||60; const amps=currentPerMeter(id,density)*len*(brightness/100); const voltage=voltageOf(id); const watts=amps*voltage; const source=sourceRecommendation(voltage,amps); const fuse=fuseRecommendation(amps); const injection=voltage===5?Math.max(2,Math.ceil(len/2)):Math.max(1,Math.ceil(len/5));
 document.getElementById('builderResult').innerHTML=`<div class="result-kicker">RESULTADO PRELIMINAR</div><h3>${p.name} · ${len} m</h3><div class="result-grid"><div><span>Corriente</span><strong>${amps.toFixed(1)} A</strong></div><div><span>Potencia</span><strong>${watts.toFixed(0)} W</strong></div><div><span>Fuente sugerida</span><strong>${voltage}V / ${source.amps}A</strong></div><div><span>Fusible orientativo</span><strong>${fuse} A</strong></div></div><div class="result-note">Cable orientativo: ${wireRecommendation(amps)} · alimentación/inyección a revisar: ${injection} punto(s). El diseño final debe validarse según recorrido, temperatura, cableado y condiciones reales.</div><button class="btn primary" id="addRecommended">Agregar tira al carrito</button>`;
 document.getElementById('addRecommended').onclick=()=>cartAdd(id)
}
function initBuilder(){const select=document.getElementById('stripSelect');select.innerHTML=products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name}</option>`).join('');document.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-use]').forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedUse=b.dataset.use});document.querySelector('[data-use="desk"]')?.classList.add('active');['stripSelect','lengthInput','brightnessInput'].forEach(id=>document.getElementById(id)?.addEventListener('input',calculateBuilder));calculateBuilder()}

function renderCalculator(kind){
 const root=document.getElementById('calculator');
 if(kind==='power') root.innerHTML=`<div class="calc-panel"><div class="calc-title"><div><span class="eyebrow">Power Calculator</span><h3>Calcula consumo, fuente y protección</h3></div><p>Parte de la especificación real de la tira y del uso esperado.</p></div><div class="calc-form"><label>Tira<select id="calcStrip">${products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Longitud (m)<input id="calcLen" type="number" min="0.5" value="5" step="0.5"></label><label>Brillo (%)<input id="calcBright" type="number" min="10" max="100" value="80"></label></div><div class="calc-output" id="powerOutput"></div></div>`;
 if(kind==='cost') root.innerHTML=`<div class="calc-panel"><div class="calc-title"><div><span class="eyebrow">Cost Estimator</span><h3>¿Cuánto cuesta operar tu iluminación?</h3></div><p>Estimación orientativa usando tu consumo y tarifa eléctrica.</p></div><div class="calc-form"><label>Tira<select id="costStrip">${products.filter(p=>p.type==='strip').map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select></label><label>Longitud (m)<input id="costLen" type="number" min="0.5" value="5" step="0.5"></label><label>Brillo medio (%)<input id="costBright" type="number" min="5" max="100" value="60"></label><label>Horas/día<input id="hours" type="number" min="0" max="24" value="5"></label><label>Tarifa MXN/kWh<input id="rate" type="number" min="0" step="0.01" value="2.25"></label></div><div class="calc-output" id="costOutput"></div></div>`;
 if(kind==='compare') root.innerHTML=`<div class="calc-panel"><div class="calc-title"><div><span class="eyebrow">Comparador</span><h3>Elige la tira según el proyecto</h3></div><p>Resumen de las tres tiras base del catálogo LumiCore.</p></div><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Producto</th><th>Voltaje</th><th>Densidad</th><th>Tipo</th><th>Uso</th></tr></thead><tbody>${products.filter(p=>p.type==='strip').map(p=>`<tr><td>${p.name}</td><td>${p.technical.voltage}V</td><td>${p.technical.ledPerMeter} LED/m</td><td>${p.technical.chipset}</td><td>${p.tags?.join(' · ')}</td></tr>`).join('')}</tbody></table></div></div>`;
 if(kind==='voltage') root.innerHTML=`<div class="calc-panel"><div class="calc-title"><div><span class="eyebrow">Voltage Drop</span><h3>Revisa caída de voltaje</h3></div><p>Calculadora orientativa para el circuito de alimentación.</p></div><div class="calc-form"><label>Voltaje<select id="vdVoltage"><option>5</option><option>12</option><option>24</option></select></label><label>Corriente (A)<input id="vdCurrent" type="number" value="8" step="0.1"></label><label>Longitud ida (m)<input id="vdLength" type="number" value="5" step="0.5"></label><label>Calibre<select id="vdAwg"><option value="20">20 AWG</option><option value="18">18 AWG</option><option value="16" selected>16 AWG</option><option value="14">14 AWG</option><option value="12">12 AWG</option></select></label></div><div class="calc-output" id="vdOutput"></div></div>`;

 if(kind==='power'){const fn=()=>{const id=document.getElementById('calcStrip').value,l=num('calcLen',5),b=Math.min(100,num('calcBright',80)),p=product(id),v=voltageOf(id),a=currentPerMeter(id,p.technical.ledPerMeter)*l*(b/100),w=a*v,s=sourceRecommendation(v,a),f=fuseRecommendation(a);document.getElementById('powerOutput').innerHTML=`<div><span>LEDs totales</span><strong>${Math.round((p.technical.ledPerMeter||60)*l)}</strong></div><div><span>Potencia estimada</span><strong>${w.toFixed(0)} W</strong></div><div><span>Fuente sugerida</span><strong>${v}V / ${s.amps}A</strong></div><div><span>Fusible orientativo</span><strong>${f} A</strong></div><div class="wide-note">A 100% de brillo esta misma configuración demandaría aprox. ${(currentPerMeter(id,p.technical.ledPerMeter)*l*v).toFixed(0)} W según el modelo del catálogo. Utiliza el resultado como dimensionamiento preliminar.</div>`};['calcStrip','calcLen','calcBright'].forEach(x=>document.getElementById(x).addEventListener('input',fn));fn()}
 if(kind==='cost'){const fn=()=>{const id=document.getElementById('costStrip').value,l=num('costLen',5),b=Math.min(100,num('costBright',60)),h=num('hours',5),r=num('rate',2.25),p=product(id),v=voltageOf(id),a=currentPerMeter(id,p.technical.ledPerMeter)*l*(b/100),w=a*v/1000,kwhDay=w*h,kwhMonth=kwhDay*30,kwhYear=kwhDay*365;document.getElementById('costOutput').innerHTML=`<div><span>Consumo medio</span><strong>${w.toFixed(2)} kW</strong></div><div><span>Costo diario</span><strong>${money(kwhDay*r)}</strong></div><div><span>Costo mensual</span><strong>${money(kwhMonth*r)}</strong></div><div><span>Costo anual</span><strong>${money(kwhYear*r)}</strong></div><div class="wide-note">Tarifa editable: ${money(r)}/kWh · ${h} h/día · ${b}% de brillo medio.</div>`};['costStrip','costLen','costBright','hours','rate'].forEach(x=>document.getElementById(x).addEventListener('input',fn));fn()}
 if(kind==='voltage'){const fn=()=>{const v=num('vdVoltage',5),a=num('vdCurrent',8),l=num('vdLength',5),awg=num('vdAwg',16),ohm={20:.0339,18:.0214,16:.0135,14:.00845,12:.00531}[awg]||.0135,drop=a*(ohm*(l*2)),pct=(drop/v)*100;document.getElementById('vdOutput').innerHTML=`<div><span>Caída estimada</span><strong>${drop.toFixed(2)} V</strong></div><div><span>Porcentaje</span><strong>${pct.toFixed(1)}%</strong></div><div><span>Voltaje final</span><strong>${Math.max(0,v-drop).toFixed(2)} V</strong></div><div class="wide-note">Modelo resistivo orientativo con ida y regreso. Con corrientes altas o recorridos largos, revisa inyección y conductor real.</div>`};['vdVoltage','vdCurrent','vdLength','vdAwg'].forEach(x=>document.getElementById(x).addEventListener('input',fn));fn()}
}

function initHeroVideo(){
 const frame=document.querySelector('.hero-video-media iframe[data-src]');
 const hero=document.querySelector('.hero-video');
 if(!frame||!hero)return;
 const load=()=>{if(frame.src)return; frame.src=frame.dataset.src; frame.addEventListener('load',()=>{frame.classList.add('is-loaded');hero.classList.add('has-video')},{once:true});};
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const saveData=navigator.connection?.saveData;
 if(reduced||saveData)return;
 const delay=window.matchMedia('(max-width:640px)').matches?1800:900;
 window.setTimeout(load,delay);
}

function setup(){
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.filter)});
 document.getElementById('showAll').onclick=()=>{document.querySelector('[data-filter="all"]')?.click();location.hash='tienda'};
 document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=closeCart;document.getElementById('overlay').onclick=()=>{closeCart();closeModal()};document.getElementById('closeModal').onclick=closeModal;
 document.getElementById('checkoutBtn').onclick=()=>{window.open('https://wa.me/525638944059?text='+encodeURIComponent('Hola LumiCore, quiero finalizar mi pedido. Mi carrito es: '+cart.map(x=>(x.kit?.name||product(x.id)?.name)+' x '+x.qty).join(', ')),'_blank')};
 document.body.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add)cartAdd(add.dataset.add);const rm=e.target.closest('[data-remove]');if(rm){cart.splice(Number(rm.dataset.remove),1);persistCart();renderCart()}const op=e.target.closest('[data-open-product]');if(op)openProduct(op.dataset.openProduct);const ma=e.target.closest('[data-modal-add]');if(ma)cartAdd(ma.dataset.modalAdd);const ka=e.target.closest('[data-kit-add]');if(ka)kitAdd(ka.dataset.kitAdd);const kv=e.target.closest('[data-kit]');if(kv){const k=kits.find(x=>x.id===kv.dataset.kit);if(k)openKit(k)}const th=e.target.closest('.thumb');if(th){const m=document.getElementById('modalMainImage');if(m)m.src=th.dataset.src;document.querySelectorAll('.thumb').forEach(x=>x.classList.remove('active'));th.classList.add('active')}});
 document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{renderCalculator(b.dataset.tool);document.getElementById('calculator').scrollIntoView({behavior:'smooth',block:'start'})});
 document.getElementById('searchBtn').onclick=()=>document.getElementById('searchPanel').classList.toggle('open');
 initBuilder();renderProducts();renderKits();renderCart();initHeroVideo();
}
function openKit(k){const photos=(k.componentImages||[]).map(([label,src])=>src?`<div class="kit-modal-photo"><img src="${src}" alt="${label} del kit ${k.name}" loading="lazy" decoding="async"><span>${label}</span></div>`:`<div class="kit-modal-photo pending"><div>Fotografía del componente por añadir</div><span>${label}</span></div>`).join('');document.getElementById('modalBody').innerHTML=`<div class="product-kicker">KIT READY-TO-GO</div><h2>${k.name}</h2><p class="modal-description">${k.copy}</p><div class="kit-modal-photos">${photos}</div><div class="kit-modal-list">${k.components.map(c=>`<div>${c}</div>`).join('')}</div><div class="modal-price">${money(k.price)}</div><div class="modal-actions"><button class="btn primary" data-kit-add="${k.id}">Agregar kit</button><a class="btn secondary" href="https://wa.me/525638944059?text=${encodeURIComponent('Hola LumiCore, me interesa el kit '+k.name)}" target="_blank" rel="noopener">Consultar</a></div>`;document.getElementById('productModal').classList.add('open');document.getElementById('overlay').classList.add('open')}

setup();
