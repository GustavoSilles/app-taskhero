// Serviço de WebSocket para receber atualizações em tempo real
// Atualiza coins, XP, nível e notificações de conquistas

type WebSocketMessage = {
  // Dados do usuário atualizados
  id?: string;
  nome?: string;
  email?: string;
  level?: number;
  xp_points?: number;
  task_coins?: number;
  
  // Notificação de conquista
  message?: string;
  titulo?: string;
};

type WebSocketCallback = (data: WebSocketMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.userId = userId;
    const wsUrl = `ws://192.168.1.123:8080?userId=${userId}`

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyCallbacks(data);
        } catch (error) {
          console.error('Erro ao processar mensagem do WebSocket:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
      };

      this.ws.onclose = () => {
        this.ws = null;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Erro ao criar conexão WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.userId) {
      return;
    }

    this.reconnectAttempts++;

    setTimeout(() => {
      this.connect(this.userId!);
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.userId = null;
    this.reconnectAttempts = 0;
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
