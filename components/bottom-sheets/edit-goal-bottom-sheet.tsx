import React, { useMemo, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
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
    
    const snapPoints = useMemo(() => ['85%', '95%'], []);

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={onClose}
        onChange={onChange}
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: colors.primary }]}
        backgroundStyle={[styles.background, { backgroundColor: colors.surface }]}
      >
        <BottomSheetView style={styles.container}>
          <GoalForm 
            initialData={goalData}
            onSubmit={onSubmit} 
            onCancel={onClose} 
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

EditGoalBottomSheet.displayName = 'EditGoalBottomSheet';

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
