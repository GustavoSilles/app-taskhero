import { ScrollView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UserProfileHeader } from '@/components/user-profile-header';
import { RewardBadge } from '@/components/reward-badge';
import { StatsCard } from '@/components/stats-card';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { mockUser } from '@/mocks/user';
import { mockGoals } from '@/mocks/goals';
import { BADGE_REQUIREMENTS } from '@/constants/gamification';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signOut, user } = useAuth();

  // Calcular estatísticas
  const totalGoals = mockGoals.length;
  const completedGoals = mockUser.goalsCompletedOnTime + mockUser.goalsCompletedLate;

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Você tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  // Mock de emblemas (depois vem do backend)
  const badges = [
    {
      id: 'first_goal',
      title: BADGE_REQUIREMENTS.FIRST_GOAL.title,
      description: BADGE_REQUIREMENTS.FIRST_GOAL.description,
      icon: BADGE_REQUIREMENTS.FIRST_GOAL.icon,
      unlocked: true,
      unlockedAt: new Date(2025, 0, 5),
    },
    {
      id: 'task_warrior',
      title: BADGE_REQUIREMENTS.TASK_WARRIOR.title,
      description: BADGE_REQUIREMENTS.TASK_WARRIOR.description,
      icon: BADGE_REQUIREMENTS.TASK_WARRIOR.icon,
      unlocked: true,
      unlockedAt: new Date(2025, 1, 10),
    },
    {
      id: 'goal_master',
      title: BADGE_REQUIREMENTS.GOAL_MASTER.title,
      description: BADGE_REQUIREMENTS.GOAL_MASTER.description,
      icon: BADGE_REQUIREMENTS.GOAL_MASTER.icon,
      unlocked: false,
    },
    {
      id: 'week_streak',
      title: BADGE_REQUIREMENTS.WEEK_STREAK.title,
      description: BADGE_REQUIREMENTS.WEEK_STREAK.description,
      icon: BADGE_REQUIREMENTS.WEEK_STREAK.icon,
      unlocked: false,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cabeçalho do Perfil */}
      <View style={styles.section}>
        <UserProfileHeader
          name={user?.name || mockUser.name}
          email={user?.email || mockUser.email}
          avatarUrl={user?.avatarUrl || mockUser.avatarUrl}
          level={user?.level || mockUser.level}
          totalPoints={user?.totalPoints || mockUser.totalPoints}
          taskCoins={mockUser.taskCoins}
          goalsCompleted={completedGoals}
          onEditPress={() => console.log('Editar perfil')}
        />
      </View>

      {/* Estatísticas Detalhadas */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Estatísticas
        </ThemedText>

        <View style={styles.statsGrid}>
          <StatsCard
            icon="target"
            label="Total de Metas"
            value={totalGoals}
            color={colors.primary}
          />
          <StatsCard
            icon="checkmark.circle.fill"
            label="No Prazo"
            value={mockUser.goalsCompletedOnTime}
            color={colors.success}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            icon="clock"
            label="Com Atraso"
            value={mockUser.goalsCompletedLate}
            color={colors.warning}
          />
          <StatsCard
            icon="xmark.circle.fill"
            label="Expiradas"
            value={mockUser.goalsExpired}
            color={colors.error}
          />
        </View>
      </View>

      {/* Emblemas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Emblemas</ThemedText>
          <ThemedText style={styles.badgeCount}>
            {badges.filter((b) => b.unlocked).length}/{badges.length}
          </ThemedText>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {badges.map((badge) => (
            <RewardBadge key={badge.id} {...badge} />
          ))}
        </ScrollView>
      </View>

      {/* Botões de Ação */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => console.log('Configurações')}>
          <ThemedText style={styles.buttonText}>⚙️ Configurações</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton, { borderColor: colors.error }]}
          onPress={handleLogout}>
          <ThemedText style={[styles.buttonText, { color: colors.error }]}>
            🚪 Sair da Conta
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>TaskHero v1.0.0</ThemedText>
        <ThemedText style={styles.footerText}>© 2025 - Todos os direitos reservados</ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
