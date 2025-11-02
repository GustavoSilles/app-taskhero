import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RewardBadge } from '@/components/reward-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
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

// Avatares disponíveis - Heróis
const mockAvatars = [
  { 
    id: '1', 
    image: require('@/assets/imagens-heroes/homem-aranha.jpg'), 
    name: 'Homem-Aranha', 
    unlocked: true, 
    cost: 0 
  },
  { 
    id: '2', 
    image: require('@/assets/imagens-heroes/flash.jpg'), 
    name: 'Flash', 
    unlocked: true, 
    cost: 0 
  },
  { 
    id: '3', 
    image: require('@/assets/imagens-heroes/arqueiro-verde.jpg'), 
    name: 'Arqueiro Verde', 
    unlocked: true, 
    cost: 0 
  },
  { 
    id: '4', 
    image: require('@/assets/imagens-heroes/deadpool.jpg'), 
    name: 'Deadpool', 
    unlocked: false, 
    cost: 50 
  },
  { 
    id: '5', 
    image: require('@/assets/imagens-heroes/demolidor.jpg'), 
    name: 'Demolidor', 
    unlocked: false, 
    cost: 100 
  },
  { 
    id: '6', 
    image: require('@/assets/imagens-heroes/invencivel.jpg'), 
    name: 'Invencível', 
    unlocked: false, 
    cost: 150 
  },
  { 
    id: '7', 
    image: require('@/assets/imagens-heroes/homem-aranho-preto.jpg'), 
    name: 'Aranha Preto', 
    unlocked: false, 
    cost: 200 
  },
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
          <View style={styles.sectionTitleContainer}>
            <IconSymbol name="trophy.fill" size={20} color={colors.primary} />
            <ThemedText type="subtitle" style={styles.sectionTitleText}>Emblemas</ThemedText>
          </View>
          <ThemedText style={styles.progressText}>
            {unlockedBadges}/{totalBadges}
          </ThemedText>
        </View>
        <ThemedText style={styles.sectionDescription}>
          Conquiste emblemas completando desafios especiais
        </ThemedText>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.badgesScroll}
          contentContainerStyle={styles.badgesScrollContent}
        >
          {badges.map((badge) => (
            <RewardBadge key={badge.id} {...badge} />
          ))}
        </ScrollView>
      </View>

      {/* Seção de Avatares */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <IconSymbol name="person.circle.fill" size={20} color={colors.primary} />
            <ThemedText type="subtitle" style={styles.sectionTitleText}>Avatares</ThemedText>
          </View>
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
              ]}
              onPress={() => avatar.unlocked && setSelectedAvatar(avatar.id)}
              disabled={!avatar.unlocked}>
              <View style={styles.avatarImageContainer}>
                <Image 
                  source={avatar.image} 
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
                {/* Overlay de bloqueio sobre a imagem */}
                {!avatar.unlocked && (
                  <View style={styles.lockOverlay}>
                    <IconSymbol name="lock.fill" size={24} color="#fff" />
                  </View>
                )}
                {/* Preço em TaskCoins - fora do backdrop */}
                {!avatar.unlocked && avatar.cost > 0 && (
                  <View style={styles.costBadge}>
                    <View style={styles.costContent}>
                      <IconSymbol name="dollarsign.circle.fill" size={15} color="#000000" />
                      <ThemedText style={styles.costText}>{avatar.cost}</ThemedText>
                    </View>
                  </View>
                )}
              </View>
              <ThemedText style={styles.avatarName} numberOfLines={1}>
                {avatar.name}
              </ThemedText>
              {selectedAvatar === avatar.id && avatar.unlocked && (
                <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                  <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Como Desbloquear */}
      <View style={styles.section}>
        <View style={[styles.sectionTitleContainer, styles.sectionTitleWithSpacing]}>
          <IconSymbol name="book" size={20} color={colors.primary} />
          <ThemedText type="subtitle" style={[styles.sectionTitle, styles.sectionTitleText]}>Como Desbloquear Recompensas</ThemedText>
        </View>

        <ThemedView style={styles.infoCard}>
          <View style={styles.infoTitleContainer}>
            <IconSymbol name="trophy.fill" size={16} color={colors.primary} />
            <ThemedText style={styles.infoTitle}>Emblemas</ThemedText>
          </View>
          <ThemedText style={styles.infoDescription}>
            Complete desafios específicos como criar sua primeira meta, manter sequências ou atingir marcos de tarefas
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <View style={styles.infoTitleContainer}>
            <IconSymbol name="person.circle.fill" size={16} color={colors.primary} />
            <ThemedText style={styles.infoTitle}>Avatares</ThemedText>
          </View>
          <ThemedText style={styles.infoDescription}>
            Compre avatares usando TaskCoins que você ganha completando metas (+50 coins) e tarefas (+10 coins)
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <View style={styles.infoTitleContainer}>
            <IconSymbol name="arrow.up.circle.fill" size={16} color={colors.primary} />
            <ThemedText style={styles.infoTitle}>Experiência (XP)</ThemedText>
          </View>
          <ThemedText style={styles.infoDescription}>
            Ganhe XP completando tarefas (+10 XP) e metas (+100 XP). Ao subir de nível, você desbloqueia emblemas especiais!
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <View style={styles.infoTitleContainer}>
            <IconSymbol name="lightbulb.fill" size={16} color={colors.primary} />
            <ThemedText style={styles.infoTitle}>Dica</ThemedText>
          </View>
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
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-start',
  },
  sectionTitleWithSpacing: {
    marginBottom: 16,
  },
  sectionTitleText: {
    marginBottom: 0,
    lineHeight: 24,
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
  },
  badgesScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  // Estilos dos Avatares
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  avatarItem: {
    width: '31%',
    aspectRatio: 0.7,
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarImageContainer: {
    width: '100%',
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  avatarName: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 2,
  },
  costBadge: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  costContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 193, 7, 0.64)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  costText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    zIndex: 1,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    marginBottom: 0,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoDescription: {
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 20,
  },
});
