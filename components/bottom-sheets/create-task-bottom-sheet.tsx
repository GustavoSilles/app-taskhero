import React, { useMemo, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
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
    
    const snapPoints = useMemo(() => ['50%', '65%'], []);

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
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: colors.primary }]}
        backgroundStyle={[styles.background, { backgroundColor: colors.surface }]}
      >
        <BottomSheetView style={styles.container}>
          <TaskForm onSubmit={onSubmit} onCancel={onClose} />
        </BottomSheetView>
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
