// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = SymbolViewProps['name'];
type IconMapping = Partial<Record<IconSymbolName, ComponentProps<typeof MaterialIcons>['name']>>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  target: 'center-focus-strong',
  'star.fill': 'star',
  'person.fill': 'person',
  'info.circle': 'info',
  pencil: 'edit',
  checkmark: 'check',
  'paintbrush.fill': 'brush',
  'person.circle.fill': 'account-circle',
  'bolt.fill': 'flash-on',
  calendar: 'calendar-today',
  flag: 'flag',
  clock: 'schedule',
  'checkmark.circle.fill': 'check-circle',
  'flag.checkered': 'outlined-flag',
  'clock.badge.checkmark': 'alarm-on',
  'lock.shield': 'security',
  'doc.text': 'description',
  envelope: 'mail',
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nightlight-round',
  'arrow.right.circle.fill': 'arrow-circle-right',
  'xmark.circle.fill': 'cancel',
  'chart.bar': 'bar-chart',
  tag: 'label',
  checklist: 'checklist',
  trash: 'delete',
  'dollarsign.circle.fill': 'monetization-on',
  'checkmark.seal.fill': 'verified',
  'flame.fill': 'local-fire-department',
  'flame.circle.fill': 'local-fire-department',
  'sunrise.fill': 'light-mode',
  'moon.stars.fill': 'dark-mode',
  'crown.fill': 'grade',
  'flag.fill': 'flag',
  'arrow.up.circle.fill': 'trending-up',
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const mappedName = MAPPING[name];

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={mappedName ?? 'help-outline'}
      style={style}
    />
  );
}
