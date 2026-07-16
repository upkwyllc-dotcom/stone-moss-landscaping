(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year
  document.getElementById('yearNow').textContent = new Date().getFullYear();

  // Nav scroll state
  var nav = document.getElementById('siteNav');
  var toTop = document.getElementById('toTop');
  function onScroll(){
    var y = window.scrollY;
    if(y > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    if(y > 800){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  toTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'}); });

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

  // Hero parallax (subtle, transform-only)
  var heroArt = document.querySelector('.hero-art svg');
  var heroSun = document.getElementById('heroSun');
  if(heroArt && !reduced){
    var ticking = false;
    document.addEventListener('scroll', function(){
      if(!ticking){
        requestAnimationFrame(function(){
          var y = window.scrollY;
          if(y < 900){
            heroArt.style.transform = 'translateY(' + (y * 0.06) + 'px)';
            if(heroSun) heroSun.setAttribute('cy', 120 + y * 0.03);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, {passive:true});
  }
})();
