import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

function Movie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch("/movies")
      .then((res) => res.json())
      .then((movies) => {
        const found = movies.find((m) => m.id.toString() === id);
        setMovie(found);
      });
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <h1>{movie.title}</h1>
        <p>{movie.time}</p>
        {movie.genres.map((g, i) => (
          <span key={i}>{g}</span>
        ))}
      </main>
    </>
  );
}

export default Movie;
