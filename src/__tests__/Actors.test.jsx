import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Actors from "../pages/Actors";

const actors = [
  {
    name: "Benedict Cumberbatch",
    movies: ["Doctor Strange", "The Imitation Game", "Black Mass"],
  },
  {
    name: "Justin Timberlake",
    movies: ["Trolls", "Friends with Benefits", "The Social Network"],
  },
  {
    name: "Anna Kendrick",
    movies: ["Pitch Perfect", "Into The Wood"],
  },
  {
    name: "Tom Cruise",
    movies: [
      "Jack Reacher: Never Go Back",
      "Mission Impossible 4",
      "War of the Worlds",
    ],
  },
];

const mockRoutes = [
  {
    path: "/actors",
    element: <Actors />,
  },
];

const router = createMemoryRouter(mockRoutes, {
  initialEntries: ["/actors"],
  initialIndex: 0,
});

describe("Actors Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(actors),
      })
    );
  });

  afterEach(() => {
    vi.resetAllMocks(); // Clean up between tests
  });

  test("renders without any errors", () => {
    const errorSpy = vi.spyOn(global.console, "error");
    render(<RouterProvider router={router} />);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("renders 'Actors Page' inside of the <h1 />", () => {
    render(<RouterProvider router={router} />);
    const h1 = screen.queryByText(/Actors Page/);
    expect(h1).toBeInTheDocument();
    expect(h1.tagName).toBe("H1");
  });

  test("renders each actor's name", async () => {
    render(<RouterProvider router={router} />);
    for (const actor of actors) {
      expect(await screen.findByText(actor.name, { exact: false })).toBeInTheDocument();
    }
  });

  test("renders a <li /> for each movie", async () => {
    render(<RouterProvider router={router} />);
    for (const actor of actors) {
      for (const movie of actor.movies) {
        const li = await screen.findByText(movie, { exact: false });
        expect(li).toBeInTheDocument();
        expect(li.tagName).toBe("LI");
      }
    }
  });

  test("renders the <NavBar /> component", () => {
    render(<RouterProvider router={router} />);
    expect(document.querySelector(".navbar")).toBeInTheDocument();
  });

  test("fetches and renders actor data on mount", async () => {
    render(<RouterProvider router={router} />);
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/actors");

    for (const actor of actors) {
      const actorName = await screen.findByText(actor.name);
      expect(actorName).toBeInTheDocument();
    }
  });

  test("renders the correct number of articles", async () => {
    render(<RouterProvider router={router} />);
    const articles = await screen.findAllByRole("article");
    expect(articles).toHaveLength(actors.length);
  });
});
