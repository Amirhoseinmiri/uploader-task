import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large" | "icon";
  isLoading?: boolean;
};

const checkButtonVariant = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "primary":
      return "bg-blue-500 text-white hover:bg-blue-600";
    case "secondary":
      return "bg-gray-500 text-white hover:bg-gray-600";
    case "tertiary":
      return "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50";
    default:
      return "";
  }
};
const Button = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checkButtonVariant(
        variant
      )} ${className} ${
        size === "small"
          ? "px-2 py-1 text-sm"
          : size === "medium"
          ? "px-4 py-2 text-base"
          : size === "large"
          ? "px-6 py-3 text-lg"
          : size === "icon"
          ? "p-2 text-lg rounded-full shadow"
          : ""
      }`}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : props.children}
    </button>
  );
};

export default Button;
