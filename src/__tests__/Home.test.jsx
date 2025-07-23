import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

const movies = [
  {
    id: 1,
    title: "Doctor Strange",
    time: "115 minutes",
    genres: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: 2,
    title: "Trolls",
    time: "92 minutes",
    genres: ["Animation", "Adventure", "Comedy"],
  },
];

const mockRoutes = [
  {
    path: "/",
    element: <Home />,
  },
];

describe("Home Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(movies),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders 'Home Page' inside of an <h1 />", () => {
    const router = createMemoryRouter(mockRoutes);
    render(<RouterProvider router={router} />);
    const h1 = screen.queryByText(/Home Page/);
    expect(h1).toBeInTheDocument();
    expect(h1.tagName).toBe("H1");
  });

  test("Displays a list of movie titles", async () => {
    const router = createMemoryRouter(mockRoutes);
    render(<RouterProvider router={router} />);
    const titleList = await screen.findAllByRole("heading", { level: 2 });
    expect(titleList.length).toBeGreaterThan(0);
    expect(titleList[0].tagName).toBe("H2");
    expect(titleList[0].textContent).toBe("Doctor Strange");
  });

  test("Displays links for each associated movie", async () => {
    const router = createMemoryRouter(mockRoutes);
    render(<RouterProvider router={router} />);
    const linkList = await screen.findAllByText(/View Info/);
    expect(linkList.length).toBeGreaterThan(0);
    expect(linkList[0].href.split("/").slice(3).join("/")).toBe("movie/1");
  });

  test("renders the <NavBar /> component", () => {
    // ❌ FIXED: replaced routes with mockRoutes
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    expect(document.querySelector(".navbar")).toBeInTheDocument();
  });

  test("fetches movies data on mount", async () => {
    const router = createMemoryRouter(mockRoutes);
    render(<RouterProvider router={router} />);
    expect(global.fetch).toHaveBeenCalledWith("/movies");

    for (const movie of movies) {
      const movieTitle = await screen.findByText(movie.title);
      expect(movieTitle).toBeInTheDocument();
    }
  });

  test("renders correct number of MovieCard components", async () => {
    const router = createMemoryRouter(mockRoutes);
    render(<RouterProvider router={router} />);
    const movieCards = await screen.findAllByRole("heading", { level: 2 });
    expect(movieCards).toHaveLength(movies.length);
  });
});
