# TaskHero 🎯

Um aplicativo móvel de gerenciamento de metas e tarefas com sistema de gamificação para aumentar a produtividade e motivação dos usuários.

## 📱 Sobre o Projeto

TaskHero permite aos usuários:
- 🔐 Criar conta e fazer login com segurança
- ✅ Criar e gerenciar metas pessoais
- 📝 Subdividir metas em tarefas menores
- 📊 Acompanhar progresso em tempo real
- 🏆 Ganhar recompensas digitais (XP, níveis, emblemas)
- ⏰ Receber lembretes sobre prazos
- 🎨 Desbloquear conteúdos com pontos ganhos

## 🔐 Autenticação

O app agora possui um sistema completo de autenticação:
- **Login**: Acesse sua conta existente
- **Cadastro**: Crie uma nova conta em segundos
- **Logout**: Saia com segurança quando quiser
- **Proteção de Rotas**: Somente usuários autenticados acessam o conteúdo

Para mais detalhes, veja:
- [AUTH_GUIDE.md](./AUTH_GUIDE.md) - Guia completo de autenticação
- [FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md) - Fluxo visual do aplicativo

## 🚀 Tecnologias

- **React Native** com Expo
- **TypeScript** para tipagem
- **Expo Router** para navegação
- **Tema Laranja & Roxo** com modo claro/escuro
- Armazenamento persistente (a implementar)

## 🎨 Design

O TaskHero utiliza uma paleta de cores cuidadosamente escolhida:
- 🔶 **Laranja (#FF7A00)**: Energia, ação e motivação
- 💜 **Roxo (#7B2CBF)**: Criatividade, conquistas e identidade
- Suporte completo a **modo claro e escuro**
- Design acessível seguindo diretrizes WCAG

Para mais detalhes, veja [COLOR_PALETTE.md](./COLOR_PALETTE.md)

## 📂 Estrutura do Projeto

```
app-taskhero/
├── app/                    # Telas da aplicação
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.tsx      # Tela de Metas
│   │   └── explore.tsx    # Tela de Recompensas
│   └── _layout.tsx        # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── goal-card.tsx     # Card de meta
│   ├── task-item.tsx     # Item de tarefa
│   ├── reward-badge.tsx  # Emblema de recompensa
│   ├── level-progress.tsx # Barra de progresso de nível
│   ├── stats-card.tsx    # Card de estatísticas
│   ├── themed-text.tsx   # Texto com tema
│   ├── themed-view.tsx   # View com tema
│   └── ui/               # Componentes de UI
├── constants/            # Constantes e temas
└── hooks/                # Hooks customizados
```

## 🎮 Funcionalidades Principais

### Sistema de Metas
- Criação de metas com título, descrição e prazo
- Progresso visual com barra de progresso
- Indicador de dias restantes
- Alertas para metas próximas do vencimento

### Sistema de Tarefas
- Subdivisão de metas em tarefas
- Marcação de conclusão
- Níveis de prioridade (baixa, média, alta)
- Contagem de tarefas completadas

### Sistema de Gamificação
- **XP e Níveis**: Ganhe experiência e suba de nível
- **Emblemas**: Conquiste emblemas por desafios
- **Pontos**: Acumule pontos para desbloquear conteúdos
- **Mensagens Motivacionais**: Incentivos baseados no progresso

## 🏁 Como Começar

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Iniciar o aplicativo**
   ```bash
   npx expo start
   ```

3. **Executar no dispositivo**
   - Pressione `a` para Android
   - Pressione `i` para iOS
   - Pressione `w` para Web
   - Escaneie o QR code com Expo Go

4. **Primeiro acesso**
   - Ao abrir o app, você verá a **tela de Login**
   - Clique em **"Cadastre-se"** para criar uma conta
   - Preencha: Nome, Email, Senha e Confirmar Senha
   - Após cadastro, você será direcionado para a **Home (Metas)**
   - Explore as 4 tabs: Metas, Recompensas, Perfil e Sobre

5. **Testar o sistema**
   - Por enquanto, qualquer email/senha é aceito (mock)
   - Para sair, vá em **Perfil > Sair da Conta**

## 📋 Próximos Passos

- [ ] Implementar armazenamento persistente (AsyncStorage/SQLite)
- [ ] Adicionar sistema de notificações
- [ ] Criar telas de criação/edição de metas
- [ ] Implementar loja de recompensas
- [ ] Adicionar gráficos de progresso
- [ ] Sistema de conquistas diárias
- [ ] Compartilhamento de metas
- [ ] Backup em nuvem

## 👥 Equipe

Projeto desenvolvido como parte do trabalho acadêmico A3.

## 📄 Licença

Este projeto é um trabalho acadêmico.