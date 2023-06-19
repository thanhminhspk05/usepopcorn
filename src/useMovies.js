import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

const KEY = '78589cc1';

const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const debouncedValue = useDebounce(query, 1500);
  const tempQuery = 'Day';

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query ? query : tempQuery}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (data.Response === 'False') throw new Error(data.Error); // depend on api response, go to catch exception
        console.log(data);

        setMovies(data.Search);
        setError('');
      } catch (err) {
        if (err.name !== 'AbourError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
    return () => controller.abort();
  }, [debouncedValue]);

  return { movies, isLoading, error };
};

export { useMovies };
