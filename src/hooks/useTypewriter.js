import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 18, enabled = true) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      setDone(true);
      return;
    }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, ++i));
      } else {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return { displayed, done };
};
