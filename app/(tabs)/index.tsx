import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { GoalCard } from '@/components/goal-card';
import { FilterBar } from '@/components/filter-bar';
import { EmptyState } from '@/components/empty-state';
import { CreateGoalBottomSheet } from '@/components/bottom-sheets/create-goal-bottom-sheet';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useState, useMemo, useRef, useCallback } from 'react';
import { mockGoals, filterGoalsByStatus, sortGoals } from '@/mocks/goals';
import { mockUser } from '@/mocks/user';
import { GoalStatus } from '@/types';
import { calculateGoalStatus } from '@/utils/goal-status';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '@/contexts/toast-context';

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const toast = useToast();

  const [currentFilter, setCurrentFilter] = useState<GoalStatus | 'all'>('all');
  const [currentSort, setCurrentSort] = useState<'deadline' | 'created' | 'progress' | 'status'>('deadline');
  const [showFilters, setShowFilters] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Ref para o Bottom Sheet
  const goalBottomSheetRef = useRef<BottomSheet>(null);

  // Filtrar e ordenar metas
  const filteredAndSortedGoals = useMemo(() => {
    const filtered = filterGoalsByStatus(mockGoals, currentFilter);
    return sortGoals(filtered, currentSort);
  }, [currentFilter, currentSort]);

  // Paginação de metas
  const paginatedGoals = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredAndSortedGoals.slice(0, endIndex);
  }, [filteredAndSortedGoals, currentPage]);

  const hasMoreGoals = filteredAndSortedGoals.length > paginatedGoals.length;
  const totalGoals = filteredAndSortedGoals.length;

  // Resetar página quando mudar filtro ou ordenação
  const handleFilterChange = useCallback((filter: GoalStatus | 'all') => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: 'deadline' | 'created' | 'progress' | 'status') => {
    setCurrentSort(sort);
    setCurrentPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  // Funções para abrir/fechar Bottom Sheet
  const handleOpenGoalBottomSheet = useCallback(() => {
    goalBottomSheetRef.current?.snapToIndex(1);
    setIsBottomSheetOpen(true);
  }, []);

  const handleCloseGoalBottomSheet = useCallback(() => {
    goalBottomSheetRef.current?.close();
    setIsBottomSheetOpen(false);
  }, []);

  // Callback para detectar mudanças no Bottom Sheet
  const handleBottomSheetChange = useCallback((index: number) => {
    setIsBottomSheetOpen(index !== -1);
  }, []);

  const handleCreateGoal = useCallback((data: any) => {
    console.log('Nova meta:', data);
    
    const status = calculateGoalStatus(
      data.endDate,
      undefined,
      0,
      0
    );

    const newGoal = {
      id: Date.now().toString(),
      userId: '1',
      ...data,
      status,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
    };

    console.log('Meta criada:', newGoal);
    handleCloseGoalBottomSheet();
    
    setTimeout(() => {
      toast.success('Sucesso!', 'Meta criada com sucesso! Agora adicione tarefas para começar.');
    }, 300);
  }, [handleCloseGoalBottomSheet, toast]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>
            Olá, {mockUser.name.split(' ')[0]}!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Continue progredindo nas suas metas
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Minhas Metas</ThemedText>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}>
            <Ionicons 
              name={showFilters ? "close" : "funnel"} 
              size={18} 
              color={colors.primary} 
              style={{ marginRight: 6 }}
            />
            <ThemedText style={[styles.filterButtonText, { color: colors.primary }]}>
              {showFilters ? 'Fechar' : 'Filtros'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {showFilters && (
          <FilterBar
            currentFilter={currentFilter}
            currentSort={currentSort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        )}

        {filteredAndSortedGoals.length === 0 ? (
          <EmptyState
            icon="flag"
            title="Nenhuma meta encontrada"
            description="Crie sua primeira meta e comece sua jornada!"
            actionLabel="Criar Meta"
            onActionPress={handleOpenGoalBottomSheet}
          />
        ) : (
          <>
            {paginatedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                {...goal}
                onPress={() => {
                  router.push(`/goal/${goal.id}` as any);
                }}
              />
            ))}
            
            {hasMoreGoals && (
              <View style={styles.paginationContainer}>
                <ThemedText style={styles.paginationInfo}>
                  Mostrando {paginatedGoals.length} de {totalGoals} metas
                </ThemedText>
                <TouchableOpacity
                  onPress={handleLoadMore}
                  style={[styles.loadMoreButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.8}
                >
                  <ThemedText style={styles.loadMoreButtonText}>
                    Carregar mais
                  </ThemedText>
                  <Ionicons name="chevron-down" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        </View>
      </ScrollView>

      {/* Bottom Sheet para criar meta */}
      <CreateGoalBottomSheet
        ref={goalBottomSheetRef}
        onSubmit={handleCreateGoal}
        onClose={handleCloseGoalBottomSheet}
        onChange={handleBottomSheetChange}
      />

      {/* Botão flutuante para criar meta */}
      {!isBottomSheetOpen && (
        <TouchableOpacity 
          onPress={handleOpenGoalBottomSheet} 
          style={[styles.floatingButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 14,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  paginationContainer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
  },
  paginationInfo: {
    fontSize: 14,
    opacity: 0.7,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

