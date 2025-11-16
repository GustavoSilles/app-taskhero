// Serviço de WebSocket para receber atualizações em tempo real
// Atualiza coins, XP, nível e notificações de conquistas

type WebSocketMessage = {
  // Tipo da mensagem
  type?: 'EMBLEMA_DESBLOQUEADO' | 'USER_UPDATE' | 'AVATAR_UNLOCKED' | 'STATS_UPDATE' | 'META_EXPIRADA';
  
  // Dados do usuário atualizados
  id?: string;
  nome?: string;
  email?: string;
  level?: number;
  xp_points?: number;
  task_coins?: number;
  
  // Notificação genérica
  message?: string;
  titulo?: string;
  
  // ID da meta (usado em META_EXPIRADA)
  meta_id?: number;
  
  // Dados específicos (emblema, avatar, etc)
  data?: {
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    unlockedAt?: Date;
    [key: string]: any;
  };
};

type WebSocketCallback = (data: WebSocketMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private userId: string | null = null;
  private isReconnecting = false;
  private hasConnectedBefore = false;

  connect(userId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.userId = userId;
    const wsUrl = `wss://api-taskhero.onrender.com?userId=${userId}`

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket conectado com sucesso');
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this.hasConnectedBefore = true;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyCallbacks(data);
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error);
        }
      };

      this.ws.onerror = () => {
        // Silencia erros de conexão - são tratados no onclose
        // Apenas loga se for a primeira tentativa
        if (!this.hasConnectedBefore && this.reconnectAttempts === 0) {
          console.warn('⚠️ WebSocket indisponível - continuando sem atualizações em tempo real');
        }
      };

      this.ws.onclose = (event) => {
        this.ws = null;
        
        // Apenas tenta reconectar se já teve conexão bem-sucedida antes
        if (this.hasConnectedBefore) {
          this.attemptReconnect();
        } else if (this.reconnectAttempts < 2) {
          // Para primeira conexão, tenta apenas 2 vezes
          this.attemptReconnect();
        }
      };
    } catch (error) {
      // Silencia erro de criação
      this.ws = null;
      
      if (!this.isReconnecting && this.reconnectAttempts < 2) {
        this.attemptReconnect();
      }
    }
  }

  private attemptReconnect() {
    // Se nunca conectou antes, limita a 2 tentativas
    const maxAttempts = this.hasConnectedBefore ? this.maxReconnectAttempts : 2;
    
    if (this.reconnectAttempts >= maxAttempts || !this.userId) {
      if (this.reconnectAttempts >= maxAttempts && !this.hasConnectedBefore) {
        console.log('ℹ️ WebSocket não disponível - app funcionará normalmente sem atualizações em tempo real');
      }
      return;
    }

    this.reconnectAttempts++;
    this.isReconnecting = true;

    // Delay progressivo: 1s, 2s, 4s, 8s, 16s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 16000);

    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.userId = null;
    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    this.hasConnectedBefore = false;
  }

  subscribe(callback: WebSocketCallback) {
    this.callbacks.push(callback);
    
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifyCallbacks(data: WebSocketMessage) {
    this.callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Erro ao executar callback:', error);
      }
    });
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
export type { WebSocketMessage };
