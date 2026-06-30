import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
} from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomDropDown({ label, value, setValue, list = [] }) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const selectedLabel = list.find((item) => item.value === value)?.label || "";

  const handleSelect = (item) => {
    setValue(item.value);
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Campo clicável */}
      <TouchableOpacity activeOpacity={0.85} onPress={() => setVisible(true)}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={selectedLabel}
            mode="outlined"
            editable={false}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            right={
              <TextInput.Icon
                icon={visible ? "menu-up" : "menu-down"}
              />
            }
          />
        </View>
      </TouchableOpacity>

      {/* Modal de seleção */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
                {/* Cabeçalho */}
                <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
                  <Text style={[styles.headerLabel, { color: theme.colors.onSurface }]}>
                    {label}
                  </Text>
                  <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                </View>

                {/* Lista de opções */}
                <SafeAreaView>
                  <FlatList
                    data={list}
                    keyExtractor={(item) => item.value}
                    style={styles.list}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => {
                      const isSelected = item.value === value;
                      return (
                        <TouchableOpacity
                          style={[
                            styles.option,
                            isSelected && {
                              backgroundColor: theme.colors.primaryContainer,
                            },
                          ]}
                          onPress={() => handleSelect(item)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: isSelected
                                  ? theme.colors.primary
                                  : theme.colors.onSurface,
                                fontWeight: isSelected ? "800" : "500",
                              },
                            ]}
                          >
                            {item.label}
                          </Text>
                          {isSelected && (
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={18}
                              color={theme.colors.primary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.colors.outlineVariant,
                          opacity: 0.4,
                          marginHorizontal: 16,
                        }}
                      />
                    )}
                  />
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    maxHeight: 350,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 0,
  },
  optionText: {
    fontSize: 15,
    flex: 1,
  },
});
