import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Logo } from '@/components/logo';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

export default function AboutScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const features = [
    {
      icon: 'target',
      title: 'Organização de Metas',
      description: 'Crie e gerencie suas metas dividindo-as em tarefas menores',
    },
    {
      icon: 'chart.line.uptrend.xyaxis',
      title: 'Acompanhamento de Progresso',
      description: 'Visualize seu progresso em tempo real com estatísticas detalhadas',
    },
    {
      icon: 'star.fill',
      title: 'Sistema de Gamificação',
      description: 'Ganhe pontos, suba de nível e conquiste emblemas',
    },
    {
      icon: 'bell.fill',
      title: 'Lembretes Inteligentes',
      description: 'Receba notificações sobre prazos e metas próximas',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo e Nome */}
      <View style={styles.header}>
        <Logo variant="full" size="large" />
        <ThemedText style={styles.version}>Versão 1.0.0</ThemedText>
        <ThemedText style={styles.tagline}>
          Transforme suas metas em conquistas!
        </ThemedText>
      </View>

      {/* Sobre o App */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Sobre o Aplicativo
        </ThemedText>
        <ThemedText style={styles.description}>
          O TaskHero é um aplicativo de produtividade pessoal que ajuda você a organizar suas metas
          e objetivos através de um sistema gamificado de tarefas e recompensas.
        </ThemedText>
        <ThemedText style={styles.description}>
          Desenvolvido pensando em promover o aprendizado contínuo e hábitos saudáveis de estudo e
          trabalho, alinhado ao ODS 4 - Educação de Qualidade.
        </ThemedText>
      </View>

      {/* Funcionalidades */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Funcionalidades
        </ThemedText>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
              <IconSymbol name={feature.icon as any} size={24} color="#fff" />
            </View>
            <View style={styles.featureContent}>
              <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                {feature.title}
              </ThemedText>
              <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Como Usar */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Como Usar
        </ThemedText>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.stepNumberText}>1</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>Crie suas metas com prazo definido</ThemedText>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.stepNumberText}>2</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>Divida cada meta em tarefas menores</ThemedText>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.stepNumberText}>3</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>Complete tarefas e ganhe pontos</ThemedText>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.stepNumberText}>4</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>
            Conclua metas no prazo para subir de nível
          </ThemedText>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.stepNumberText}>5</ThemedText>
          </View>
          <ThemedText style={styles.stepText}>Use pontos para desbloquear recompensas</ThemedText>
        </View>
      </View>

      {/* Sistema de Pontuação */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Sistema de Pontuação
        </ThemedText>
        <View style={styles.pointItem}>
          <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
          <ThemedText style={styles.pointText}>Tarefa concluída: +10 pontos</ThemedText>
        </View>
        <View style={styles.pointItem}>
          <IconSymbol name="flag.checkered" size={20} color={colors.success} />
          <ThemedText style={styles.pointText}>Meta concluída no prazo: +100 pontos</ThemedText>
        </View>
        <View style={styles.pointItem}>
          <IconSymbol name="clock.badge.checkmark" size={20} color={colors.warning} />
          <ThemedText style={styles.pointText}>Meta concluída com atraso: +50 pontos</ThemedText>
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => console.log('Política de Privacidade')}>
          <IconSymbol name="lock.shield" size={20} color={colors.icon} />
          <ThemedText style={styles.linkText}>Política de Privacidade</ThemedText>
          <IconSymbol name="chevron.right" size={16} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => console.log('Termos de Uso')}>
          <IconSymbol name="doc.text" size={20} color={colors.icon} />
          <ThemedText style={styles.linkText}>Termos de Uso</ThemedText>
          <IconSymbol name="chevron.right" size={16} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => console.log('Contato')}>
          <IconSymbol name="envelope" size={20} color={colors.icon} />
          <ThemedText style={styles.linkText}>Entrar em Contato</ThemedText>
          <IconSymbol name="chevron.right" size={16} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Créditos */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Desenvolvido com ❤️ para promover produtividade e educação de qualidade
        </ThemedText>
        <ThemedText style={styles.footerText}>© 2025 TaskHero - Todos os direitos reservados</ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  version: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  pointText: {
    fontSize: 15,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
});
