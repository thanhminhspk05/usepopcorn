import React, { useState } from 'react';
import WatchedMovie from './WatchedMovie';


function WatchedBox({ watched }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? '-' : '+'}
      </button>
      {isOpen2 && (
        <>
          <ul className="list">
            {watched.map((movie) => (
              <WatchedMovie
                movie={movie}
                key={movie.imdbID}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default WatchedBox;
