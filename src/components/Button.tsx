import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";

export type ButtonVariant = "primary" | "success" | "danger" | "secondary";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  isLoading,
  ...rest
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary",
    success: "bg-emerald-600",
    danger: "bg-rose-600",
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
