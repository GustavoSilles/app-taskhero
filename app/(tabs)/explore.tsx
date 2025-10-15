import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RewardBadge } from '@/components/reward-badge';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useState } from 'react';

// Dados mockados - posteriormente serão substituídos por dados reais
const mockBadges = [
  {
    id: '1',
    title: 'Primeira Meta',
    description: 'Crie sua primeira meta',
    icon: 'flag.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 9, 1),
  },
  {
    id: '2',
    title: 'Dedicado',
    description: 'Complete 10 tarefas',
    icon: 'checkmark.seal.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 9, 5),
  },
  {
    id: '3',
    title: 'Persistente',
    description: 'Use o app por 7 dias seguidos',
    icon: 'flame.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 9, 8),
  },
  {
    id: '4',
    title: 'Mestre',
    description: 'Complete uma meta inteira',
    icon: 'star.fill',
    unlocked: false,
  },
  {
    id: '5',
    title: 'Produtivo',
    description: 'Complete 50 tarefas',
    icon: 'bolt.fill',
    unlocked: false,
  },
  {
    id: '6',
    title: 'Lendário',
    description: 'Alcance o nível 10',
    icon: 'crown.fill',
    unlocked: false,
  },
];

// Avatares disponíveis
const mockAvatars = [
  { id: '1', emoji: '😊', name: 'Feliz', unlocked: true, cost: 0 },
  { id: '2', emoji: '🎯', name: 'Focado', unlocked: true, cost: 0 },
  { id: '3', emoji: '🚀', name: 'Produtivo', unlocked: true, cost: 0 },
  { id: '4', emoji: '⭐', name: 'Estrela', unlocked: false, cost: 50 },
  { id: '5', emoji: '🏆', name: 'Campeão', unlocked: false, cost: 100 },
  { id: '6', emoji: '🔥', name: 'Em Chamas', unlocked: false, cost: 100 },
  { id: '7', emoji: '💎', name: 'Diamante', unlocked: false, cost: 200 },
  { id: '8', emoji: '👑', name: 'Rei', unlocked: false, cost: 500 },
];

export default function RewardsScreen() {
  const [badges] = useState(mockBadges);
  const [avatars] = useState(mockAvatars);
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const totalBadges = badges.length;
  const unlockedAvatars = avatars.filter((a) => a.unlocked).length;
  const totalAvatars = avatars.length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Seção de Emblemas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">🏆 Emblemas</ThemedText>
          <ThemedText style={styles.progressText}>
            {unlockedBadges}/{totalBadges}
          </ThemedText>
        </View>
        <ThemedText style={styles.sectionDescription}>
          Conquiste emblemas completando desafios especiais
        </ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
          {badges.map((badge) => (
            <RewardBadge key={badge.id} {...badge} />
          ))}
        </ScrollView>
      </View>

      {/* Seção de Avatares */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">👤 Avatares</ThemedText>
          <ThemedText style={styles.progressText}>
            {unlockedAvatars}/{totalAvatars}
          </ThemedText>
        </View>
        <ThemedText style={styles.sectionDescription}>
          Compre avatares com TaskCoins ganhas ao completar metas e tarefas
        </ThemedText>

        <View style={styles.avatarsGrid}>
          {avatars.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={[
                styles.avatarItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: selectedAvatar === avatar.id ? colors.primary : colors.border,
                  borderWidth: selectedAvatar === avatar.id ? 3 : 1,
                },
                !avatar.unlocked && styles.avatarLocked,
              ]}
              onPress={() => avatar.unlocked && setSelectedAvatar(avatar.id)}
              disabled={!avatar.unlocked}>
              <ThemedText style={styles.avatarEmoji}>{avatar.emoji}</ThemedText>
              <ThemedText style={styles.avatarName}>{avatar.name}</ThemedText>
              
              {/* Preço em TaskCoins */}
              {!avatar.unlocked && avatar.cost > 0 && (
                <View style={styles.costBadge}>
                  <ThemedText style={styles.costText}>🪙 {avatar.cost}</ThemedText>
                </View>
              )}
              
              {!avatar.unlocked && (
                <View style={styles.lockOverlay}>
                  <ThemedText style={styles.lockIcon}>🔒</ThemedText>
                </View>
              )}
              {selectedAvatar === avatar.id && avatar.unlocked && (
                <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.selectedText}>✓</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Como Desbloquear */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          📖 Como Desbloquear Recompensas
        </ThemedText>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>🏆 Emblemas</ThemedText>
          <ThemedText style={styles.infoDescription}>
            Complete desafios específicos como criar sua primeira meta, manter sequências ou atingir marcos de tarefas
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>👤 Avatares</ThemedText>
          <ThemedText style={styles.infoDescription}>
            Compre avatares usando TaskCoins 🪙 que você ganha completando metas (+50 coins) e tarefas (+10 coins)
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>⬆️ Experiência (XP)</ThemedText>
          <ThemedText style={styles.infoDescription}>
            Ganhe XP completando tarefas (+10 XP) e metas (+100 XP). Ao subir de nível, você desbloqueia emblemas especiais!
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>� Dica</ThemedText>
          <ThemedText style={styles.infoDescription}>
            Mantenha-se consistente! Complete tarefas diariamente para desbloquear recompensas exclusivas
          </ThemedText>
        </ThemedView>
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
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  badgesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  // Estilos dos Avatares
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  avatarItem: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  avatarLocked: {
    opacity: 0.4,
  },
  costBadge: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(255, 193, 7, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  costText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  lockIcon: {
    fontSize: 24,
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Cards de Informação
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
});
