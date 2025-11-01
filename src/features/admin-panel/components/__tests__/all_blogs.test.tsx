import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  useDeletePostApi,
  useGetAllPostApi,
  useUpdatePostApi,
} from "../../hooks/api/useAddPostApi";
import { DBResponseSchema } from "../../validation/blog/db_response";
import AllBlogs from "../tab-pages/all_blogs";
import { Column } from "../table";

// Mock the API hooks
jest.mock("../../hooks/api/useAddPostApi");

// Mock the table component
jest.mock("../table", () => ({
  __esModule: true,
  default: jest.fn(
    ({
      data,
      columns,
    }: {
      data: DBResponseSchema[];
      columns: Column<DBResponseSchema>[];
    }) => (
      <div data-testid="mock-table">
        {data?.map((item: DBResponseSchema, index: number) => (
          <div key={index} data-testid={`row-${index}`}>
            {columns.map((col) => (
              <div
                key={col.header}
                data-testid={`${col.header.toLowerCase()}-${index}`}
              >
                {col.cell(item, index)}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  ),
}));

// Mock the table_columns component
jest.mock("../table_columns", () => ({
  __esModule: true,
  default: jest.fn(
    (props: {
      onStatusChange: (row: DBResponseSchema, status: string) => void;
      onDelete: (row: DBResponseSchema) => void;
      loadingPostId?: string | null;
      successPostId?: string | null;
    }) => {
      return [
        {
          header: "Status",
          cell: (row: DBResponseSchema) => (
            <div data-testid={`status-cell-${row._id}`}>
              <button
                onClick={() =>
                  props.onStatusChange(
                    row,
                    row.status === "Draft" ? "Published" : "Draft"
                  )
                }
                data-testid={`status-button-${row._id}`}
              >
                {row.status}
              </button>
              <button
                onClick={() => props.onDelete(row)}
                data-testid={`delete-button-${row._id}`}
              >
                Delete
              </button>
            </div>
          ),
        },
      ];
    }
  ),
}));

// Mock the snackbar component
jest.mock("../../../../components/snackbar/snackbar", () => ({
  __esModule: true,
  default: jest.fn(({ message }: { message: string }) => (
    <div data-testid="snackbar">{message}</div>
  )),
}));

// Mock the error boundary component
jest.mock("../../../../components/error-boundary/error_boundary", () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  )),
}));

describe("AllBlogs Component", () => {
  const queryClient = new QueryClient();

  const mockPosts: DBResponseSchema[] = [
    {
      _id: "1",
      title: "Post 1",
      status: "Draft",
      slug: "post-1",
      image: "image1.jpg",
      writter: "Author 1",
      section: "Section 1",
      edition: "Edition 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keywords: "keyword1,keyword2",
      desscription: "Description 1",
      content: "Content 1",
    },
    {
      _id: "2",
      title: "Post 2",
      status: "Published",
      slug: "post-2",
      image: "image2.jpg",
      writter: "Author 2",
      section: "Section 2",
      edition: "Edition 2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keywords: "keyword3,keyword4",
      desscription: "Description 2",
      content: "Content 2",
    },
  ];

  beforeEach(() => {
    // Mock the API responses
    (useGetAllPostApi as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      data: mockPosts,
      isPending: false,
    });

    (useUpdatePostApi as jest.Mock).mockReturnValue({
      mutate: jest.fn(
        (
          params: { id: string; data: { status: string } },
          options: {
            onSuccess: () => void;
            onError: (error: Error) => void;
          }
        ) => {
          // Simulate API call
          if (params.id === "fail") {
            options.onError(new Error("API Error"));
          } else {
            options.onSuccess();
          }
        }
      ),
    });

    (useDeletePostApi as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it("renders loading state when data is loading", () => {
    (useGetAllPostApi as jest.Mock).mockReturnValueOnce({
      mutate: jest.fn(),
      data: null,
      isPending: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AllBlogs />
      </QueryClientProvider>
    );

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("renders posts when data is loaded", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AllBlogs />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("mock-table")).toBeInTheDocument();
      expect(screen.getByTestId("row-0")).toBeInTheDocument();
      expect(screen.getByTestId("row-1")).toBeInTheDocument();
    });
  });

  it("updates post status optimistically", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AllBlogs />
      </QueryClientProvider>
    );

    // Find the status button for the first post
    const statusButton = screen.getByTestId("status-button-1");
    expect(statusButton).toHaveTextContent("Draft");

    // Click to change status
    fireEvent.click(statusButton);

    // Verify optimistic update
    await waitFor(() => {
      expect(statusButton).toHaveTextContent("Published");
    });
  });

  it("shows error message when API call fails", async () => {
    // Mock a post that will fail
    const failingPost: DBResponseSchema = {
      _id: "fail",
      title: "Failing Post",
      status: "Draft",
      slug: "fail",
      image: "image.jpg",
      writter: "Author",
      section: "Section",
      edition: "Edition",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      keywords: "keyword",
      desscription: "Description",
      content: "Content",
    };

    (useGetAllPostApi as jest.Mock).mockReturnValueOnce({
      mutate: jest.fn(),
      data: [failingPost],
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AllBlogs />
      </QueryClientProvider>
    );

    // Find the status button
    const statusButton = screen.getByTestId("status-button-fail");

    // Click to change status (should fail)
    fireEvent.click(statusButton);

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByTestId("snackbar")).toHaveTextContent("API Error");
    });
  });

  it("handles delete action", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AllBlogs />
      </QueryClientProvider>
    );

    // Find the delete button for the first post
    const deleteButton = screen.getByTestId("delete-button-1");

    // Click to delete
    fireEvent.click(deleteButton);

    // Verify delete API was called
    await waitFor(() => {
      expect(useDeletePostApi().mutate).toHaveBeenCalled();
    });
  });
});
