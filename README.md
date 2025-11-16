# TaskHero 🎯

Um aplicativo móvel completo de gerenciamento de metas e tarefas com sistema avançado de gamificação, desenvolvido para aumentar a produtividade e motivação dos usuários através de recompensas digitais.

## 📱 Sobre o Projeto

TaskHero é uma solução completa que combina produtividade com elementos de gamificação para tornar o gerenciamento de metas mais envolvente e motivador.

### Funcionalidades Principais

- 🔐 **Autenticação Completa**: Sistema seguro de cadastro e login com JWT
- 🎯 **Gerenciamento de Metas**: Crie, edite e acompanhe suas metas com prazos definidos
- ✅ **Sistema de Tarefas**: Subdivida metas em tarefas menores com níveis de prioridade
- 📊 **Acompanhamento em Tempo Real**: Visualize seu progresso com estatísticas detalhadas
- 🎮 **Sistema de Gamificação**: Ganhe XP, suba de nível e desbloqueie emblemas
- 🪙 **TaskCoins**: Sistema de moeda in-app para comprar avatares personalizados
- � **Emblemas e Conquistas**: 8 emblemas únicos para desbloquear
- 👤 **Avatares Colecionáveis**: 10 avatares temáticos de super-heróis
- 🔄 **Sincronização em Tempo Real**: WebSocket para atualizações instantâneas
- 🎨 **Temas Personalizáveis**: Modo claro e escuro com transições suaves

## 🏗️ Arquitetura do Sistema

O projeto é dividido em duas partes principais:

### Frontend - App Mobile (`app-taskhero/`)
- **Framework**: React Native com Expo (~54.0.12)
- **Linguagem**: TypeScript
- **Navegação**: Expo Router v6
- **Gerenciamento de Estado**: Context API
- **Armazenamento Local**: AsyncStorage
- **UI/UX**: Bottom Sheets, Gestures, Animações
- **Comunicação Real-Time**: WebSocket nativo

### Backend - API REST (`api-taskhero/`)
- **Framework**: Express.js v5
- **Banco de Dados**: PostgreSQL com Sequelize ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Segurança**: Bcrypt para hash de senhas
- **WebSocket**: ws v8 para comunicação em tempo real
- **Migrations**: Sistema de seeds para dados iniciais

## 🎮 Sistema de Gamificação

### Níveis e Experiência (XP)
- **Nível inicial**: 1
- **Sistema de progressão**: 100 XP base × nível atual
  - Nível 1→2: 100 XP
  - Nível 2→3: 200 XP  
  - Nível 3→4: 300 XP
  - E assim por diante...
- **Ganho de XP**:
  - ✅ Tarefa concluída: **+10 XP**
  - 🎯 Meta concluída no prazo: **+100 XP**
  - ⏰ Meta concluída com atraso: **0 XP**

### TaskCoins (Moeda do App)
- **Ganho de Coins**:
  - ✅ Tarefa concluída: **+10 coins**
  - 🎯 Meta concluída no prazo: **+100 coins**
  - ⏰ Meta concluída com atraso: **+50 coins**
- **Uso**: Comprar avatares exclusivos na loja

### Emblemas Disponíveis
1. **Primeira Meta** - Crie sua primeira meta
2. **Mestre das Metas** - Complete uma meta inteira
3. **Guerreiro de Tarefas** - Complete 10 tarefas
4. **Campeão das Tarefas** - Complete 50 tarefas
5. **Ascendente** - Alcance o nível 5
6. **Lendário** - Alcance o nível 10
7. **Madrugador** - Complete uma tarefa antes das 8h
8. **Coruja Noturna** - Complete uma tarefa após as 22h

### Avatares Colecionáveis
1. **Arqueiro Verde** - 100 coins
2. **Deadpool** - 200 coins
3. **Invencível** - 200 coins
4. **Flash** - 350 coins
5. **Aranha Venom** - 350 coins
6. **Homem-Aranha** - 400 coins
7. **Miles Morales** - 400 coins
8. **Kratos** - 500 coins
9. **Demolidor** - 1000 coins
10. **Batman** - 1000 coins

## 🎨 Design e Interface

