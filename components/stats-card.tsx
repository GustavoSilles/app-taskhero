import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export function StatsCard({ icon, label, value, color = '#4caf50' }: StatsCardProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <IconSymbol name={icon as any} size={24} color="#fff" />
      </View>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.value}>
          {value}
        </ThemedText>
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
});
