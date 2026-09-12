const items=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')});
},{threshold:.12});
items.forEach(i=>observer.observe(i));

document.querySelector('.menu')?.addEventListener('click',()=>{
  const nav=document.querySelector('nav');
  nav.style.display=nav.style.display==='flex'?'none':'flex';
  nav.style.position='absolute';
  nav.style.top='65px';
  nav.style.left='0';
  nav.style.right='0';
  nav.style.height='auto';
  nav.style.padding='18px';
  nav.style.flexDirection='column';
  nav.style.background='#050e1c';
});
