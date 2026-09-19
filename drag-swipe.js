/* V32 — drag + swipe carousels
   Replaces the old left/right arrow controls. Works with mouse, touch and
   trackpads without changing the existing card click/hover interactions. */
(() => {
  const tracks = document.querySelectorAll('.carousel-track');
  if (!tracks.length) return;

  tracks.forEach((track) => {
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let pointerId = null;

    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      moved = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      try { track.setPointerCapture(pointerId); } catch (_) {}
    };

    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      track.scrollLeft = startScroll - dx;
    };

    const up = (e) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      try { track.releasePointerCapture(pointerId); } catch (_) {}
      pointerId = null;

      // Snap to the nearest card after a meaningful drag.
      if (moved) {
        const cards = [...track.querySelectorAll('.carousel-card')];
        if (cards.length) {
          const target = Math.round(track.scrollLeft / Math.max(1, cards[0].offsetWidth + 16));
          track.scrollTo({
            left: Math.max(0, target * (cards[0].offsetWidth + 16)),
            behavior: 'smooth'
          });
        }
      }
    };

    track.addEventListener('pointerdown', down);
    track.addEventListener('pointermove', move);
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);
    track.addEventListener('lostpointercapture', () => {
      dragging = false;
      track.classList.remove('is-dragging');
    });

    // Prevent a click from opening a card when the user was actually dragging.
    track.addEventListener('click', (e) => {
      if (track.dataset.dragged === '1') {
        e.preventDefault();
        e.stopPropagation();
        track.dataset.dragged = '0';
      }
    }, true);

    track.addEventListener('pointerup', () => {
      if (moved) {
        track.dataset.dragged = '1';
        window.setTimeout(() => { track.dataset.dragged = '0'; }, 80);
      }
    }, true);
  });
})();
