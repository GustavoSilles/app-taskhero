import { ScrollView, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RewardBadge } from '@/components/reward-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { useState, useRef, useEffect } from 'react';
import { AVATARS } from '@/constants/avatars';
import { BuyAvatarModal } from '@/components/buy-avatar-modal';
import { mockUser } from '@/mocks/user';
import { getAllBadges } from '@/mocks/badges';

export default function RewardsScreen() {
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const avatarsSectionRef = useRef<View>(null);
  
  // Na tela de recompensas, mostramos TODOS os emblemas disponíveis
  const [badges] = useState(getAllBadges());
  const [avatars, setAvatars] = useState(AVATARS);
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, updateSelectedAvatar } = useAuth();
  const toast = useToast();
  
  // Usa o avatar do usuário ou o padrão
  const [selectedAvatar, setSelectedAvatar] = useState(user?.selectedAvatarId || '1');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedAvatarToBuy, setSelectedAvatarToBuy] = useState<typeof AVATARS[0] | null>(null);
  
  // TaskCoins do usuário (depois vem do backend)
  const [userCoins, setUserCoins] = useState(mockUser.taskCoins);

  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const totalBadges = badges.length;
  const unlockedAvatars = avatars.filter((a) => a.unlocked).length;
  const totalAvatars = avatars.length;

  // Scroll para a seção de avatares quando o parâmetro scrollToAvatars é true
  // O timestamp (params.t) força o efeito a rodar toda vez
  useEffect(() => {
    if (params.scrollToAvatars === 'true') {
      setTimeout(() => {
        avatarsSectionRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
          },
          () => {}
        );
      }, 100);
    }
  }, [params.scrollToAvatars, params.t]);

  // Atualiza o avatar selecionado quando o usuário muda
  useEffect(() => {
    if (user?.selectedAvatarId) {
      setSelectedAvatar(user.selectedAvatarId);
    }
  }, [user?.selectedAvatarId]);

  // Função para selecionar ou comprar avatar
  const handleSelectAvatar = (avatarId: string) => {
    const avatar = avatars.find(a => a.id === avatarId);
    
    if (!avatar) return;
    
    // Se o avatar está desbloqueado, seleciona
    if (avatar.unlocked) {
      setSelectedAvatar(avatarId);
      updateSelectedAvatar(avatarId);
    } else {
      // Se está bloqueado, abre modal de compra
      setSelectedAvatarToBuy(avatar);
      setShowBuyModal(true);
    }
  };

  // Função para confirmar compra
  const handleConfirmPurchase = () => {
    if (!selectedAvatarToBuy) return;
    
    // Verifica se tem saldo suficiente
    if (userCoins < selectedAvatarToBuy.cost) {
      setShowBuyModal(false);
      toast.error('Saldo Insuficiente', `Você precisa de mais ${selectedAvatarToBuy.cost - userCoins} TaskCoins`);
      return;
    }

    // Deduz as moedas
    setUserCoins(prev => prev - selectedAvatarToBuy.cost);

    // Desbloqueia o avatar
    setAvatars(prev => 
      prev.map(avatar => 
        avatar.id === selectedAvatarToBuy.id 
          ? { ...avatar, unlocked: true }
          : avatar
      )
    );

    // Seleciona automaticamente o avatar comprado
    setSelectedAvatar(selectedAvatarToBuy.id);
    updateSelectedAvatar(selectedAvatarToBuy.id);

    // Fecha o modal
    setShowBuyModal(false);

    // Mostra toast de sucesso
    setTimeout(() => {
      toast.success(
        'Avatar Desbloqueado! 🎉',
        `${selectedAvatarToBuy.name} foi adicionado à sua coleção!`
      );
    }, 300);

    // Limpa o avatar selecionado
    setSelectedAvatarToBuy(null);
  };

  // Função para cancelar compra
  const handleCancelPurchase = () => {
    setShowBuyModal(false);
    setSelectedAvatarToBuy(null);
  };

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
          Todos os emblemas disponíveis no TaskHero. Conquiste-os completando desafios especiais!
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
      <View ref={avatarsSectionRef} style={styles.section}>
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
              onPress={() => handleSelectAvatar(avatar.id)}
              activeOpacity={0.7}>
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

      {/* Modal de Compra de Avatar */}
      <BuyAvatarModal
        visible={showBuyModal}
        avatar={selectedAvatarToBuy}
        userCoins={userCoins}
        onConfirm={handleConfirmPurchase}
        onCancel={handleCancelPurchase}
      />
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
