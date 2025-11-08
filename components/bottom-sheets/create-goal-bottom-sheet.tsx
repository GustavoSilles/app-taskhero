import React, { useMemo, forwardRef, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { GoalForm } from '../forms/goal-form';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface CreateGoalBottomSheetProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  onChange?: (index: number) => void;
}

export const CreateGoalBottomSheet = forwardRef<BottomSheet, CreateGoalBottomSheetProps>(
  ({ onSubmit, onClose, onChange }, ref) => {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [resetKey, setResetKey] = useState(0);
    
    const snapPoints = useMemo(() => ['85%', '95%'], []);

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

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={onClose}
        onChange={handleChange}
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: colors.primary }]}
        backgroundStyle={[styles.background, { backgroundColor: colors.surface }]}
      >
        <BottomSheetView style={styles.container}>
          <GoalForm resetKey={resetKey} onSubmit={onSubmit} onCancel={onClose} />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

CreateGoalBottomSheet.displayName = 'CreateGoalBottomSheet';

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
