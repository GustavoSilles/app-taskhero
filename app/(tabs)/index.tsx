import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { GoalCard } from '@/components/goal-card';
import { FilterBar } from '@/components/filter-bar';
import { EmptyState } from '@/components/empty-state';
import { CreateGoalBottomSheet } from '@/components/bottom-sheets/create-goal-bottom-sheet';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import { useGoals } from '@/contexts/goals-context';
import { useState, useRef, useCallback, useEffect } from 'react';
import { GoalStatus } from '@/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '@/contexts/toast-context';

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const toast = useToast();
  const { user } = useAuth();
  const {
    goals,
    isLoading,
    fetchGoals,
    createGoal: createGoalAPI,
    currentPage,
    totalPages,
    totalItems,
    selectedFilter,
    selectedSort,
    setSelectedFilter,
    setSelectedSort,
    hasInitialized,
  } = useGoals();

  const [showFilters, setShowFilters] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // Ref para o Bottom Sheet
  const goalBottomSheetRef = useRef<BottomSheet>(null);

  // Carrega metas ao montar o componente e quando filtro/ordenação mudam
  useEffect(() => {
    if (!user || hasInitialized) {
      return;
    }

    const status = selectedFilter === 'all' ? null : selectedFilter;
    fetchGoals(1, status, selectedSort, 'DESC', false);
  }, [user, hasInitialized, selectedFilter, selectedSort, fetchGoals]);

  const hasMoreGoals = currentPage < totalPages;

  // Resetar página quando mudar filtro ou ordenação
  const handleFilterChange = useCallback((filter: GoalStatus | 'all') => {
    setSelectedFilter(filter);
  }, [setSelectedFilter]);

  const handleSortChange = useCallback((sort: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status') => {
    setSelectedSort(sort);
  }, [setSelectedSort]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMoreGoals) {
      const status = selectedFilter === 'all' ? null : selectedFilter;
      fetchGoals(currentPage + 1, status, selectedSort, 'DESC', true);
    }
  }, [currentPage, hasMoreGoals, isLoading, selectedFilter, selectedSort, fetchGoals]);

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

  const handleCreateGoal = useCallback(async (data: any) => {
    try {
      // Formata as datas para ISO 8601
      const goalData = {
        titulo: data.title,
        descricao: data.description,
        data_inicio: data.startDate.toISOString(),
        data_fim: data.endDate.toISOString(),
      };

      await createGoalAPI(goalData);
      
      handleCloseGoalBottomSheet();
      
      setTimeout(() => {
        toast.success('Sucesso!', 'Meta criada com sucesso! Agora adicione tarefas para começar.');
      }, 300);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast.error('Erro', 'Não foi possível criar a meta. Tente novamente.');
    }
  }, [createGoalAPI, handleCloseGoalBottomSheet, toast]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
        <View>
          <ThemedText style={styles.welcomeText}>
            Olá, {user?.name.split(' ')[0] || 'Usuário'}!
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
            currentFilter={selectedFilter}
            currentSort={selectedSort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        )}

        {goals.length === 0 ? (
          <EmptyState
            icon={selectedFilter !== 'all' ? "magnifyingglass" : "flag"}
            title={
              isLoading 
                ? "Carregando..." 
                : selectedFilter !== 'all' 
                  ? "Nenhuma meta com este filtro" 
                  : "Pronto para começar sua jornada?"
            }
            description={
              isLoading 
                ? "Buscando suas metas..." 
                : selectedFilter !== 'all'
                  ? "Tente ajustar os filtros ou crie uma nova meta para começar."
                  : "Defina sua primeira meta e transforme seus sonhos em conquistas! Cada grande jornada começa com um simples passo."
            }
            actionLabel={selectedFilter !== 'all' ? "Limpar Filtros" : "Criar Minha Primeira Meta"}
            onActionPress={selectedFilter !== 'all' ? () => setSelectedFilter('all') : handleOpenGoalBottomSheet}
          />
        ) : (
          <>
            {goals.map((goal: any) => (
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
                  Mostrando {goals.length} de {totalItems} metas
                </ThemedText>
                <TouchableOpacity
                  onPress={handleLoadMore}
                  style={[styles.loadMoreButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <ThemedText style={styles.loadMoreButtonText}>
                    {isLoading ? 'Carregando...' : 'Carregar mais'}
                  </ThemedText>
                  {!isLoading && <Ionicons name="chevron-down" size={18} color="#fff" />}
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

