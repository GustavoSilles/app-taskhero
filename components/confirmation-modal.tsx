import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import type { SFSymbols6_0 } from 'sf-symbols-typescript';

const { width } = Dimensions.get('window');

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  icon?: SFSymbols6_0;
  iconColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor,
  icon = 'exclamationmark.triangle',
  iconColor,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const finalConfirmColor = confirmColor || colors.primary;
  const finalIconColor = iconColor || colors.warning;

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
              {/* Ícone */}
              <View style={[styles.iconContainer, { backgroundColor: `${finalIconColor}15` }]}>
                <IconSymbol name={icon} size={32} color={finalIconColor} />
              </View>

              {/* Título */}
              <ThemedText type="subtitle" style={styles.title}>
                {title}
              </ThemedText>

              {/* Mensagem */}
              <ThemedText style={styles.message}>
                {message}
              </ThemedText>

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
                    {cancelText}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    { backgroundColor: finalConfirmColor }
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.confirmButtonText}>
                    {confirmText}
                  </ThemedText>
                </TouchableOpacity>
              </View>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
});
