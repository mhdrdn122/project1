import confetti from 'canvas-confetti';

export const showSuccessConfetti = () => {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#00FF88', '#00D4FF', '#66FF66', '#F3FF00'],
    scalar: 1.2,
    zIndex: 9999,
  });
};

export const showFailureConfetti = () => {
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { y: 0.4 },
    gravity: 2.5,
    colors: ['#ff4d4f', '#8b0000', '#ff8888'],
    scalar: 1,
    zIndex: 9999,
  });
};
