import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Button";
import { ActivityIndicator } from "react-native";

describe("Button Component", () => {
  it("should render the title correctly", () => {
    const { getByText } = render(<Button title="Entrar" onPress={() => {}} />);
    expect(getByText("Entrar")).toBeTruthy();
  });

  it("should call onPress when clicked", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Clique aqui" onPress={onPressMock} />
    );

    fireEvent.press(getByText("Clique aqui"));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("should show loading indicator when isLoading is true", () => {
    const { UNSAFE_getByType } = render(
      <Button title="Entrar" onPress={() => {}} isLoading={true} />
    );

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("should not be clickable when isLoading is true", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button title="Carregando" onPress={onPressMock} isLoading={true} />
    );
  });
});
