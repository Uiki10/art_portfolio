// main.js - gallery, lightbox, theme toggle, scroll reveal, basic data
document.addEventListener('DOMContentLoaded', () => {
  // sample data (edit filenames or add images in /images)
  const galleryItems = [
    { src: 'images/thumb1.jpg', title: 'Untitled 1', caption: 'Digital illustration • 2025' },
    { src: 'images/thumb2.jpg', title: 'Untitled 2', caption: 'Manga panel study' },
    { src: 'images/thumb3.jpg', title: 'Untitled 3', caption: 'Character design' },
    { src: 'images/thumb4.jpg', title: 'Untitled 4', caption: 'Commission sample' },
    { src: 'images/thumb5.jpg', title: 'Untitled 5', caption: 'Cover art mockup' },
    { src: 'images/thumb6.jpg', title: 'Untitled 6', caption: 'Sketch study' }
  ];

  const projects = [
    {img: 'images/project1.jpg', title:'Short manga — Final fight', desc:'Two-page fight sequence for competition. Emphasis on pacing and onomatopoeia.', tools:'Clip Studio / Photoshop'},
    {img: 'images/project2.jpg', title:'Character pack', desc:'Character turnaround and expressions.', tools:'Digital / Clip Studio'},
    {img: 'images/project3.jpg', title:'Commission sample', desc:'Full color commission sample with background.', tools:'Photoshop'}
  ];

  // initialize years
  document.querySelectorAll('#year,#year2,#year3,#year4').forEach(el => el.textContent = new Date().getFullYear());

  // build gallery
  const gallery = document.getElementById('gallery');
  if(gallery){
    galleryItems.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'gallery-item reveal';
      card.dataset.index = idx;
      card.innerHTML = `
        <img src="${it.src}" alt="${it.title}" loading="lazy">
        <div class="gallery-caption">${it.title}</div>
      `;
      gallery.appendChild(card);
    });
  }

  // build projects
  const pgrid = document.getElementById('projects-grid');
  if(pgrid){
    projects.forEach(p => {
      const pc = document.createElement('div');
      pc.className = 'project-card reveal';
      pc.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p class="project-meta">${p.tools}</p>
        <p>${p.desc}</p>
      `;
      pgrid.appendChild(pc);
    });
  }

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let currentIndex = 0;

  function openLightbox(idx){
    const item = galleryItems[idx];
    if(!item) return;
    currentIndex = idx;
    lbImage.src = item.src;
    lbCaption.textContent = item.caption || item.title || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function prevImg(){ openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length) }
  function nextImg(){ openLightbox((currentIndex + 1) % galleryItems.length) }

  document.addEventListener('click', (e) => {
    const gi = e.target.closest('.gallery-item');
    if(gi && gi.dataset.index !== undefined){
      openLightbox(parseInt(gi.dataset.index));
    }
  });
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImg);
  lbNext.addEventListener('click', nextImg);
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if(lightbox.classList.contains('open')){
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowLeft') prevImg();
      if(e.key === 'ArrowRight') nextImg();
    }
  });

  // Theme toggle
  const themeButtons = document.querySelectorAll('[id^="theme-toggle"]');
  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('site-theme', t);
    themeButtons.forEach(b => b.textContent = t === 'dark' ? '☀️' : '🌙');
  }
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
  // load theme
  const saved = localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('in');
        obs.unobserve(en.target);
      }
    });
  }, {threshold:0.08});
  reveals.forEach(r => obs.observe(r));

  // loader hide
  const loader = document.getElementById('site-loader');
  window.addEventListener('load', () => {
    setTimeout(()=> loader.classList.add('hidden'), 350);
  });

  // small nav for mobile (toggle)
  const menuToggles = document.querySelectorAll('[id^="menu-toggle"]');
  menuToggles.forEach(btn => btn.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if(nav) nav.style.display = (nav.style.display === 'flex') ? '' : 'flex';
  }));

});
