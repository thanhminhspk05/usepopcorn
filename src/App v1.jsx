import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { useDebounce } from './useDebounce';

const KEY = '78589cc1';

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  console.log(selectedId);

  const debouncedValue = useDebounce(query, 1500);
  const tempQuery = 'Day';

  const fetchMovies = async (controller) => {
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

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (movie) => {
    setWatched((watched) => watched.filter((watched) => watched.imdbID !== movie.imdbID));
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchMovies(controller);
    return () => controller.abort();
  }, [debouncedValue]);

  return (
    <>
      <Navbar>
        <Search
          query={query}
          setQuery={setQuery}
        />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <MovieList
              movies={movies}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
          {/* Case else write before case right */}

          {/* {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />} */}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return <p className="loader">Loading...</p>;
};

const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>❗</span> {message}
    </p>
  );
};

const Navbar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
};

const Search = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
};

const MovieList = ({ movies, selectedId, setSelectedId }) => {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ))}
    </ul>
  );
};

const Movie = ({ movie, selectedId, setSelectedId }) => {
  // Click first time, open the movie details. Click the second time to close the movie details. Open summary
  const handleSelectedId = (movie) => {
    setSelectedId((selectedId) => (selectedId === movie.imdbID ? null : movie.imdbID));
  };

  // useEffect(() => {
  //   document.title = movie.title || 'usePopcorn';
  // }, [selectedId]);

  return (
    <li onClick={() => handleSelectedId(movie)}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

const MovieDetails = ({ selectedId, setSelectedId, onAddWatched, watched }) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.find((watched) => watched.imdbID === selectedId); // find the first watched movie
  const watchedUserRating = isWatched?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Director: director,
    Genre: genre,
    Actors: actors,
  } = movie;

  const getMovieDetails = async () => {
    setIsLoading(true);
    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
    const data = await res.json();
    setMovie(data);
    setIsLoading(false);
  };

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
    };

    onAddWatched(newWatchedMovie);
    setSelectedId(null);
  };

  useEffect(() => {
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    const callback = (e) => {
      if (e.code === 'Escape') {
        setSelectedId(null);
      }
    };

    document.addEventListener('keydown', callback);

    return document.removeEventListener('keydown', callback); // after unmount , it will don't listen event on mouse escape
  });

  useEffect(() => {
    document.title = title;
    return () => (document.title = 'usePopcorn'); // run after unmount
  }, [title]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <span
              className="btn-back"
              onClick={() => setSelectedId(null)}
            >
              <i className="fa-sharp fa-solid fa-arrow-left"></i>
            </span>
            <img
              src={poster}
              alt={`Poster of ${movie}`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>{imdbRating} IMDb rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={36}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handleAdd}
                    >
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already watched this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
              Starring {actors}
            </p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
};

const WatchedSummary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(1);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(1);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(0);

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedMoviesList = ({ watched, onDeleteWatched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
};

const WatchedMovie = ({ movie, onDeleteWatched }) => {
  return (
    <li>
      <img
        src={movie.poster}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie)}
        >
          X
        </button>
      </div>
    </li>
  );
};
