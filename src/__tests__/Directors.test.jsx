import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Directors from "../pages/Directors";

const directors = [
  {
    name: "Scott Derrickson",
    movies: ["Doctor Strange", "Sinister", "The Exorcism of Emily Rose"],
  },
  {
    name: "Mike Mitchell",
    movies: ["Trolls", "Alvin and the Chipmunks: Chipwrecked", "Sky High"],
  },
  {
    name: "Edward Zwick",
    movies: ["Jack Reacher: Never Go Back", "Blood Diamond", "The Siege"],
  },
];

const mockRoutes = [
  {
    path: "/directors",
    element: <Directors />,
  },
];

describe("Directors Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(directors),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("renders without any errors", () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    const errorSpy = vi.spyOn(global.console, "error");
    render(<RouterProvider router={router} />);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("renders 'Directors Page' inside of a <h1 />", () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    const h1 = screen.queryByText(/Directors Page/);
    expect(h1).toBeInTheDocument();
    expect(h1.tagName).toBe("H1");
  });

  test("renders each director's name", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    for (const director of directors) {
      expect(await screen.findByText(director.name)).toBeInTheDocument();
    }
  });

  test("renders a <li /> for each movie", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    for (const director of directors) {
      for (const movie of director.movies) {
        const li = await screen.findByText(movie);
        expect(li).toBeInTheDocument();
        expect(li.tagName).toBe("LI");
      }
    }
  });

  test("renders the <NavBar /> component", () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    expect(document.querySelector(".navbar")).toBeInTheDocument();
  });

  test("fetches and renders director data on mount", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    expect(global.fetch).toHaveBeenCalledWith("/directors");

    for (const director of directors) {
      const directorName = await screen.findByText(director.name);
      expect(directorName).toBeInTheDocument();
    }
  });

  test("renders the correct number of articles", async () => {
    const router = createMemoryRouter(mockRoutes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    const articles = await screen.findAllByRole("article");
    expect(articles).toHaveLength(directors.length);
  });
});
