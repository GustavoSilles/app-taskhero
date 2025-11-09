import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface RewardItemProps {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'theme' | 'avatar' | 'boost' | 'special';
  image?: string;
  isPurchased?: boolean;
  currentPoints: number;
  onPurchase?: (item: { id: string; name: string; description: string; cost: number; category: 'theme' | 'avatar' | 'boost' | 'special'; image?: string; isPurchased?: boolean }) => void;
}

export function RewardItem({
  id,
  name,
  description,
  cost,
  category,
  image,
  isPurchased = false,
  currentPoints,
  onPurchase,
}: RewardItemProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const canAfford = currentPoints >= cost;
  const typeIcons: Record<string, string> = {
    theme: 'paintbrush.fill',
    avatar: 'person.circle.fill',
    boost: 'bolt.fill',
    special: 'star.fill',
  };

  const handlePurchase = () => {
    if (onPurchase && !isPurchased && canAfford) {
      onPurchase({ id, name, description, cost, category, image, isPurchased });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.disabled }]}>
            <IconSymbol name={typeIcons[category] as any} size={48} color={colors.icon} />
          </View>
        )}
        {isPurchased && (
          <View style={[styles.purchasedBadge, { backgroundColor: colors.success }]}>
            <IconSymbol name="checkmark" size={16} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {name}
        </ThemedText>
        <ThemedText style={styles.description} numberOfLines={2}>
          {description}
        </ThemedText>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <IconSymbol name="star.fill" size={16} color={colors.warning} />
            <ThemedText style={styles.price}>{cost} coins</ThemedText>
          </View>

          {isPurchased ? (
            <View style={[styles.purchasedTag, { backgroundColor: colors.success }]}>
              <ThemedText style={styles.purchasedText}>Comprado</ThemedText>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.buyButton,
                canAfford
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.disabled },
              ]}
              onPress={handlePurchase}
              disabled={!canAfford}>
              <ThemedText style={styles.buyButtonText}>
                {canAfford ? 'Comprar' : 'Sem coins'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchasedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  purchasedTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  purchasedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
