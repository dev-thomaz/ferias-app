import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "success" | "danger" | "secondary";
  isLoading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  isLoading,
  ...rest
}: ButtonProps) {
  const variants = {
    primary: "bg-primary",
    success: "bg-success",
    danger: "bg-danger",
    secondary: "bg-secondary",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isLoading}
      className={`${variants[variant]} w-full p-4 rounded-xl flex-row justify-center items-center`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text className="text-white font-bold text-lg">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
