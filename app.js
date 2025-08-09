// Pocket Patch - a tiny garden game
const garden = document.getElementById('garden');
const msg = document.getElementById('msg');
const plantBtn = document.getElementById('plantBtn');
const waterBtn = document.getElementById('waterBtn');
const harvestBtn = document.getElementById('harvestBtn');

let plots = Array.from({length:9}, (_,i)=>({state:'empty', timer:0}));
function render(){
  garden.innerHTML = '';
  plots.forEach((p,idx)=>{
    const el = document.createElement('div'); el.className='plot';
    if(p.state==='empty') el.innerHTML = '<div>Empty</div>';
    else if(p.state==='seed') el.innerHTML = '<div class="seed">🌱</div><div>seed</div>';
    else if(p.state==='sapling') el.innerHTML = '<div class="sapling">🌿</div><div>growing</div>';
    else if(p.state==='flower') el.innerHTML = '<div class="flower">🌸</div><div>flower</div>';
    el.addEventListener('click', ()=>togglePlot(idx));
    garden.appendChild(el);
  });
}
function togglePlot(i){
  const p = plots[i];
  if(p.state==='empty') { p.state='seed'; p.timer=0; msg.textContent='Seed planted! Tap Water to help it grow.'; }
  else if(p.state==='flower'){ msg.textContent='This plot is ready to harvest.'}
  else { msg.textContent='Keep watering to grow your plant.'}
  render();
}
plantBtn.onclick = ()=> {
  const empty = plots.find(p=>p.state==='empty');
  if(!empty){ msg.textContent='No empty plots — harvest first!'; return;}
  empty.state='seed'; empty.timer=0; render(); msg.textContent='Seed planted 🌱';
}
waterBtn.onclick = ()=> {
  plots.forEach(p=>{ if(p.state==='seed') p.timer+=1; else if(p.state==='sapling') p.timer+=1;});
  // evolve
  plots.forEach(p=>{
    if(p.state==='seed' && p.timer>=2) p.state='sapling';
    else if(p.state==='sapling' && p.timer>=4) p.state='flower';
  });
  render();
  msg.textContent='You watered the garden 💧';
}
harvestBtn.onclick = ()=> {
  let gained = 0;
  plots.forEach(p=>{ if(p.state==='flower'){ gained++; p.state='empty'; p.timer=0;}});
  if(gained) msg.textContent=`You harvested ${gained} flower(s)! Use them to decorate your garden.`;
  else msg.textContent='No flowers to harvest yet.';
  render();
}

// simple auto-timer to progress a bit even offline
setInterval(()=>{
  plots.forEach(p=>{
    if(p.state==='seed' || p.state==='sapling'){ p.timer+=1; }
    if(p.state==='seed' && p.timer>=6) p.state='sapling';
    if(p.state==='sapling' && p.timer>=12) p.state='flower';
  });
  render();
}, 60000); // every 60s

render();
