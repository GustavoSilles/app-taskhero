import React, { useMemo, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { EditProfileForm } from '../forms/edit-profile-form';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface EditProfileBottomSheetProps {
  initialData: {
    name: string;
    email: string;
    avatarUrl?: string;
    selectedAvatarId?: string;
  };
  onSubmit: (data: any) => void;
  onClose: () => void;
  onAvatarEdit?: () => void;
  onChange?: (index: number) => void;
}

export const EditProfileBottomSheet = forwardRef<BottomSheet, EditProfileBottomSheetProps>(
  ({ initialData, onSubmit, onClose, onAvatarEdit, onChange }, ref) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

    const snapPoints = useMemo(() => ['100%'], []);
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
        <BottomSheetScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <EditProfileForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
            onAvatarEdit={onAvatarEdit}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

EditProfileBottomSheet.displayName = 'EditProfileBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  handleIndicator: {
    width: 40,
    height: 4,
  },
  background: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
