import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

const { width } = Dimensions.get('window');

interface BuyAvatarModalProps {
  visible: boolean;
  avatar: {
    id: string;
    name: string;
    cost: number;
    image: any;
  } | null;
  userCoins: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BuyAvatarModal({
  visible,
  avatar,
  userCoins,
  onConfirm,
  onCancel,
}: BuyAvatarModalProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!avatar) return null;

  const hasEnoughCoins = userCoins >= avatar.cost;
  const missingCoins = avatar.cost - userCoins;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
              {/* Imagem do Avatar */}
              <View style={styles.avatarPreview}>
                <Image 
                  source={avatar.image} 
                  style={styles.avatarPreviewImage}
                  resizeMode="cover"
                />
              </View>

              {/* Título */}
              <ThemedText type="subtitle" style={styles.title}>
                Comprar Avatar
              </ThemedText>

              {/* Nome do Avatar */}
              <ThemedText style={styles.avatarName}>
                {avatar.name}
              </ThemedText>

              {/* Custo */}
              <View style={styles.costContainer}>
                <View style={[styles.costBadge, { backgroundColor: 'rgba(255, 193, 7, 0.2)' }]}>
                  <IconSymbol name="dollarsign.circle.fill" size={24} color="#FFC107" />
                  <ThemedText style={styles.costText}>{avatar.cost}</ThemedText>
                  <ThemedText style={styles.costLabel}>TaskCoins</ThemedText>
                </View>
              </View>

              {/* Saldo Atual */}
              <View style={[styles.balanceContainer, { borderColor: colors.border }]}>
                <ThemedText style={styles.balanceLabel}>Seu saldo:</ThemedText>
                <View style={styles.balanceAmount}>
                  <IconSymbol name="dollarsign.circle.fill" size={20} color={colors.primary} />
                  <ThemedText type="defaultSemiBold" style={styles.balanceText}>
                    {userCoins}
                  </ThemedText>
                </View>
              </View>

              {/* Mensagem de erro se não tiver moedas suficientes */}
              {!hasEnoughCoins && (
                <View style={[styles.warningContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
                  <ThemedText style={[styles.warningText, { color: colors.warning }]}>
                    Você precisa de mais {missingCoins} TaskCoins
                  </ThemedText>
                </View>
              )}

              {/* Mensagem de sucesso se tiver moedas suficientes */}
              {hasEnoughCoins && (
                <View style={[styles.successContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                  <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
                  <ThemedText style={[styles.successText, { color: colors.success }]}>
                    Você tem saldo suficiente!
                  </ThemedText>
                </View>
              )}

              {/* Botões */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    { borderColor: colors.border }
                  ]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    Cancelar
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    { 
                      backgroundColor: hasEnoughCoins ? colors.primary : colors.disabled,
                      opacity: hasEnoughCoins ? 1 : 0.5,
                    }
                  ]}
                  onPress={hasEnoughCoins ? onConfirm : undefined}
                  activeOpacity={hasEnoughCoins ? 0.7 : 1}
                  disabled={!hasEnoughCoins}
                >
                  <IconSymbol 
                    name={hasEnoughCoins ? "cart.fill" : "lock.fill"} 
                    size={18} 
                    color="#fff" 
                  />
                  <ThemedText style={styles.confirmButtonText}>
                    {hasEnoughCoins ? 'Comprar' : 'Sem Saldo'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Dica */}
              {!hasEnoughCoins && (
                <ThemedText style={styles.tipText}>
                  💡 Complete metas e tarefas para ganhar mais TaskCoins!
                </ThemedText>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width - 60,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarPreviewImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  costContainer: {
    marginBottom: 16,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  costText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  costLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceText: {
    fontSize: 18,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  confirmButton: {
    // backgroundColor vem via prop
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tipText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
