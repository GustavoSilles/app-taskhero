import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { GoalStatus } from '@/types';
import { getStatusInfo } from '@/utils/goal-status';

interface GoalStatusBadgeProps {
  status: GoalStatus;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function GoalStatusBadge({
  status,
  size = 'medium',
  showLabel = true,
}: GoalStatusBadgeProps) {
  const statusInfo = getStatusInfo(status);

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;

  return (
    <View style={[styles.container, size === 'small' && styles.containerSmall]}>
      <IconSymbol
        name={statusInfo.icon as any}
        size={iconSize}
        color={statusInfo.color}
      />
      {showLabel && (
        <ThemedText
          style={[
            styles.label,
            { color: statusInfo.color, fontSize },
          ]}>
          {statusInfo.label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    gap: 6,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  label: {
    fontWeight: '600',
  },
});
