import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, FlatList, ViewStyle } from "react-native";
import { useThemeTokens } from "../../src/core/design-system/ThemeContext";

export interface SelectOption {
  value: string | null;
  label: string;
}

interface SelectProps {
  value: string | null;
  options: SelectOption[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  style?: ViewStyle;
}

export function Select({ value, options, onChange, placeholder = "Select…", label, style }: SelectProps) {
  const theme = useThemeTokens();
  const { colors, spacing, typography, radius } = theme;
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string | null) => {
    onChange(optionValue);
    setVisible(false);
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={[styles.label, { color: colors.text.secondary, marginBottom: spacing.xs, fontSize: typography.caption.fontSize }]}>{label}</Text>
      ) : null}
      <Pressable
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}: ${displayText}` : displayText}
      >
        <Text style={[styles.triggerText, { color: colors.text.primary, fontSize: typography.body.fontSize }]} numberOfLines={1}>
          {displayText}
        </Text>
        <Text style={[styles.chevron, { color: colors.text.secondary }]}>▼</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.lg,
                padding: spacing.md,
                maxHeight: 320,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary, marginBottom: spacing.md, fontSize: typography.h3.fontSize }]}>
              {label ?? "Select option"}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value ?? "__all__"}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  style={[
                    styles.option,
                    {
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: radius.sm,
                      backgroundColor: value === item.value ? colors.primary + "20" : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: value === item.value ? colors.primary : colors.text.primary,
                        fontSize: typography.body.fontSize,
                        fontWeight: value === item.value ? "600" : "400",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {},
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    minHeight: 44,
  },
  triggerText: {
    flex: 1,
  },
  chevron: {
    fontSize: 10,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {},
  modalTitle: {
    fontWeight: "600",
  },
  option: {},
  optionText: {},
});
