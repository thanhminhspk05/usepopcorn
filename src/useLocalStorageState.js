import { useEffect, useState } from 'react';

const useLocalStorageState = (initialState, key) => {
  const [value, setValue] = useState(() => {
    return JSON.parse(localStorage.getItem(key)) || initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export { useLocalStorageState };
