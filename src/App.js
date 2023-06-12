import { useState } from 'react';
import Main from './components/Main';
import Navbar from './components/Navbar';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2009',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt1375123',
    Title: 'Everybody Wants Some!!',
    Year: '2000',
    Poster: 'https://i.pravatar.cc/720',
  },
  {
    imdbID: 'tt0133456',
    Title: 'Some Fools There Were',
    Year: '1999',
    Poster: 'https://i.pravatar.cc/480',
  },
  {
    imdbID: 'tt6751789',
    Title: 'Some Mothers Son',
    Year: '1989',
    Poster: 'https://i.pravatar.cc/1000',
  },
];

export default function App() {
  const [query, setQuery] = useState('');
  let movies = tempMovieData; // call api
  movies = query ? movies.filter((movie) => movie.Title.toLowerCase().includes(query.toLowerCase())) : movies;
  return (
    <>
      <Navbar
        query={query}
        movies={movies}
        setQuery={setQuery}
      />
      <Main
        query={query}
        movies={movies}
      />
    </>
  );
}
