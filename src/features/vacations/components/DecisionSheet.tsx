import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface DecisionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: "APPROVE" | "REJECT") => void;
  userName?: string;
}

export function DecisionSheet({
  visible,
  onClose,
  onSelect,
  userName,
}: DecisionSheetProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(300);

      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 12,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 justify-end">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{ transform: [{ translateY: slideAnim }] }}
              className="bg-surface-light dark:bg-surface-dark rounded-t-3xl p-6 pb-10 shadow-2xl"
            >
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </View>

              <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
                Analisar Solicitação
              </Text>

              <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 px-8">
                O que você deseja fazer com a solicitação de{" "}
                <Text className="font-bold text-gray-700">{userName}</Text>?
              </Text>

              <View className="gap-y-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onSelect("APPROVE")}
                  className="bg-emerald-600 p-4 rounded-xl flex-row justify-center items-center shadow-emerald-200 shadow-lg"
                >
                  <Feather
                    name="check-circle"
                    size={20}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-bold text-lg">
                    Aprovar Férias
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onSelect("REJECT")}
                  className="bg-rose-50 p-4 rounded-xl flex-row justify-center items-center border border-rose-100"
                >
                  <Feather
                    name="x-circle"
                    size={20}
                    color="#E11D48"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-rose-600 font-bold text-lg">
                    Reprovar Solicitação
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={onClose} className="mt-6">
                <Text className="text-center text-gray-400 font-medium">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
