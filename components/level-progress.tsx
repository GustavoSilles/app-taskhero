import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { getLevelInfo, getLevelName, getMotivationalMessage } from '@/utils/level-calculation';

interface LevelProgressProps {
  goalsCompletedOnTime: number;
}

export function LevelProgress({
  goalsCompletedOnTime,
}: LevelProgressProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const levelInfo = getLevelInfo(goalsCompletedOnTime);
  const levelName = getLevelName(levelInfo.level);
  const motivationalText = getMotivationalMessage(levelInfo.progress);

  const progress = levelInfo.progress;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <IconSymbol name="star.fill" size={20} color={colors.primary} />
          <View>
            <ThemedText type="defaultSemiBold" style={styles.levelText}>
              Nível {levelInfo.level} - {levelName}
            </ThemedText>
            <ThemedText style={styles.levelSubtext}>
              {levelInfo.currentGoals} metas concluídas no prazo
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: colors.secondary,
            },
          ]}
        />
      </View>

      <ThemedText style={styles.motivationalText}>
        {motivationalText}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelText: {
    fontSize: 16,
  },
  levelSubtext: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  footer: {
    marginBottom: 8,
  },
  progressInfo: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  motivationalText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
