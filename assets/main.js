document.getElementById('year').textContent=new Date().getFullYear();const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.09});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const slides=[...document.querySelectorAll('.slide')],dots=[...document.querySelectorAll('.slide-dots button')];if(slides.length){let current=0;function show(i){slides[current].classList.remove('is-active');dots[current].classList.remove('active');current=i;slides[current].classList.add('is-active');dots[current].classList.add('active')}dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>show((current+1)%slides.length),6200)}
/* Galerie popup : clic, navigation au clavier, miniatures et fermeture accessible. */
(function(){
 const items=[...document.querySelectorAll('[data-gallery-item]')];
 const modal=document.getElementById('gallery-lightbox');
 if(!items.length||!modal)return;
 const img=modal.querySelector('.lightbox-image'), caption=modal.querySelector('.lightbox-caption'),
 count=modal.querySelector('.lightbox-count'),strip=modal.querySelector('.lightbox-thumbnails'),
 close=modal.querySelector('.lightbox-close');
 let current=0,lastFocus=null;
 items.forEach((item,index)=>{
   const mini=document.createElement('button');mini.type='button';mini.className='lightbox-thumb';
   mini.setAttribute('aria-label','Afficher la photo '+(index+1));
   const image=document.createElement('img');image.src=item.querySelector('img').src;
   image.alt='';image.loading='lazy';mini.appendChild(image);
   mini.addEventListener('click',()=>render(index));strip.appendChild(mini);
   item.addEventListener('click',event=>{event.preventDefault();lastFocus=item;modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open');render(index);close.focus()});
 });
 function render(index){current=(index+items.length)%items.length;const target=items[current];
   const nextUrl=target.getAttribute('href');img.src=nextUrl;img.alt=target.dataset.caption||'Photo du restaurant La Mamounia';
   caption.textContent=target.dataset.caption||'La Mamounia';count.textContent=(current+1)+' / '+items.length;
   strip.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('is-active',i===current);b.setAttribute('aria-current',i===current?'true':'false')});
   const active=strip.children[current];if(active)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
 }
 function dismiss(){modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');img.removeAttribute('src');lastFocus?.focus()}
 modal.querySelectorAll('[data-lightbox-close]').forEach(el=>el.addEventListener('click',dismiss));
 modal.querySelector('.lightbox-prev').addEventListener('click',()=>render(current-1));
 modal.querySelector('.lightbox-next').addEventListener('click',()=>render(current+1));
 modal.addEventListener('keydown',e=>{
   if(e.key==='Escape'){dismiss();e.preventDefault()}
   else if(e.key==='ArrowLeft'){render(current-1);e.preventDefault()}
   else if(e.key==='ArrowRight'){render(current+1);e.preventDefault()}
   else if(e.key==='Tab'){
     const focusable=[...modal.querySelectorAll('button:not([disabled])')];
     const first=focusable[0],last=focusable[focusable.length-1];
     if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}
     else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}
   }
 });
 // Permet de changer la photo sur écran tactile par glissement.
 let startX=null;
 modal.querySelector('.lightbox-stage').addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.screenX??null},{passive:true});
 modal.querySelector('.lightbox-stage').addEventListener('touchend',e=>{if(startX===null)return;const end=e.changedTouches[0]?.screenX??startX;const distance=end-startX;if(Math.abs(distance)>60)render(current+(distance<0?1:-1));startX=null},{passive:true});
})();
