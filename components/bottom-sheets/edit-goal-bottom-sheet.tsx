import React, { useMemo, forwardRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { GoalForm } from '../forms/goal-form';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface GoalData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface EditGoalBottomSheetProps {
  goalData: GoalData;
  onSubmit: (data: GoalData) => void;
  onClose: () => void;
  onChange?: (index: number) => void;
}

export const EditGoalBottomSheet = forwardRef<BottomSheet, EditGoalBottomSheetProps>(
  ({ goalData, onSubmit, onClose, onChange }, ref) => {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [resetKey, setResetKey] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const snapPoints = useMemo(() => ['85%', '100%'], []);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
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
      onChange?.(index);
    }, [onChange]);

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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <GoalForm 
            resetKey={resetKey}
            initialData={goalData}
            onSubmit={onSubmit} 
            onCancel={handleClose} 
          />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

EditGoalBottomSheet.displayName = 'EditGoalBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom é definido dinamicamente baseado no estado do teclado
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
