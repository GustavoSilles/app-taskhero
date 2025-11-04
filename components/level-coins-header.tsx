import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface LevelCoinsHeaderProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  taskCoins: number;
}

export function LevelCoinsHeader({
  level,
  currentXP,
  xpToNextLevel,
  taskCoins,
}: LevelCoinsHeaderProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const progressPercentage = (currentXP / xpToNextLevel) * 100;

  return (
    <View style={styles.container}>
      {/* TaskCoins */}
      <View style={[styles.coinsContainer, { backgroundColor: 'rgba(255, 193, 7, 0.15)' }]}>
        <IconSymbol name="dollarsign.circle.fill" size={16} color="#F59E0B" />
        <ThemedText type="defaultSemiBold" style={styles.coinValue}>
          {taskCoins}
        </ThemedText>
      </View>

      {/* Divisor */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Level e XP */}
      <View style={styles.levelContainer}>
        <View style={styles.levelInfo}>
          <View style={styles.levelBadge}>
            <IconSymbol name="star.fill" size={12} color={colors.primary} />
            <ThemedText type="defaultSemiBold" style={styles.levelText}>
              Nv. {level}
            </ThemedText>
          </View>
          <ThemedText style={styles.xpText}>
            {currentXP}/{xpToNextLevel}
          </ThemedText>
        </View>
        
        {/* Barra de progresso */}
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: colors.primary,
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
    minWidth: 180,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  coinValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  divider: {
    width: 1,
    height: 24,
    opacity: 0.3,
  },
  levelContainer: {
    flex: 1,
    gap: 3,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 3,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  levelText: {
    fontSize: 12,
  },
  xpText: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
});
