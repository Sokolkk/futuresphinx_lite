(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── ripple effect on .ripple buttons ── */
(function () {
  var ripples = document.querySelectorAll('.ripple');
  if (!ripples.length) return;

  ripples.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var span = document.createElement('span');
      span.className = 'ripple__span';
      var size = Math.max(rect.width, rect.height);
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(span);
      span.addEventListener('animationend', function () { span.remove(); });
    });
  });
})();
