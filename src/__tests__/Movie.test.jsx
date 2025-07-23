import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Movie from "../pages/Movie";
import routes from "../routes"; // ✅ Import if needed

const movie = {
  id: 1,
  title: "Doctor Strange",
  time: "115 minutes",
  genres: ["Action", "Adventure", "Fantasy"]
};

const mockRoutes = [
  {
    path: "/movie/:id",
    element: <Movie />
  }
];

describe("Movie Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([movie]),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders without any errors", () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    const errorSpy = vi.spyOn(global.console, "error");
    render(<RouterProvider router={router} />);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("renders movie's title in an h1", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    render(<RouterProvider router={router} />);
    const h1 = await screen.findByText(/Doctor Strange/);
    expect(h1).toBeInTheDocument();
    expect(h1.tagName).toBe("H1");
  });

  test("renders movie's time within a p tag", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    render(<RouterProvider router={router} />);
    const p = await screen.findByText(/115/);
    expect(p).toBeInTheDocument();
    expect(p.tagName).toBe("P");
  });

  test("renders a span for each genre", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    render(<RouterProvider router={router} />);
    
    for (const genre of movie.genres) {
      const span = await screen.findByText(genre);
      expect(span).toBeInTheDocument();
      expect(span.tagName).toBe("SPAN");
    }
  });

  test("renders the <NavBar /> component", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("navigation")).toBeInTheDocument();
  });

  test("fetches movie data on mount", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    render(<RouterProvider router={router} />);
    expect(global.fetch).toHaveBeenCalledWith("/movies");
    
    const movieTitle = await screen.findByText(movie.title);
    expect(movieTitle).toBeInTheDocument();
  });

  test("shows loading state before movie loads", () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: [`/movie/${movie.id}`]
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
