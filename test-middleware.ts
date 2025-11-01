import { NextRequest } from "next/server";
import { middleware } from "./src/middleware";

// Mock the getSession function
jest.mock("./src/lib/session", () => ({
  getSession: jest.fn(),
}));

// Mock NextResponse
jest.mock("next/server", () => {
  const original = jest.requireActual("next/server");
  return {
    ...original,
    NextResponse: {
      next: jest.fn(() => ({
        headers: {
          set: jest.fn(),
        },
        cookies: {
          set: jest.fn(),
          has: jest.fn(),
        },
      })),
      redirect: jest.fn((url) => url),
      rewrite: jest.fn((url) => url),
    },
  };
});

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle locale detection and redirection", async () => {
    const request = {
      nextUrl: {
        pathname: "/test",
        search: "",
      },
      url: "http://localhost:3000/test",
      headers: {
        get: jest.fn((header) => {
          if (header === "accept-language") return "en-US,en;q=0.9";
          if (header === "x-nextjs-data") return null;
          return null;
        }),
      },
      cookies: {
        get: jest.fn(),
        has: jest.fn(),
      },
    } as unknown as NextRequest;

    const result = await middleware(request);
    expect(result).toBeDefined();
  });

  it("should handle protected routes", async () => {
    const request = {
      nextUrl: {
        pathname: "/dashboard",
        search: "",
      },
      url: "http://localhost:3000/dashboard",
      headers: {
        get: jest.fn(),
      },
      cookies: {
        get: jest.fn(),
        has: jest.fn(),
      },
    } as unknown as NextRequest;

    // Mock getSession to return null (no session)
    require("./src/lib/session").getSession.mockResolvedValue(null);

    const result = await middleware(request);
    expect(result).toBeDefined();
  });
});
