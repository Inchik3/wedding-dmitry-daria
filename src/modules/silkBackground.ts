export function initSilkBackground(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-silk-canvas]');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ribbons = Array.from({ length: 20 }, (_, index) => ({
    y: (index % 10 - 2) / 7,
    angle: [-18, 12, 0, 24, -9, 7, -26][index % 7],
    amplitude: 22 + (index % 5) * 9,
    frequency: 0.006 + (index % 4) * 0.0015,
    speed: 0.00013 + (index % 6) * 0.00003,
    phase: index * 0.72,
    width: 14 + (index % 4) * 7,
    alpha: 0.12 + (index % 5) * 0.024,
  }));

  let width = 0;
  let height = 0;
  let frame = 0;
  let previousTime = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const drawRibbon = (time: number, ribbon: (typeof ribbons)[number]) => {
    const span = Math.hypot(width, height) + 240;
    const baseY = span * ribbon.y - span * 0.06;
    const phase = ribbon.phase + time * ribbon.speed;

    context.save();
    context.translate(width / 2, height / 2);
    context.rotate((ribbon.angle * Math.PI) / 180);
    context.translate(-span / 2, -span / 2);
    context.beginPath();
    for (let x = -120; x <= span + 120; x += 24) {
      const y =
        baseY +
        Math.sin(x * ribbon.frequency + phase) * ribbon.amplitude +
        Math.sin(x * ribbon.frequency * 2.2 - phase * 1.7) * ribbon.amplitude * 0.42;

      if (x === -80) context.moveTo(x, y);
      else context.lineTo(x, y);
    }

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = 'screen';
    context.shadowColor = 'rgba(255, 255, 255, 0.46)';
    context.shadowBlur = ribbon.width * 2.6;
    context.strokeStyle = `rgba(255, 255, 248, ${ribbon.alpha})`;
    context.lineWidth = ribbon.width;
    context.stroke();

    context.globalCompositeOperation = 'multiply';
    context.shadowBlur = 0;
    context.strokeStyle = 'rgba(178, 151, 118, 0.045)';
    context.lineWidth = Math.max(3, ribbon.width * 0.42);
    context.stroke();
    context.restore();
  };

  const draw = (time = 0) => {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8efe2');
    gradient.addColorStop(0.42, '#ebe0d1');
    gradient.addColorStop(1, '#fff8ef');
    context.globalCompositeOperation = 'source-over';
    context.shadowBlur = 0;
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(width * 0.22, height * 0.12, 0, width * 0.22, height * 0.12, width * 0.72);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    ribbons.forEach((ribbon) => drawRibbon(time, ribbon));

    context.globalCompositeOperation = 'soft-light';
    context.fillStyle = 'rgba(255, 255, 255, 0.28)';
    for (let index = 0; index < 5; index += 1) {
      const x = width * (0.12 + index * 0.2) + Math.sin(time * 0.00025 + index) * 28;
      const y = height * (0.18 + (index % 3) * 0.26) + Math.cos(time * 0.00021 + index) * 22;
      const radius = Math.max(width, height) * (0.18 + index * 0.025);
      const spot = context.createRadialGradient(x, y, 0, x, y, radius);
      spot.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      spot.addColorStop(0.48, 'rgba(255, 255, 255, 0.1)');
      spot.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = spot;
      context.fillRect(0, 0, width, height);
    }

    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'rgba(255, 250, 244, 0.16)';
    context.fillRect(0, 0, width, height);
  };

  const animate = (time: number) => {
    if (time - previousTime > 33) {
      draw(time);
      previousTime = time;
    }
    frame = window.requestAnimationFrame(animate);
  };

  resize();
  draw(0);
  window.addEventListener('resize', () => {
    resize();
    draw(0);
  });

  if (!reducedMotion) {
    frame = window.requestAnimationFrame(animate);
  }

  window.addEventListener('pagehide', () => {
    if (frame) window.cancelAnimationFrame(frame);
  });
}
