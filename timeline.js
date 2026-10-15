(()=>{'use strict';
const page=document.body,cards=[...document.querySelectorAll('[data-era-card]')],nodes=[...document.querySelectorAll('.axis-node')];
const positions={prehistoric:0,'ww2':1,modern:2};
const transitionDuration={prehistoric:6650,ww2:4050,modern:3900};
const transitionCopy={prehistoric:['DEEP TIME AWAKENS','THE CLOCK REWINDS · STONE FORMS · THE OLD FACE CRUMBLES'],ww2:['CHRONICLE UNDER FIRE','REWIND · FIVE IMPACTS · CHRONOMETER SHATTERED'],modern:['SYSTEM REBOOT','2025 · TEMPORAL CODE RECOMPILED']};
cards.forEach(card=>{
  card.addEventListener('mouseenter',()=>nodes.forEach((node,i)=>node.classList.toggle('is-lit',i===positions[card.dataset.eraCard])));
  card.addEventListener('mouseleave',()=>nodes.forEach(node=>node.classList.remove('is-lit')));
  card.addEventListener('focus',()=>nodes.forEach((node,i)=>node.classList.toggle('is-lit',i===positions[card.dataset.eraCard])));
  card.addEventListener('blur',()=>nodes.forEach(node=>node.classList.remove('is-lit')));
  card.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    const destination=card.href;
    page.dataset.transition=card.dataset.eraCard;
    const [title,subtitle]=transitionCopy[card.dataset.eraCard]||['TIME FRACTURE','CHRONICLE GATE · INITIALIZING'];
    document.getElementById('transitionTitle').textContent=title;
    document.getElementById('transitionSubtitle').textContent=subtitle;
    card.classList.add('is-selected');
    page.classList.add('is-entering');
    const delay=window.matchMedia('(prefers-reduced-motion: reduce)').matches?350:transitionDuration[card.dataset.eraCard]||3000;
    window.setTimeout(()=>window.location.assign(destination),delay);
  });
});
})();
