import React, { useMemo, forwardRef, useState, useEffect } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
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
  isLoading?: boolean;
}

export const EditProfileBottomSheet = forwardRef<BottomSheet, EditProfileBottomSheetProps>(
  ({ initialData, onSubmit, onClose, onAvatarEdit, onChange, isLoading = false }, ref) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [keyboardHeight, setKeyboardHeight] = useState(0);

    const snapPoints = useMemo(() => ['100%'], []);

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

    const handleClose = () => {
      Keyboard.dismiss();
      onClose();
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={handleClose}
        onChange={onChange}
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
          <EditProfileForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={handleClose}
            onAvatarEdit={onAvatarEdit}
            isLoading={isLoading}
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
    // paddingBottom é definido dinamicamente baseado no estado do teclado
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
