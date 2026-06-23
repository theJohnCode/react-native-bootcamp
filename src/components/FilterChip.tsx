/**
 * ============================================================
 * ZoweHub — FilterChip Component
 * ============================================================
 *
 * WEEK 2 CONCEPT: Reusable Components with Simple Props
 *
 * A FilterChip is a small pressable pill/button used for
 * filtering listings. It appears in the filter bar on the
 * Home and Explore screens.
 *
 * This is a great example of a SMALL, FOCUSED component.
 * It does ONE thing: show a label and respond to a press.
 *
 * PROPS:
 * - label: the text to show (e.g. "Brand", "Condition")
 * - selected: whether this chip is currently active
 * - onPress: what happens when the chip is tapped
 * - hasDropdown: whether to show a ▾ arrow (for dropdown filters)
 * ============================================================
 */

import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { ThemedText } from './ui/theme-text';

// ---------------------------------------------------------------
// PROPS TYPE
// ---------------------------------------------------------------

type FilterChipProps = {
  /** The text displayed on the chip */
  label: string;

  /** Whether this chip is currently active/selected */
  selected: boolean;

  /** Called when the chip is pressed */
  onPress: () => void;

  /**
   * If true, shows a ▾ dropdown arrow after the label.
   * This hints to the user that pressing will show more options.
   */
  hasDropdown?: boolean;
};

// ---------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------

export function FilterChip({ label, selected, onPress, hasDropdown }: FilterChipProps) {
  return (
    /**
     * Pressable with a style function — the style changes
     * based on whether the chip is being pressed right now.
     *
     * WEEK 1 CONCEPT: Conditional Styles
     * We use the spread operator (...) and && to conditionally
     * add styles. If 'selected' is true, the selected style is applied.
     * If 'pressed' is true, the opacity changes.
     */
    <Pressable
      onPress={onPress}
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
        {/* Show dropdown arrow if hasDropdown is true */}
        {hasDropdown ? ' ▾' : ''}
      </ThemedText>
    </Pressable>
  );
}

// ---------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20, // Fully rounded pill shape
    borderWidth: 1,
    borderColor: '#D8E6DD',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#1D9E75', // ZoweHub green when selected
    borderColor: '#1D9E75',
  },
  chipText: {
    color: '#3C4A3F',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#FFFFFF', // White text on green background
  },
  pressed: {
    opacity: 0.7,
  },
});
