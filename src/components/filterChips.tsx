/**
 * ============================================================
 * ZoweHub - FilterChip Component
 * ============================================================
 *
 * A FilterChip is a small pressable dropdown used for filtering
 * listings. It shows the current filter label, opens a list of
 * choices, and reports the selected option back to the screen.
 * ============================================================
 */

import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './ui/theme-text';

type FilterChipProps = {
  /** The text displayed on the chip */
  label: string;

  /** Whether this chip is currently active/selected */
  selected: boolean;

  /** The dropdown options users can choose from */
  options: readonly string[];

  /** The currently selected option */
  selectedValue: string;

  /** Called when the user chooses an option */
  onSelect: (value: string) => void;
};

export function FilterChip({ label, selected, options, selectedValue, onSelect }: FilterChipProps) {
  const triggerRef = useRef<View>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 180 });

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const menuWidth = Math.max(width, 180);
      const left = Math.min(Math.max(16, x), Math.max(16, windowWidth - menuWidth - 16));

      setMenuPosition({
        top: y + height + Spacing.one,
        left,
        width: menuWidth,
      });
      setIsOpen(true);
    });
  };

  const chooseOption = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <View>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, selected }}
        onPress={openDropdown}
        style={({ pressed }) => [
          styles.chip,
          selected && styles.chipSelected,
          pressed && styles.pressed,
        ]}
      >
        <ThemedText
          type="smallBold"
          style={[
            styles.chipText,
            selected && styles.chipTextSelected,
          ]}
        >
          {label}
        </ThemedText>
      </Pressable>

      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.menu,
              {
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
              },
            ]}
          >
            {options.map((option) => {
              const isSelectedOption = option === selectedValue;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isSelectedOption }}
                  onPress={() => chooseOption(option)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    isSelectedOption && styles.menuItemSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <ThemedText
                    type={isSelectedOption ? 'smallBold' : 'small'}
                    style={[
                      styles.menuItemText,
                      isSelectedOption && styles.menuItemTextSelected,
                    ]}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8E6DD',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#1D9E75',
    borderColor: '#1D9E75',
  },
  chipText: {
    color: '#3C4A3F',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E6DD',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF4F0',
  },
  menuItemSelected: {
    backgroundColor: '#E6F6F0',
  },
  menuItemText: {
    color: '#3C4A3F',
    fontSize: 14,
  },
  menuItemTextSelected: {
    color: '#146B43',
  },
});