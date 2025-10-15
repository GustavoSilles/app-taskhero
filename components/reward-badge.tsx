import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface RewardBadgeProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export function RewardBadge({
  title,
  description,
  icon,
  unlocked,
  unlockedAt,
}: RewardBadgeProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, !unlocked && styles.locked]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: unlocked ? colors.secondary : colors.disabled,
          },
        ]}>
        <IconSymbol
          name={icon as any}
          size={32}
          color={unlocked ? '#fff' : colors.icon}
        />
      </View>

      <ThemedText
        type="defaultSemiBold"
        style={[styles.title, !unlocked && styles.lockedText]}>
        {title}
      </ThemedText>

      <ThemedText
        style={[styles.description, !unlocked && styles.lockedText]}
        numberOfLines={2}>
        {description}
      </ThemedText>

      {unlocked && unlockedAt && (
        <ThemedText style={styles.unlockedDate}>
          Desbloqueado em {unlockedAt.toLocaleDateString()}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locked: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  lockedText: {
    opacity: 0.5,
  },
  unlockedDate: {
    fontSize: 10,
    marginTop: 8,
    opacity: 0.6,
  },
});
