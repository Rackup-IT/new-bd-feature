import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StatusDropDown from "../status_dropdown";

describe("StatusDropDown Component", () => {
  const mockOnChange = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    current: "Draft",
    onChange: mockOnChange,
    onDelete: mockOnDelete,
    isLoading: false,
    showSuccess: false,
    lastUpdated: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with the correct initial status", () => {
    render(<StatusDropDown {...defaultProps} />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    render(<StatusDropDown {...defaultProps} isLoading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows success checkmark when showSuccess is true", () => {
    render(<StatusDropDown {...defaultProps} showSuccess={true} />);
    expect(screen.getByTestId("check-circle")).toBeInTheDocument();
  });

  it("displays last updated timestamp on hover", async () => {
    render(<StatusDropDown {...defaultProps} />);
    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);

    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
    });
  });

  it('calls onChange with "Published" when Published is clicked', () => {
    render(<StatusDropDown {...defaultProps} />);

    // Open dropdown
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    // Click Published option
    const publishedOption = screen.getByText("Published");
    fireEvent.click(publishedOption);

    expect(mockOnChange).toHaveBeenCalledWith("Published");
  });

  it('calls onChange with "Draft" when Draft is clicked', () => {
    render(<StatusDropDown {...defaultProps} current="Published" />);

    // Open dropdown
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    // Click Draft option
    const draftOption = screen.getByText("Draft");
    fireEvent.click(draftOption);

    expect(mockOnChange).toHaveBeenCalledWith("Draft");
  });

  it("calls onDelete when Delete is clicked", () => {
    render(<StatusDropDown {...defaultProps} />);

    // Open dropdown
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    // Click Delete option
    const deleteOption = screen.getByText("Delete");
    fireEvent.click(deleteOption);

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<StatusDropDown {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "aria-label",
      "Current status: Draft. Click to change."
    );
    expect(button).toHaveAttribute("aria-busy", "false");
  });

  it("disables options when loading", () => {
    render(<StatusDropDown {...defaultProps} isLoading={true} />);

    // Open dropdown
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    const publishedOption = screen.getByText("Published");
    const draftOption = screen.getByText("Draft");
    const deleteOption = screen.getByText("Delete");

    expect(publishedOption).toBeDisabled();
    expect(draftOption).toBeDisabled();
    expect(deleteOption).toBeDisabled();
  });

  it("shows visual indicators for current status", () => {
    render(<StatusDropDown {...defaultProps} current="Published" />);

    // Open dropdown
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    const publishedOption = screen.getByText("Published");
    const draftOption = screen.getByText("Draft");

    // Published should have active styling
    expect(publishedOption).toHaveClass(
      "bg-gray-100 text-green-600 font-medium"
    );
    // Draft should not have active styling
    expect(draftOption).not.toHaveClass("bg-gray-100");
  });
});
