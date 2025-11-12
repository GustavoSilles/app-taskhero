// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = SymbolViewProps['name'];
type IconMapping = Partial<Record<IconSymbolName, { library: 'material' | 'fontawesome'; name: string }>>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': { library: 'material', name: 'home' },
  'paperplane.fill': { library: 'material', name: 'send' },
  'chevron.left.forwardslash.chevron.right': { library: 'material', name: 'code' },
  'chevron.left': { library: 'material', name: 'chevron-left' },
  'chevron.right': { library: 'material', name: 'chevron-right' },
  target: { library: 'material', name: 'center-focus-strong' },
  'star.fill': { library: 'material', name: 'star' },
  'person.fill': { library: 'material', name: 'person' },
  'info.circle': { library: 'material', name: 'info' },
  pencil: { library: 'material', name: 'edit' },
  checkmark: { library: 'material', name: 'check' },
  'paintbrush.fill': { library: 'material', name: 'brush' },
  'person.circle.fill': { library: 'material', name: 'account-circle' },
  'bolt.fill': { library: 'material', name: 'flash-on' },
  calendar: { library: 'material', name: 'calendar-today' },
  flag: { library: 'material', name: 'flag' },
  clock: { library: 'material', name: 'schedule' },
  'checkmark.circle.fill': { library: 'material', name: 'check-circle' },
  'flag.checkered': { library: 'material', name: 'outlined-flag' },
  'clock.badge.checkmark': { library: 'material', name: 'alarm-on' },
  'lock.shield': { library: 'material', name: 'security' },
  'doc.text': { library: 'material', name: 'description' },
  envelope: { library: 'material', name: 'mail' },
  'sun.max.fill': { library: 'material', name: 'wb-sunny' },
  'moon.fill': { library: 'material', name: 'nightlight-round' },
  'arrow.right.circle.fill': { library: 'material', name: 'arrow-circle-right' },
  'xmark.circle.fill': { library: 'material', name: 'cancel' },
  'chart.bar': { library: 'material', name: 'bar-chart' },
  tag: { library: 'material', name: 'label' },
  checklist: { library: 'material', name: 'checklist' },
  trash: { library: 'material', name: 'delete' },
  'dollarsign.circle.fill': { library: 'material', name: 'monetization-on' },
  'checkmark.seal.fill': { library: 'material', name: 'verified' },
  'flame.fill': { library: 'material', name: 'local-fire-department' },
  'flame.circle.fill': { library: 'material', name: 'local-fire-department' },
  'sunrise.fill': { library: 'material', name: 'light-mode' },
  'moon.stars.fill': { library: 'material', name: 'dark-mode' },
  'crown.fill': { library: 'fontawesome', name: 'crown' },
  'flag.fill': { library: 'material', name: 'flag' },
  'arrow.up.circle.fill': { library: 'material', name: 'trending-up' },
  'book': { library: 'fontawesome', name: 'book' },
  'lock.fill': { library: 'material', name: 'lock' },
  'diamond.fill': { library: 'material', name: 'diamond' },
  'trophy.fill': { library: 'material', name: 'emoji-events' },
  'lightbulb.fill': { library: 'material', name: 'lightbulb' },
  eye: { library: 'material', name: 'visibility' },
  'eye.slash': { library: 'material', name: 'visibility-off' },
  'exclamationmark.circle': { library: 'material', name: 'error' },
  'exclamationmark.circle.fill': { library: 'material', name: 'error' },
  'exclamationmark.triangle': { library: 'material', name: 'warning' },
  'exclamationmark.triangle.fill': { library: 'material', name: 'warning' },
  'info.circle.fill': { library: 'material', name: 'info' },
  xmark: { library: 'material', name: 'close' },
  'cart.fill': { library: 'material', name: 'shopping-cart' },
  'chart.line.uptrend.xyaxis': { library: 'material', name: 'trending-up' },
  'bell.fill': { library: 'material', name: 'notifications' },
  'magnifyingglass': { library: 'material', name: 'search' },
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
  const mappedIcon = MAPPING[name];
  const iconLibrary = mappedIcon?.library ?? 'material';
  const iconName = mappedIcon?.name ?? 'help-outline';

  if (iconLibrary === 'fontawesome') {
    return (
      <FontAwesome5
        color={color}
        size={size}
        name={iconName as any}
        style={style}
      />
    );
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName as any}
      style={style}
    />
  );
}
