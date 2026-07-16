(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year
  document.getElementById('yearNow').textContent = new Date().getFullYear();

  // Nav scroll state
  var nav = document.getElementById('siteNav');
  var toTop = document.getElementById('toTop');
  var footerInView = false;
  function onScroll(){
    var y = window.scrollY;
    if(y > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    if(y > 800 && !footerInView){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  toTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'}); });

  // Hide the back-to-top button once the CTA band or footer scroll into
  // view so it never sits on top of the consultation button or footer text.
  var noFabZones = document.querySelectorAll('.cta-band, footer');
  if(noFabZones.length && 'IntersectionObserver' in window){
    var intersectingZones = new Set();
    var fabIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ intersectingZones.add(entry.target); }
        else { intersectingZones.delete(entry.target); }
      });
      footerInView = intersectingZones.size > 0;
      onScroll();
    }, {rootMargin: '0px 0px -40% 0px'});
    noFabZones.forEach(function(el){ fabIo.observe(el); });
  }

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  menuBtn.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && !reduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // Animated counters
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduced){ el.textContent = target + suffix; return; }
    var duration = 1400, startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, {threshold:0.6});
    counters.forEach(function(el){ cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  // Portfolio filter
  var tabs = document.querySelectorAll('.filter-tab');
  var items = document.querySelectorAll('.portfolio-item');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      var f = tab.getAttribute('data-filter');
      items.forEach(function(item){
        var match = (f === 'all') || (item.getAttribute('data-cat') === f);
        item.classList.toggle('hidden', !match);
      });
    });
  });

  // Testimonial carousel
  var slides = document.querySelectorAll('.testi-slide');
  var dotsWrap = document.getElementById('testiDots');
  var current = 0;
  slides.forEach(function(_, i){
    var dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
    dot.addEventListener('click', function(){ goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('.testi-dot');
  function goTo(i){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  document.getElementById('testiPrev').addEventListener('click', function(){ goTo(current - 1); });
  document.getElementById('testiNext').addEventListener('click', function(){ goTo(current + 1); });
  var autoTimer;
  function startAuto(){ if(reduced) return; autoTimer = setInterval(function(){ goTo(current + 1); }, 7000); }
  function stopAuto(){ clearInterval(autoTimer); }
  document.querySelector('.testi-wrap').addEventListener('mouseenter', stopAuto);
  document.querySelector('.testi-wrap').addEventListener('mouseleave', startAuto);
  startAuto();

  // Hero scroll parallax (subtle, transform-only, whole illustration)
  var heroArtSvg = document.querySelector('.hero-art svg');
  var heroSun = document.getElementById('heroSun');
  if(heroArtSvg && !reduced){
    var ticking = false;
    document.addEventListener('scroll', function(){
      if(!ticking){
        requestAnimationFrame(function(){
          var y = window.scrollY;
          if(y < 900){
            heroArtSvg.style.transform = 'translateY(' + (y * 0.06) + 'px)';
            if(heroSun) heroSun.setAttribute('cy', 120 + y * 0.03);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, {passive:true});
  }

  // Hero mouse-parallax: individual illustration layers drift at different
  // depths as the cursor moves, independent of the scroll transform above.
  var heroSection = document.querySelector('.hero');
  var fine = window.matchMedia('(pointer: fine)').matches;
  var parallaxLayers = [
    {el: document.getElementById('heroBgCircle'), max: 3},
    {el: document.getElementById('heroSun'), max: 6},
    {el: document.getElementById('heroHillBack'), max: 9},
    {el: document.getElementById('heroHillFront'), max: 13},
    {el: document.getElementById('heroTreeGroup'), max: 13},
    {el: document.getElementById('heroContours'), max: 17}
  ];
  if(heroSection && fine && !reduced){
    var px = 0, py = 0, rafPending = false;
    function applyParallax(){
      parallaxLayers.forEach(function(l){
        if(!l.el) return;
        var tx = (px * l.max).toFixed(2);
        var ty = (py * l.max * 0.6).toFixed(2);
        l.el.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      });
      rafPending = false;
    }
    heroSection.addEventListener('mousemove', function(e){
      var r = heroSection.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if(!rafPending){ requestAnimationFrame(applyParallax); rafPending = true; }
    });
    heroSection.addEventListener('mouseleave', function(){
      px = 0; py = 0;
      requestAnimationFrame(applyParallax);
    });
  }

  // Hero time-of-day toggle: click (or Enter/Space via the button) cycles
  // the illustration through Dawn / Midday / Dusk color moods.
  var heroArt = document.getElementById('heroArt');
  var timeToggle = document.getElementById('timeToggle');
  var timeToggleLabel = document.getElementById('timeToggleLabel');
  var times = ['dawn', 'midday', 'dusk'];
  var timeNames = {dawn: 'Dawn', midday: 'Midday', dusk: 'Dusk'};
  var timeIndex = 0;
  if(heroArt && timeToggle && timeToggleLabel){
    timeToggle.addEventListener('click', function(){
      timeIndex = (timeIndex + 1) % times.length;
      var t = times[timeIndex];
      heroArt.setAttribute('data-time', t);
      timeToggleLabel.textContent = timeNames[t];
      timeToggle.setAttribute('aria-label', "Change the illustration's light. Currently " + timeNames[t] + '.');
    });
  }

  // Magnetic hero CTA buttons: nudge toward the cursor within a small radius.
  if(fine && !reduced){
    document.querySelectorAll('.hero-ctas .btn').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var relX = e.clientX - r.left - r.width / 2;
        var relY = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (relX * 0.16).toFixed(2) + 'px,' + (relY * 0.28 - 2).toFixed(2) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform = '';
      });
    });
  }
})();
