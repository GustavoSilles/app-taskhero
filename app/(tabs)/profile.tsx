import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ThemedText } from '@/components/themed-text';
import { UserProfileHeader } from '@/components/user-profile-header';
import { RewardBadge } from '@/components/reward-badge';
import { StatsCard } from '@/components/stats-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { mockUser } from '@/mocks/user';
import { mockGoals } from '@/mocks/goals';
import { getUnlockedBadges } from '@/mocks/badges';
import { useAuth } from '@/contexts/auth-context';
import { EditProfileBottomSheet } from '@/components/bottom-sheets/edit-profile-bottom-sheet';
import { ThemeSelector } from '@/components/theme-selector';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { useToast } from '@/contexts/toast-context';

export default function ProfileScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signOut, user, updateUserProfile } = useAuth();
  const toast = useToast();
  const editProfileBottomSheetRef = useRef<BottomSheet>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Calcular estatísticas
  const totalGoals = mockGoals.length;
  const completedGoals = mockUser.goalsCompletedOnTime + mockUser.goalsCompletedLate;

  const handleEditProfile = () => {
    editProfileBottomSheetRef.current?.snapToIndex(0);
  };

  const handleSaveProfile = async (data: any) => {
    if (isUpdatingProfile) return;
    
    setIsUpdatingProfile(true);
    
    try {
      // Prepara os dados para envio
      const updateData: any = {};
      
      if (data.name !== user?.name) {
        updateData.name = data.name;
      }
      
      if (data.email !== user?.email) {
        updateData.email = data.email;
      }
      
      // Verifica se está alterando senha
      const isChangingPassword = data.currentPassword && data.newPassword;
      
      if (isChangingPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }
      
      // Chama a API para atualizar o perfil
      await updateUserProfile(updateData);
      
      const successMessage = isChangingPassword 
        ? 'Suas informações e senha foram atualizadas com sucesso!'
        : 'Suas informações foram atualizadas com sucesso!';
      
      editProfileBottomSheetRef.current?.close();
      
      // Pequeno delay para fechar o bottom sheet antes de mostrar o toast
      setTimeout(() => {
        toast.success('Perfil Atualizado', successMessage);
      }, 300);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(
        'Erro ao Atualizar', 
        error.message || 'Não foi possível atualizar seu perfil. Tente novamente.'
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCloseEditProfile = () => {
    editProfileBottomSheetRef.current?.close();
  };

  const handleAvatarEdit = () => {
    editProfileBottomSheetRef.current?.close();
    // Navegar para a tela de recompensas (explore) com scroll para avatares
    // Adiciona timestamp para garantir que o scroll funcione toda vez
    router.push(`/(tabs)/explore?scrollToAvatars=true&t=${Date.now()}`);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    signOut();
    router.replace('/(auth)/login');
  };

  // No perfil, mostramos APENAS os emblemas que o usuário desbloqueou
  const badges = getUnlockedBadges();

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Cabeçalho do Perfil */}
        <View style={styles.section}>
          <UserProfileHeader
            name={user?.name || mockUser.name}
            email={user?.email || mockUser.email}
            avatarUrl={user?.avatarUrl || mockUser.avatarUrl}
            selectedAvatarId={user?.selectedAvatarId || mockUser.selectedAvatarId}
            level={user?.level || mockUser.level}
            totalPoints={user?.totalPoints || mockUser.totalPoints}
            taskCoins={mockUser.taskCoins}
            goalsCompleted={completedGoals}
            onEditPress={handleEditProfile}
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
          <ThemedText type="subtitle">Meus Emblemas</ThemedText>
          <ThemedText style={styles.badgeCount}>
            {badges.length}
          </ThemedText>
        </View>

        {badges.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.badgesScrollContent}
            style={styles.badgesScroll}
          >
            {badges.map((badge) => (
              <RewardBadge key={badge.id} {...badge} />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.emptyBadges, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="trophy" size={32} color={colors.icon} style={{ opacity: 0.3 }} />
            <ThemedText style={styles.emptyBadgesText}>
              Você ainda não possui emblemas
            </ThemedText>
            <ThemedText style={styles.emptyBadgesSubtext}>
              Complete desafios para desbloquear!
            </ThemedText>
          </View>
        )}
      </View>

      {/* Preferências */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Preferências
        </ThemedText>
        
        <View style={[styles.preferenceItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.preferenceInfo}>
            <IconSymbol 
              name={colorScheme === 'dark' ? 'moon.fill' : 'sun.max.fill'} 
              size={20} 
              color={colors.text} 
            />
            <View style={styles.preferenceText}>
              <ThemedText type="defaultSemiBold">Tema</ThemedText>
              <ThemedText style={styles.preferenceDescription}>
                {colorScheme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
              </ThemedText>
            </View>
          </View>
          <ThemeSelector />
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton, { borderColor: colors.error, marginBottom: 0 }]}
          onPress={handleLogout}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <IconSymbol name="arrow.right.circle.fill" size={20} color={colors.error} />
            <ThemedText style={[styles.buttonText, { color: colors.error }]}>
              Sair da Conta
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>TaskHero v1.0.0</ThemedText>
        <ThemedText style={styles.footerText}>© 2025 - Todos os direitos reservados</ThemedText>
      </View>
    </ScrollView>

      {/* Bottom Sheet de Edição de Perfil */}
      <EditProfileBottomSheet
        ref={editProfileBottomSheetRef}
        initialData={{
          name: user?.name || mockUser.name,
          email: user?.email || mockUser.email,
          avatarUrl: user?.avatarUrl || mockUser.avatarUrl,
          selectedAvatarId: user?.selectedAvatarId || mockUser.selectedAvatarId,
        }}
        onSubmit={handleSaveProfile}
        onClose={handleCloseEditProfile}
        onAvatarEdit={handleAvatarEdit}
        isLoading={isUpdatingProfile}
      />

      {/* Modal de Confirmação de Logout */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Sair da Conta"
        message="Você tem certeza que deseja sair?"
        confirmText="Sair"
        cancelText="Cancelar"
        confirmColor={colors.error}
        icon="arrow.right.circle.fill"
        iconColor={colors.error}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
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
  badgesScroll: {
    marginHorizontal: -20,
  },
  badgesScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
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
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceDescription: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  emptyBadges: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyBadgesText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyBadgesSubtext: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'center',
  },
});
