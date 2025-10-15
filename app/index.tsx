import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Pequeno delay para garantir que o context está pronto
    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated]);

  // Mostra loading enquanto decide o redirecionamento
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF7A00" />
    </View>
  );
}
