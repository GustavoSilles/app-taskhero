import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { getLevelName } from '@/utils/level-calculation';
import { getAvatarImage } from '@/constants/avatars';
import TextTicker from 'react-native-text-ticker';

interface UserProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  selectedAvatarId?: string;
  level: number;
  totalPoints: number;
  taskCoins: number;
  goalsCompleted: number;
  onEditPress?: () => void;
  isLoadingStats?: boolean;
}

export function UserProfileHeader({
  name,
  email,
  avatarUrl,
  selectedAvatarId,
  level,
  totalPoints,
  taskCoins,
  goalsCompleted,
  onEditPress,
  isLoadingStats = false,
}: UserProfileHeaderProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Prioriza avatar de herói selecionado sobre avatarUrl
  const heroAvatarImage = selectedAvatarId ? getAvatarImage(selectedAvatarId) : null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {heroAvatarImage ? (
            <Image source={heroAvatarImage} style={styles.avatar} />
          ) : avatarUrl ? (
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
          <TextTicker
            style={[styles.statLabel, { color: colors.text }]}
            duration={3000}
            loop
            bounce
            repeatSpacer={10}
            marqueeDelay={1000}>
            XP
          </TextTicker>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
            <IconSymbol name="dollarsign.circle.fill" size={24} color="#F59E0B" />
            <ThemedText type="defaultSemiBold" style={styles.coinValue}>
              {taskCoins}
            </ThemedText>
          </View>
          <TextTicker
            style={[styles.statLabel, { color: colors.text }]}
            duration={3000}
            loop
            bounce
            repeatSpacer={10}
            marqueeDelay={1000}>
            Coins
          </TextTicker>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statItem}>
          <ThemedText type="defaultSemiBold" style={styles.statValue}>
            {isLoadingStats ? '...' : goalsCompleted}
          </ThemedText>
          <TextTicker
            style={[styles.statLabel, { color: colors.text }]}
            duration={3000}
            loop
            bounce
            repeatSpacer={10}
            marqueeDelay={1000}>
            Metas Concluídas
          </TextTicker>
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
    paddingHorizontal: 10,
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
