import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  UIManager,
  findNodeHandle,
  Dimensions,
} from "react-native";
import { Menu, TextInput } from "react-native-paper";

export default function CustomDropDown({ label, value, setValue, list = [] }) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 40 });

  const screenHeight = Dimensions.get("window").height;
  const selectedLabel = list.find((item) => item.value === value)?.label || "";

  const openMenu = () => {
    if (wrapperRef.current) {
      const handle = findNodeHandle(wrapperRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          const spaceBelow = screenHeight - (y + height);
          let newY;

          if (spaceBelow > 250) {
            // tem espaço suficiente embaixo → abre para baixo
            newY = y + height + 40; // offset maior ↓
          } else {
            // pouco espaço → abre para cima
            newY = y - 220 - 3; // altura máxima -3px ↑
          }

          setAnchor({ x, y: newY, width, height });
          setVisible(true);
        });
      }
    }
  };

  return (
    <View ref={wrapperRef} style={styles.wrapper}>
      <TextInput
        label={label}
        value={selectedLabel}
        mode="outlined"
        editable={false}
        style={styles.input}
        right={<TextInput.Icon icon="menu-down" onPress={openMenu} />}
      />

      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={{ x: anchor.x, y: anchor.y }}
        style={[styles.menu, { width: anchor.width }]}
      >
        <ScrollView style={styles.scrollArea}>
          {list.map((item) => (
            <Menu.Item
              key={item.value}
              onPress={() => {
                setValue(item.value);
                setVisible(false);
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
