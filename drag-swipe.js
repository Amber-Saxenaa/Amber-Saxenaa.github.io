/* V38 — drag/swipe carousel with click-to-open cards */
(() => {
  document.querySelectorAll('.carousel-track').forEach((track) => {
    let down = false, moved = false, startX = 0, startScroll = 0;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      try { track.setPointerCapture(e.pointerId); } catch (_) {}
    });

    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      track.scrollLeft = startScroll - dx;
    });

    const finish = (e) => {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      try { track.releasePointerCapture(e.pointerId); } catch (_) {}

      if (moved) {
        track.dataset.dragged = '1';
        window.setTimeout(() => { track.dataset.dragged = '0'; }, 120);
      }
    };

    track.addEventListener('pointerup', finish);
    track.addEventListener('pointercancel', finish);

    track.addEventListener('click', (e) => {
      if (track.dataset.dragged === '1') {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });
})();
