// src/__tests__/index.test.jsx
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../routes"; // <-- FIXED IMPORT

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: "Doctor Strange",
            time: "115 minutes",
            genres: ["Action", "Adventure", "Fantasy"],
          },
        ]),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("Route testing", () => {
  test('renders the Home component on route "/"', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Home Page/i);
    });
  });

  test('renders the Actors component on route "/actors"', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/actors"],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Actors Page/i);
    });
  });

  test('renders the Directors component on route "/directors"', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/directors"],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Directors Page/i);
    });
  });

  test('renders the Movie component on route "/movie/:id"', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/movie/1"],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Doctor Strange/i);
    });
  });

  test("renders an error page when given a bad URL", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/bad-route"],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Oops/i);
    });
  });

  test("navbar contains working navigation links", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Actors/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Directors/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("link", { name: /Actors/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Actors Page/i);
    });
  });

  test("movie links are working on home page", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /View Info/i })).toBeInTheDocument();
    });

    const movieLink = screen.getByRole("link", { name: /View Info/i });
    await user.click(movieLink);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Doctor Strange/i);
    });
  });
});
