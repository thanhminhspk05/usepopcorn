import { useEffect } from 'react';

const useKey = (key, action) => {
  useEffect(() => {
    const callback = (e) => {
      console.log('first');
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    };

    document.addEventListener('keydown', callback);

    // return document.removeEventListener('keydown', callback); // after unmount , it will don't listen event on mouse escape
  }, [action, key]);
};

export { useKey };