### Paleta de Cores
- 🔶 **Laranja Principal (#FF7A00)**: Energia, ação e motivação
- 💜 **Roxo Secundário (#7B2CBF)**: Criatividade e conquistas
- ✅ **Verde Sucesso (#4CAF50)**: Conclusões e confirmações
- ⚠️ **Amarelo Alerta (#FFA000)**: Avisos e prazos próximos
- ❌ **Vermelho Erro (#FF4444)**: Erros e exclusões

### Temas
- **Modo Claro**: Interface limpa e energizante
- **Modo Escuro**: Experiência confortável para uso noturno
- **Transições Suaves**: Animações entre estados e navegações

## 📂 Estrutura Detalhada do Projeto

```
A3/
├── app-taskhero/                    # 📱 Aplicativo Mobile
│   ├── app/                         # Telas e navegação
│   │   ├── (auth)/                  # Autenticação
│   │   │   ├── login.tsx           # Tela de login
│   │   │   └── signup.tsx          # Tela de cadastro
│   │   ├── (tabs)/                  # Navegação principal
│   │   │   ├── index.tsx           # Home - Metas
│   │   │   ├── explore.tsx         # Recompensas e loja
│   │   │   ├── profile.tsx         # Perfil do usuário
│   │   │   └── about.tsx           # Sobre o app
│   │   ├── goal/                    # Detalhes de meta
│   │   │   └── [id].tsx            # Tela dinâmica de meta
│   │   ├── index.tsx               # Redirecionamento inicial
│   │   └── _layout.tsx             # Layout raiz
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── goal-card.tsx           # Card de meta
│   │   ├── task-item.tsx           # Item de tarefa
│   │   ├── reward-badge.tsx        # Emblema
│   │   ├── level-progress.tsx      # Barra de nível
│   │   ├── user-profile-header.tsx # Cabeçalho do perfil
│   │   ├── filter-bar.tsx          # Filtros de metas
│   │   ├── empty-state.tsx         # Estado vazio
│   │   ├── confirmation-modal.tsx  # Modal de confirmação
│   │   ├── buy-avatar-modal.tsx    # Modal de compra
│   │   ├── theme-selector.tsx      # Seletor de tema
│   │   ├── bottom-sheets/          # Bottom sheets
│   │   │   ├── create-goal-bottom-sheet.tsx
│   │   │   ├── edit-goal-bottom-sheet.tsx
│   │   │   ├── create-task-bottom-sheet.tsx
│   │   │   └── edit-profile-bottom-sheet.tsx
│   │   └── ui/                     # Componentes base
│   ├── contexts/                    # Context API
│   │   ├── auth-context.tsx        # Autenticação e usuário
│   │   ├── goals-context.tsx       # Gerenciamento de metas
│   │   ├── tasks-context.tsx       # Gerenciamento de tarefas
│   │   ├── theme-context.tsx       # Tema claro/escuro
│   │   └── toast-context.tsx       # Notificações toast
│   ├── services/                    # Serviços
│   │   ├── api.ts                  # Cliente da API REST
│   │   └── websocket.ts            # Cliente WebSocket
│   ├── constants/                   # Constantes
│   │   ├── theme.ts                # Cores e estilos
│   │   ├── gamification.ts         # Sistema de gamificação
│   │   └── avatars.ts              # Lista de avatares
│   ├── utils/                       # Utilitários
│   │   ├── goal-status.ts          # Lógica de status de metas
│   │   └── level-calculation.ts    # Cálculo de níveis
│   └── hooks/                       # Hooks customizados
│       ├── use-gamification.ts     # Dados de gamificação
│       └── use-theme-color.ts      # Cores do tema
│
└── api-taskhero/                    # 🔧 Backend API
    ├── src/
    │   ├── controller/              # Controladores REST
    │   │   ├── AuthController.js   # Autenticação
    │   │   ├── MetaController.js   # Metas
    │   │   ├── TarefaController.js # Tarefas
    │   │   └── RecompensaController.js # Recompensas
    │   ├── services/                # Lógica de negócio
    │   │   ├── UsuarioService.js   # Usuários e auth
    │   │   ├── MetaService.js      # Metas
    │   │   ├── TarefaService.js    # Tarefas
    │   │   └── RecompensaService.js # Recompensas e emblemas
    │   ├── models/                  # Modelos Sequelize
    │   │   ├── Usuario.js          # Usuário
    │   │   ├── Meta.js             # Meta
    │   │   ├── Tarefa.js           # Tarefa
    │   │   └── Recompensa.js       # Recompensa
    │   ├── repository/              # Camada de dados
    │   │   ├── UsuarioRepository.js
    │   │   ├── MetaRepository.js
    │   │   └── TarefaRepository.js
    │   ├── routers/                 # Rotas da API
    │   │   ├── AuthRouter.js       # /auth/*
    │   │   ├── MetaRouter.js       # /meta/*
    │   │   ├── TarefaRouter.js     # /tarefa/*
    │   │   └── RecompensaRouter.js # /recompensa/*
    │   ├── middlewares/             # Middlewares
    │   │   └── Auth.js             # Verificação JWT
    │   ├── enums/                   # Enumerações
    │   │   ├── StatusEnum.js       # Status de metas
    │   │   ├── PrioridadeEnum.js   # Prioridades
    │   │   └── TipoRecompensaEnum.js # Tipos de recompensa
    │   ├── websocket/               # WebSocket
    │   │   └── websocket.js        # Servidor WS
    │   ├── utils/                   # Utilitários
    │   │   └── ObjectUtils.js      # Transformações
    │   ├── db.js                    # Configuração do BD
    │   └── index.js                 # Entrada da aplicação
    └── migrations/                  # Seeds do banco
        ├── seed-avatares.js        # Avatares iniciais
        └── seed-emblemas.js        # Emblemas iniciais
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 14+
- Expo CLI
- Expo Go (para teste em dispositivo móvel)

### 1. Configurar o Backend

```bash
# Navegar para a pasta da API
cd api-taskhero

# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env)
JWT_SECRET=sua_chave_secreta_aqui
SALT_ROUNDS=10
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskhero
DB_USER=seu_usuario
DB_PASS=sua_senha

# Iniciar o servidor (com nodemon)
npm run dev
```

O servidor estará rodando em `http://localhost:8080`

### 2. Configurar o Frontend

```bash
# Navegar para a pasta do app
cd app-taskhero

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env na raiz
EXPO_PUBLIC_API_URL=http://SEU_IP:8080

# Iniciar o Expo
npx expo start
```

### 3. Executar no Dispositivo

- **Android**: Pressione `a` ou escaneie o QR code com Expo Go
- **iOS**: Pressione `i` ou escaneie o QR code com Expo Go (requer Mac)
- **Web**: Pressione `w` para abrir no navegador

## 📡 Endpoints da API

### Autenticação (`/auth`)
- `POST /auth/register` - Cadastrar novo usuário
- `POST /auth/login` - Fazer login
- `PUT /auth/profile` - Atualizar perfil (protegido)
- `GET /auth/stats` - Obter estatísticas do usuário (protegido)
- `PUT /auth/avatar/select` - Selecionar avatar (protegido)

### Metas (`/meta`)
- `GET /meta/list` - Listar metas (paginado, com filtros)
- `GET /meta/:id` - Obter meta por ID
- `POST /meta/create` - Criar nova meta
- `PUT /meta/update/:id` - Atualizar meta
- `PUT /meta/update/:id/conclude` - Concluir meta
- `DELETE /meta/delete/:id` - Excluir meta

### Tarefas (`/tarefa`)
- `GET /tarefa/:metaId/list` - Listar tarefas de uma meta
- `POST /tarefa/:metaId/create` - Criar tarefa
- `PUT /tarefa/:metaId/update/:id` - Atualizar tarefa
- `PUT /tarefa/:metaId/update/:id/conclude` - Concluir tarefa
- `DELETE /tarefa/:metaId/delete/:id` - Excluir tarefa

### Recompensas (`/recompensa`)
- `GET /recompensa/list` - Listar recompensas do usuário
- `PUT /recompensa/buy/:avatarId` - Comprar avatar
- `GET /recompensa/emblemas/all` - Listar todos emblemas
- `GET /recompensa/emblemas/unlocked` - Listar emblemas desbloqueados

### WebSocket
- Conexão: `ws://localhost:8080?userId={userId}`
- Eventos:
  - `USER_UPDATE` - Atualização de XP, nível ou coins
  - `EMBLEMA_DESBLOQUEADO` - Novo emblema desbloqueado
  - `AVATAR_UNLOCKED` - Novo avatar comprado

## 💡 Funcionalidades Detalhadas

### Gerenciamento de Metas
- **Criação**: Título, descrição, data início e fim
- **Status automático**: Pendente → Em Andamento → Concluída/Expirada
- **Edição**: Modificar informações (exceto metas concluídas)
- **Exclusão**: Apenas metas não concluídas
- **Filtros**: Por status (todas, em andamento, concluídas, etc.)
- **Ordenação**: Por data criação, data fim, progresso ou status
- **Paginação**: 10 metas por página

### Sistema de Tarefas
- **Prioridades**: Baixa (verde), Média (amarela), Alta (vermelha)
- **Conclusão**: Marca/desmarca com feedback instantâneo
- **Progresso da Meta**: Atualização automática ao completar tarefas
- **Validações**: Não é possível concluir meta sem completar todas as tarefas

### Perfil do Usuário
- **Informações**: Nome, email, nível, XP, coins
- **Estatísticas**: Total de metas, concluídas, expiradas, em andamento
- **Emblemas**: Visualização de conquistas desbloqueadas
- **Edição**: Alterar nome, email e senha
- **Avatar**: Seleção e compra de avatares personalizados

### Loja de Recompensas
- **Avatares**: 10 opções de super-heróis com preços variados
- **Visualização**: Preview do avatar antes da compra
- **Sistema de compra**: Confirmação com saldo de TaskCoins
- **Desbloqueio**: Avatar fica disponível permanentemente
- **Seleção**: Troca de avatar ativo a qualquer momento

## 🔒 Segurança

- **Senhas**: Hash com Bcrypt (10 rounds)
- **Autenticação**: JWT com expiração de 4 horas
- **Autorização**: Middleware verifica token em rotas protegidas
- **Validações**: Verificação de dados no backend
- **CORS**: Configurado para aceitar requisições do frontend

## 🎯 Status do Projeto

### ✅ Implementado
- [x] Sistema completo de autenticação
- [x] Gerenciamento completo de metas
- [x] Sistema de tarefas com prioridades
- [x] Gamificação (XP, níveis, coins)
- [x] Sistema de emblemas automático
- [x] Loja de avatares funcional
- [x] WebSocket para atualizações em tempo real
- [x] Filtros e ordenação de metas
- [x] Temas claro e escuro
- [x] Persistência de dados (backend e local)
- [x] Estatísticas detalhadas do usuário
- [x] Bottom sheets para formulários
- [x] Modais de confirmação
- [x] Sistema de toasts

### 🚧 Melhorias Futuras
- [ ] Sistema de notificações push
- [ ] Lembretes por email
- [ ] Gráficos de progresso
- [ ] Backup em nuvem
- [ ] Compartilhamento de metas
- [ ] Sistema de amigos/comunidade
- [ ] Desafios diários
- [ ] Mais avatares e emblemas
- [ ] Sistema de conquistas semanais/mensais
- [ ] Exportação de dados

## 🧪 Testando o Sistema

### Fluxo Completo de Teste

1. **Cadastro**
   - Abra o app e clique em "Cadastre-se"
   - Preencha: Nome, Email, Senha
   - Após cadastro automático, você terá 0 XP, 0 coins, Nível 1

2. **Criar Primeira Meta**
   - Na Home, clique no botão "+" flutuante
   - Preencha título, descrição e datas
   - **Emblema**: Você ganhará "Primeira Meta"!

3. **Adicionar Tarefas**
   - Entre na meta criada
   - Clique em "+ Adicionar Tarefa"
   - Adicione pelo menos 3 tarefas com diferentes prioridades

4. **Completar Tarefas**
   - Marque as tarefas como concluídas
   - A cada tarefa: **+10 XP e +10 coins**
   - Progresso da meta atualiza automaticamente
   - Após 10 tarefas: **Emblema "Guerreiro de Tarefas"**!

5. **Concluir Meta**
   - Complete todas as tarefas
   - Clique em "Marcar como Concluída"
   - Ganhe: **+100 XP e +100 coins**
   - **Emblema**: "Mestre das Metas"!

6. **Comprar Avatar**
   - Vá para a aba "Recompensas"
   - Escolha um avatar (ex: Arqueiro Verde - 100 coins)
   - Confirme a compra
   - Avatar fica disponível no seu perfil

7. **Verificar Progresso**
   - Aba "Perfil" mostra seu nível, XP e estatísticas
   - Veja seus emblemas desbloqueados
   - Troque de avatar quando quiser

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido como parte do trabalho acadêmico A3 - 2025.

### Tecnologias e Conceitos Aplicados
- Desenvolvimento Mobile (React Native)
- API RESTful (Node.js + Express)
- Banco de Dados Relacional (PostgreSQL)
- Autenticação e Autorização (JWT)
- WebSocket para tempo real
- Gamificação e UX
- Clean Architecture
- TypeScript/JavaScript

## 📄 Licença

Este projeto é um trabalho acadêmico desenvolvido para fins educacionais.

---

**TaskHero** - Transforme suas metas em conquistas! 🎯✨