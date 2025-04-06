import confetti from 'react-canvas-confetti';

let myConfetti;

export const initConfetti = () => {
  myConfetti = confetti.create(document.getElementById('my-confetti-canvas'), {
    resize: true,
    useWorker: true,
  });
};

export const triggerSuccessConfetti = () => {
  if (myConfetti) {
    myConfetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 100,
    });
  }
};

export const triggerFailureConfetti = () => {
  if (myConfetti) {
    myConfetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      zIndex: 100,
      colors: ['#bb0000', '#ffffff'],
    });
    myConfetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      zIndex: 100,
      colors: ['#bb0000', '#ffffff'],
    });
  }
};