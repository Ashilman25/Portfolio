// assets/js/profile-card.js
(() => {
  const ANIMATION = {
    SMOOTH_DURATION: 600,
    INITIAL_DURATION: 1500,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20
  };

  const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
  const round = (v, p = 3) => parseFloat(v.toFixed(p));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const map = (v, inMin, inMax, outMin, outMax) => round(outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin));

  function buildProfileCard(opts) {
    const {
      avatarUrl,
      miniAvatarUrl,
      name = 'Your Name',
      title = 'Your Title',
      handle = 'yourhandle',
      status = 'Online',
      contactText = 'Contact',
      showUserInfo = true,
      enableTilt = true,
      enableMobileTilt = false,
      mobileTiltSensitivity = 5,
      behindGradient,
      innerGradient,
      showBehindGradient = true
    } = opts;

    // Wrapper
    const wrap = document.createElement('div');
    wrap.className = 'pc-card-wrapper';
    wrap.style.setProperty('--icon', 'none');
    wrap.style.setProperty('--grain', 'none');
    wrap.style.setProperty('--behind-gradient', showBehindGradient ? (behindGradient || 'initial') : 'none');
    wrap.style.setProperty('--inner-gradient', innerGradient || 'initial');

    // Card DOM (matches CSS class names)
    wrap.innerHTML = `
      <section class="pc-card">
        <div class="pc-inside">
          <div class="pc-shine"></div>
          <div class="pc-glare"></div>
          <div class="pc-content pc-avatar-content">
            <img class="avatar" alt="${name} avatar" loading="lazy" />
            ${showUserInfo ? `
            <div class="pc-user-info">
              <div class="pc-user-details">
                <div class="pc-mini-avatar"><img loading="lazy" alt="${name} mini avatar" /></div>
                <div class="pc-user-text">
                  <div class="pc-handle">@${handle}</div>
                  <div class="pc-status">${status}</div>
                </div>
              </div>
              <button class="pc-contact-btn" type="button" aria-label="Contact ${name}">${contactText}</button>
            </div>` : ``}
          </div>
          <div class="pc-content">
            <div class="pc-details">
              <h3>${name}</h3>
              <p>${title}</p>
            </div>
          </div>
        </div>
      </section>
    `;

    const card = wrap.querySelector('.pc-card');
    const inside = wrap.querySelector('.pc-inside');
    const avatarImg = wrap.querySelector('.avatar');
    const miniImg = wrap.querySelector('.pc-mini-avatar img');
    const btn = wrap.querySelector('.pc-contact-btn');

    if (btn) {
        btn.style.pointerEvents = 'auto';   // belt & suspenders
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Images
    avatarImg.src = avatarUrl;
    avatarImg.onerror = e => { e.currentTarget.style.display = 'none'; };
    if (miniImg) {
      miniImg.src = miniAvatarUrl || avatarUrl;
      miniImg.onerror = e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.src = avatarUrl; };
    }

    // Clicking "Contact"
    if (btn) btn.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Tilt logic (vanilla)
    if (enableTilt) {
      let rafId = null;

      const setProps = (offsetX, offsetY) => {
        const w = card.clientWidth;
        const h = card.clientHeight;

        const percentX = clamp((100 / w) * offsetX);
        const percentY = clamp((100 / h) * offsetY);

        const centerX = percentX - 50;
        const centerY = percentY - 50;

        const props = {
          '--pointer-x': `${percentX}%`,
          '--pointer-y': `${percentY}%`,
          '--background-x': `${map(percentX, 0, 100, 35, 65)}%`,
          '--background-y': `${map(percentY, 0, 100, 35, 65)}%`,
          '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
          '--pointer-from-top': `${percentY / 100}`,
          '--pointer-from-left': `${percentX / 100}`,
          '--rotate-x': `${round(-(centerX / 5))}deg`,
          '--rotate-y': `${round(centerY / 4)}deg`
        };
        Object.entries(props).forEach(([k, v]) => wrap.style.setProperty(k, v));
      };

      const smoothToCenter = (duration, startX, startY) => {
        const start = performance.now();
        const targetX = wrap.clientWidth / 2;
        const targetY = wrap.clientHeight / 2;

        const loop = now => {
          const t = clamp((now - start) / duration, 0, 1);
          const e = easeInOutCubic(t);
          setProps(lerp(startX, targetX, e), lerp(startY, targetY, e));
          if (t < 1) rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      };

      const onEnter = () => {
        if (rafId) cancelAnimationFrame(rafId);
        wrap.classList.add('active');
        card.classList.add('active');
      };

      const onMove = e => {
        const rect = card.getBoundingClientRect();
        setProps(e.clientX - rect.left, e.clientY - rect.top);
      };

      const onLeave = e => {
        const rect = card.getBoundingClientRect();
        smoothToCenter(ANIMATION.SMOOTH_DURATION, e.clientX - rect.left, e.clientY - rect.top);
        wrap.classList.remove('active');
        card.classList.remove('active');
      };

      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);

      // Initial intro animation
      const initX = wrap.clientWidth - ANIMATION.INITIAL_X_OFFSET;
      const initY = ANIMATION.INITIAL_Y_OFFSET;
      setProps(initX, initY);
      smoothToCenter(ANIMATION.INITIAL_DURATION, initX, initY);

      // Optional: device tilt
      if (enableMobileTilt) {
        const onClick = () => {
          if (location.protocol !== 'https:') return;
          if (typeof window.DeviceMotionEvent?.requestPermission === 'function') {
            window.DeviceMotionEvent.requestPermission()
              .then(state => {
                if (state === 'granted') {
                  window.addEventListener('deviceorientation', onOrient);
                }
              })
              .catch(console.error);
          } else {
            window.addEventListener('deviceorientation', onOrient);
          }
        };
        const onOrient = evt => {
          const { beta, gamma } = evt;
          if (beta == null || gamma == null) return;
          setProps(
            card.clientHeight / 2 + gamma * mobileTiltSensitivity,
            card.clientWidth / 2 + (beta - ANIMATION.DEVICE_BETA_OFFSET) * mobileTiltSensitivity
          );
        };
        card.addEventListener('click', onClick);
      }
    }

    return wrap;
  }

  // Public init helper:
  window.mountProfileCard = function mountProfileCard(mountSelector, options) {
    const mount = typeof mountSelector === 'string' ? document.querySelector(mountSelector) : mountSelector;
    if (!mount) return;
    const card = buildProfileCard(options);
    mount.innerHTML = '';
    mount.appendChild(card);
  };
})();
