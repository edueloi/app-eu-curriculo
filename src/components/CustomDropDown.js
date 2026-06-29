import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Menu, TextInput } from "react-native-paper";

export default function CustomDropDown({ label, value, setValue, list = [] }) {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  const selectedLabel = list.find((item) => item.value === value)?.label || "";

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.wrapper} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        style={[styles.menu, { width, marginTop: 55 }]}
        contentStyle={{ paddingVertical: 0 }}
        anchor={
          <TouchableOpacity activeOpacity={0.9} onPress={openMenu}>
            <View pointerEvents="none">
              <TextInput
                label={label}
                value={selectedLabel}
                mode="outlined"
                editable={false}
                style={styles.input}
                right={<TextInput.Icon icon="menu-down" />}
              />
            </View>
          </TouchableOpacity>
        }
      >
        <ScrollView style={styles.scrollArea} keyboardShouldPersistTaps="handled">
          {list.map((item) => (
            <Menu.Item
              key={item.value}
              onPress={() => {
                setValue(item.value);
                closeMenu();
              }}
              title={item.label}
              titleStyle={styles.menuItem}
            />
          ))}
        </ScrollView>
      </Menu>
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
  menu: {
    borderRadius: 10,
    elevation: 6,
  },
  scrollArea: {
    maxHeight: 220, // altura máx. do dropdown
  },
  menuItem: {
    fontSize: 15,
    paddingVertical: 6,
  },
});
