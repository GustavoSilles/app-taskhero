import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { getLevelName } from '@/utils/level-calculation';

interface UserProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  totalPoints: number;
  taskCoins: number;
  goalsCompleted: number;
  onEditPress?: () => void;
}

export function UserProfileHeader({
  name,
  email,
  avatarUrl,
  level,
  totalPoints,
  taskCoins,
  goalsCompleted,
  onEditPress,
}: UserProfileHeaderProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.secondary },
              ]}>
              <IconSymbol name="person.fill" size={40} color="#fff" />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={onEditPress}>
            <IconSymbol name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <ThemedText type="subtitle" style={styles.name}>
            {name}
          </ThemedText>
          <ThemedText style={styles.email}>{email}</ThemedText>

          <View style={styles.levelBadge}>
            <IconSymbol name="star.fill" size={16} color={colors.primary} />
            <ThemedText type="defaultSemiBold" style={styles.levelText}>
              Nível {level} - {getLevelName(level)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {totalPoints}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Pontos</ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
            <IconSymbol name="dollarsign.circle.fill" size={24} color="#F59E0B" />
            <ThemedText type="defaultSemiBold" style={styles.coinValue}>
              {taskCoins}
            </ThemedText>
          </View>
          <ThemedText style={styles.statLabel}>TaskCoins</ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {goalsCompleted}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Metas Concluídas</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelText: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    marginBottom: 4,
  },
  coinValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    width: 1,
    height: 40,
  },
});
