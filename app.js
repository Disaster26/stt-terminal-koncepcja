(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var otw = menu.classList.toggle('otw');
      burger.setAttribute('aria-expanded', otw ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.remove('otw'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  // dolny pasek na telefonie dopiero po przewinieciu za przyciski hero
  var mob = document.getElementById('mob');
  var cta = document.getElementById('hero-cta');
  if (mob && cta && 'IntersectionObserver' in window) {
    document.body.classList.add('ma-mob');
    new IntersectionObserver(function (wpisy) {
      var w = wpisy[0];
      mob.classList.toggle('widac', !w.isIntersecting && w.boundingClientRect.top < 0);
    }).observe(cta);
  }

  // publiczne pole sledzenia -> strefa klienta
  var f = document.getElementById('pub-form');
  if (f) {
    var pole = document.getElementById('pub-nr');
    var kom = document.getElementById('pub-kom');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = ISO6346.sprawdz(pole.value);
      if (!r.ok) {
        kom.textContent = r.blad; kom.className = 'komunikat zle'; pole.classList.add('zle'); pole.focus();
        return;
      }
      pole.classList.remove('zle');
      location.href = 'portal.html?nr=' + encodeURIComponent(r.nr);
    });
    pole.addEventListener('input', function () { pole.classList.remove('zle'); kom.textContent = ''; });
  }
})();
