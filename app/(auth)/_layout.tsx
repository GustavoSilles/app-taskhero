import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

export default function AuthLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
