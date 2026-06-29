import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  UIManager,
  findNodeHandle,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Menu, TextInput } from "react-native-paper";

export default function CustomDropDown({ label, value, setValue, list = [] }) {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 40 });
  const closingRef = useRef(false);

  const screenHeight = Dimensions.get("window").height;
  const selectedLabel = list.find((item) => item.value === value)?.label || "";

  const openMenu = () => {
    if (closingRef.current) return;
    if (wrapperRef.current) {
      const handle = findNodeHandle(wrapperRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          const spaceBelow = screenHeight - (y + height);
          let newY;

          if (spaceBelow > 250) {
            newY = y + height + 40;
          } else {
            newY = y - 220 - 3;
          }

          setAnchor({ x, y: newY, width, height });
          setVisible(true);
        });
      }
    }
  };

  const closeMenu = () => {
    closingRef.current = true;
    setVisible(false);
    setTimeout(() => { closingRef.current = false; }, 300);
  };

  return (
    <View ref={wrapperRef} style={styles.wrapper}>
      <TouchableOpacity activeOpacity={0.9} onPress={visible ? closeMenu : openMenu}>
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

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={{ x: anchor.x, y: anchor.y }}
        style={[styles.menu, { width: anchor.width }]}
      >
        <ScrollView style={styles.scrollArea}>
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
