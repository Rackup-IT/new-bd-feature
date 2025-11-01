import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useCreateAuthorForm } from "../../hooks/useCreateAuthorForm";
import AuthorForm from "../author/author_form";

// Mock the useCreateAuthorForm hook
jest.mock("../../hooks/useCreateAuthorForm");

// Mock the ProfileImageInput component
jest.mock("../author/ProfileImageInput", () => ({
  ProfileImageInput: ({
    label,
    error,
    onChange,
    isLoading,
  }: {
    label: string;
    error?: string;
    value?: string | File | null;
    onChange: (file: File | null) => void;
    isLoading?: boolean;
  }) => (
    <div data-testid="profile-image-input">
      <span>{label}</span>
      {error && <span data-testid="error-message">{error}</span>}
      {isLoading && <span data-testid="loading-indicator">Loading...</span>}
      <button
        onClick={() =>
          onChange({ name: "test.jpg", type: "image/jpeg", size: 1024 } as File)
        }
      >
        Select File
      </button>
    </div>
  ),
}));

describe("AuthorForm with Profile Image", () => {
  const mockHandleSubmit = jest.fn();
  const mockRegister = jest.fn();
  const mockHandleImageChange = jest.fn();

  beforeEach(() => {
    // Mock the hook implementation
    (useCreateAuthorForm as jest.Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      errors: {},
      onSubmitHandler: jest.fn(),
      isPending: false,
      mutateError: null,
      signUpResult: null,
      control: {},
      reset: jest.fn(),
      profileImage: null,
      isUploading: false,
      uploadError: null,
      handleImageChange: mockHandleImageChange,
    });
  });

  it("renders the profile image input in sign up form", () => {
    render(<AuthorForm isSignUp={true} />);

    // Check if the profile image input is rendered
    expect(screen.getByTestId("profile-image-input")).toBeInTheDocument();
    expect(screen.getByText("Profile Image")).toBeInTheDocument();
  });

  it("handles image selection", () => {
    render(<AuthorForm isSignUp={true} />);

    // Simulate selecting a file
    fireEvent.click(screen.getByText("Select File"));

    // Verify handleImageChange was called
    expect(mockHandleImageChange).toHaveBeenCalled();
  });

  it("shows error messages for profile image", () => {
    // Mock with an error
    (useCreateAuthorForm as jest.Mock).mockReturnValueOnce({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      errors: { profileImage: { message: "Invalid image" } },
      onSubmitHandler: jest.fn(),
      isPending: false,
      mutateError: null,
      signUpResult: null,
      control: {},
      reset: jest.fn(),
      profileImage: null,
      isUploading: false,
      uploadError: "Image too large",
      handleImageChange: mockHandleImageChange,
    });

    render(<AuthorForm isSignUp={true} />);

    // Check if error messages are displayed
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Invalid image"
    );
  });

  it("shows loading state during upload", () => {
    // Mock with loading state
    (useCreateAuthorForm as jest.Mock).mockReturnValueOnce({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      errors: {},
      onSubmitHandler: jest.fn(),
      isPending: false,
      mutateError: null,
      signUpResult: null,
      control: {},
      reset: jest.fn(),
      profileImage: null,
      isUploading: true,
      uploadError: null,
      handleImageChange: mockHandleImageChange,
    });

    render(<AuthorForm isSignUp={true} />);

    // Check if loading indicator is displayed
    expect(screen.getByTestId("loading-indicator")).toHaveTextContent(
      "Loading..."
    );
  });

  it("does not render profile image input in login form", () => {
    render(<AuthorForm isSignUp={false} />);

    // Check that profile image input is not rendered in login form
    expect(screen.queryByTestId("profile-image-input")).not.toBeInTheDocument();
  });
});
