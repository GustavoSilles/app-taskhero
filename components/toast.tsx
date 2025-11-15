import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import type { SFSymbols6_0 } from 'sf-symbols-typescript';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps extends ToastData {
  onHide: () => void;
}

export function Toast({ type, title, message, duration = 3000, onHide }: ToastProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const pan = React.useRef(new Animated.ValueXY()).current;

  const hideToast = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      onHide();
    });
  }, [translateY, opacity, onHide]);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Só ativa se arrastar verticalmente mais de 5 pixels
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Só permite arrastar para cima (dy negativo)
        if (gestureState.dy < 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Se arrastou mais de 50 pixels para cima, fecha o toast
        if (gestureState.dy < -50) {
          Animated.parallel([
            Animated.timing(pan, {
              toValue: { x: 0, y: -150 },
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onHide();
          });
        } else {
          // Volta para a posição original
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();


    // Auto hide
    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [translateY, opacity, duration, hideToast]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.success,
          icon: 'checkmark.circle.fill' as SFSymbols6_0,
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          icon: 'xmark.circle.fill' as SFSymbols6_0,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          icon: 'exclamationmark.triangle.fill' as SFSymbols6_0,
        };
      case 'info':
        return {
          backgroundColor: colors.secondary,
          icon: 'info.circle.fill' as SFSymbols6_0,
        };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          opacity,
          transform: [
            { translateY },
            { translateY: pan.y }
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={hideToast}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <IconSymbol name={config.icon} size={24} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {message && (
            <ThemedText style={styles.message}>{message}</ThemedText>
          )}
        </View>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <IconSymbol name="xmark" size={18} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    maxWidth: width - 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
