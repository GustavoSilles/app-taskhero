import React, { useMemo, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { EditProfileForm } from '../forms/edit-profile-form';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface EditProfileBottomSheetProps {
  initialData: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onSubmit: (data: any) => void;
  onClose: () => void;
  onChange?: (index: number) => void;
}

export const EditProfileBottomSheet = forwardRef<BottomSheet, EditProfileBottomSheetProps>(
  ({ initialData, onSubmit, onClose, onChange }, ref) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
    
    const snapPoints = useMemo(() => ['80%', '95%'], []);    const renderBackdrop = (props: BottomSheetBackdropProps) => (
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
          <EditProfileForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

EditProfileBottomSheet.displayName = 'EditProfileBottomSheet';

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
