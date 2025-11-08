import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { GoalStatus } from '@/types';

interface FilterBarProps {
  currentFilter: GoalStatus | 'all';
  currentSort: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status';
  onFilterChange: (filter: GoalStatus | 'all') => void;
  onSortChange: (sort: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status') => void;
}

export function FilterBar({
  currentFilter,
  currentSort,
  onFilterChange,
  onSortChange,
}: FilterBarProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const filters: { label: string; value: GoalStatus | 'all' }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Em Andamento', value: 'in_progress' },
    { label: 'Concluídas', value: 'completed' },
    { label: 'Expiradas', value: 'expired' },
  ];

  const sorts: { label: string; value: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status'; icon: string }[] = [
    { label: 'Criação', value: 'createdAt', icon: 'clock' },
    { label: 'Prazo', value: 'data_fim', icon: 'calendar' },
    { label: 'Progresso', value: 'progress_calculated', icon: 'chart.bar' },
    { label: 'Status', value: 'status', icon: 'tag' },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Filtros */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Filtrar por:</ThemedText>
        <View style={styles.filtersRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => onFilterChange(filter.value)}
              style={[
                styles.filterChip,
                currentFilter === filter.value && {
                  backgroundColor: colors.primary,
                },
                currentFilter !== filter.value && {
                  backgroundColor: colors.disabled,
                },
              ]}>
              <ThemedText
                style={[
                  styles.filterText,
                  currentFilter === filter.value && styles.filterTextActive,
                ]}>
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ordenação */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Ordenar por:</ThemedText>
        <View style={styles.sortsRow}>
          {sorts.map((sort) => (
            <TouchableOpacity
              key={sort.value}
              onPress={() => onSortChange(sort.value)}
              style={[
                styles.sortButton,
                currentSort === sort.value && {
                  backgroundColor: colors.secondary,
                },
                currentSort !== sort.value && {
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}>
              <IconSymbol
                name={sort.icon as any}
                size={16}
                color={currentSort === sort.value ? '#fff' : colors.icon}
              />
              <ThemedText
                style={[
                  styles.sortText,
                  currentSort === sort.value && styles.sortTextActive,
                ]}>
                {sort.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortTextActive: {
    color: '#fff',
  },
});
