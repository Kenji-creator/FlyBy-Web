(()=>{
function viewport(){document.documentElement.style.setProperty('--visual-height',(window.visualViewport?.height||innerHeight)+'px');window.FlyByBlairPresentation?.reflow()}
viewport();window.visualViewport?.addEventListener('resize',viewport);addEventListener('resize',viewport);
document.addEventListener('flyby-language-change',()=>window.FlyByBlairPresentation?.reflow());
const menu=document.querySelector('#menu'),links=document.querySelector('#links');
if(links&&!links.querySelector('a[href="contact.html"]')){const contact=document.createElement('a');contact.href='contact.html';contact.textContent='Contact';if(location.pathname.endsWith('/contact.html'))contact.setAttribute('aria-current','page');links.append(contact)}
function closeMenu(){menu?.setAttribute('aria-expanded','false');links?.classList.remove('open')}
links?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(links?.classList.contains('open')&&!event.target.closest('header'))closeMenu()});
document.querySelectorAll('img').forEach(image=>{image.decoding='async';if(!image.hasAttribute('loading')&&!image.hasAttribute('fetchpriority')&&!image.closest('header'))image.loading='lazy'});
document.querySelectorAll('.pip-walker:not(.blair-handoff-ghost)').forEach(bird=>{bird.setAttribute('role','button');bird.setAttribute('tabindex','0');bird.setAttribute('aria-label','Stop guide');const stop=()=>{if(document.body.classList.contains('helper-returning'))return;if(bird.classList.contains('quote-walker'))window.FlyByQuoteGuide?.stop();else window.FlyByHelperUI?.stop?.()};bird.addEventListener('click',stop);bird.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();stop()}})});
addEventListener('pageshow',event=>{if(event.persisted){closeMenu();window.FlyByBlairPresentation?.cancelNavigation();window.FlyByHelperUI?.suspend();window.FlyByQuoteGuide?.stop(false);window.FlyByBlairHandoff?.clear();window.FlyByBlair?.reset?.()}});
})();
