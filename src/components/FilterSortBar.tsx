import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowDown, ArrowUp } from "lucide-react-native";

export type FilterOption<T extends string = string> = {
  id: T;
  label: string;
};

export type SortOrder = "asc" | "desc";

type Variant = "admin" | "manager" | "employee";

type LayoutMode = "row" | "stacked";

interface FilterSortBarProps<T extends string> {
  filters: FilterOption<T>[];
  activeFilter: T;

  onFilterChange: (id: T) => void;
  sortOrder: SortOrder;
  onToggleSort: () => void;
  variant?: Variant;
  layout?: LayoutMode;
  disabled?: boolean;
}

const THEME_CONFIG = {
  admin: {
    activeBg: "bg-purple-600",
    activeBorder: "border-purple-600",
    iconColor: "#9333EA",
    textColor: "text-purple-600",
  },
  manager: {
    activeBg: "bg-blue-600",
    activeBorder: "border-blue-600",
    iconColor: "#2563EB",
    textColor: "text-blue-600",
  },
  employee: {
    activeBg: "bg-emerald-600",
    activeBorder: "border-emerald-600",
    iconColor: "#10B981",
    textColor: "text-emerald-600",
  },
};

export function FilterSortBar<T extends string>({
  filters,
  activeFilter,
  onFilterChange,
  sortOrder,
  onToggleSort,
  variant = "admin",
  layout = "row",
  disabled = false,
}: FilterSortBarProps<T>) {
  const theme = THEME_CONFIG[variant];

  const FilterList = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={layout === "row" ? "" : "pl-6"}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      {filters.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onFilterChange(tab.id)}
          disabled={disabled}
          className={`mr-2 px-4 py-2.5 rounded-full border ${
            activeFilter === tab.id
              ? `${theme.activeBg} ${theme.activeBorder}`
              : "bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-800"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeFilter === tab.id
                ? "text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const SortButton = () => (
    <TouchableOpacity
      onPress={onToggleSort}
      disabled={disabled}
      className={`bg-surface-light dark:bg-surface-dark border border-gray-200 rounded-full dark:border-gray-800 px-3 py-2.5 rounded-lg flex-row items-center justify-center shadow-sm ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <Text className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mr-2 uppercase">
        {sortOrder === "desc" ? "Recente" : "Antigo"}
      </Text>
      {sortOrder === "desc" ? (
        <ArrowDown size={14} color={theme.iconColor} />
      ) : (
        <ArrowUp size={14} color={theme.iconColor} />
      )}
    </TouchableOpacity>
  );

  if (layout === "stacked") {
    return (
      <View className="mb-4">
        <View className="mb-3">
          <FilterList />
        </View>
        <View className="flex-row justify-end px-6">
          <SortButton />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center px-6 mt-4 mb-2 gap-x-3">
      <View className="flex-1">
        <FilterList />
      </View>
      <SortButton />
    </View>
  );
}
