import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

function Directors() {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    fetch("/directors")
      .then((res) => res.json())
      .then(setDirectors);
  }, []);

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <h1>Directors Page</h1>
        {directors.map((dir) => (
          <article key={dir.name}>
            <h2>{dir.name}</h2>
            <ul>
              {dir.movies.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </article>
        ))}
      </main>
    </>
  );
}

export default Directors;
