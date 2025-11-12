import React, { useMemo, forwardRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { TaskForm } from '../forms/task-form';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface CreateTaskBottomSheetProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export const CreateTaskBottomSheet = forwardRef<BottomSheet, CreateTaskBottomSheetProps>(
  ({ onSubmit, onClose }, ref) => {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    
    const snapPoints = useMemo(() => {
      return isKeyboardVisible ? ['90%'] : ['50%', '65%'];
    }, [isKeyboardVisible]);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardVisible(true);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
      });

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    const handleChange = useCallback((index: number) => {
      // Quando o bottom sheet fecha (index < 0), reseta o formulário
      if (index < 0) {
        setResetKey(prev => prev + 1);
      }
    }, []);

    const handleClose = useCallback(() => {
      Keyboard.dismiss();
      onClose();
    }, [onClose]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={handleClose}
        onChange={handleChange}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: colors.primary }]}
        backgroundStyle={[styles.background, { backgroundColor: colors.surface }]}
      >
        <BottomSheetScrollView 
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TaskForm resetKey={resetKey} onSubmit={onSubmit} onCancel={handleClose} />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

CreateTaskBottomSheet.displayName = 'CreateTaskBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  handleIndicator: {
    width: 40,
    height: 4,
  },
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
