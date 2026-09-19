/* V40 — picture click + text-only drag/swipe carousel */
(() => {
  document.querySelectorAll('.carousel-track').forEach((track) => {
    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const isTextArea = (target) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest('.carousel-card h3, .carousel-card p');
    };

    const isThumb = (target) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest('.carousel-thumb');
    };

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      /*
       * IMPORTANT:
       * Picture/thumb = dialog zone.
       * Text = carousel drag zone.
       * Empty/card padding = neutral; do not steal the click.
       */
      if (isThumb(e.target) || !isTextArea(e.target)) return;

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
        window.setTimeout(() => {
          track.dataset.dragged = '0';
        }, 180);
      }
    };

    track.addEventListener('pointerup', finish);
    track.addEventListener('pointercancel', finish);

    /*
     * If the text was dragged, suppress the synthetic click that follows.
     * Thumbnail clicks never enter the drag state, so the dialog works normally.
     */
    track.addEventListener('click', (e) => {
      if (track.dataset.dragged === '1') {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });
})();
