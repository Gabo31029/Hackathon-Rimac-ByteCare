import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Progress } from './ui/Progress';
import { Card, CardContent } from './ui/Card';

interface DigitalPetProps {
  boneCoins: number;
  onSpendCoins: (amount: number) => void;
  onBack: () => void;
}

interface Accessory {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
}

const ACCESSORIES: Accessory[] = [
  {
    id: 'bandana',
    name: 'Bandana Rimac',
    emoji: '🧣',
    price: 8,
    description: 'Bandana roja oficial para resaltar su estilo.',
  },
  {
    id: 'glasses',
    name: 'Gafas cool',
    emoji: '🕶️',
    price: 6,
    description: 'Gafas oscuras para una vibra relajada.',
  },
  {
    id: 'hat',
    name: 'Gorro aventurero',
    emoji: '🎩',
    price: 10,
    description: 'Perfecto para paseos y retos diarios.',
  },
];

export function DigitalPet({ boneCoins, onSpendCoins, onBack }: DigitalPetProps) {
  const insets = useSafeAreaInsets();
  const [happiness, setHappiness] = useState(85);
  const [hunger, setHunger] = useState(60);
  const [showFeedAnimation, setShowFeedAnimation] = useState(false);
  const [purchasedAccessories, setPurchasedAccessories] = useState<string[]>([]);
  const [equippedAccessory, setEquippedAccessory] = useState<string | null>(null);

  const handleFeed = () => {
    if (boneCoins >= 5 && hunger < 100) {
      onSpendCoins(5);
      setHunger(Math.min(100, hunger + 20));
      setHappiness(Math.min(100, happiness + 5));
      setShowFeedAnimation(true);
      setTimeout(() => setShowFeedAnimation(false), 2000);
    }
  };

  const handlePlay = () => {
    if (boneCoins >= 3) {
      onSpendCoins(3);
      setHappiness(Math.min(100, happiness + 10));
      setShowFeedAnimation(true);
      setTimeout(() => setShowFeedAnimation(false), 2000);
    }
  };

  const handleSelectAccessory = (accessory: Accessory) => {
    const alreadyOwns = purchasedAccessories.includes(accessory.id);

    if (alreadyOwns) {
      setEquippedAccessory(accessory.id);
      return;
    }

    if (boneCoins < accessory.price) {
      Alert.alert('Monedas insuficientes', `Necesitas ${accessory.price} 🦴 para comprar ${accessory.name}.`);
      return;
    }

    onSpendCoins(accessory.price);
    setPurchasedAccessories((prev) => [...prev, accessory.id]);
    setEquippedAccessory(accessory.id);
  };

  const getHappinessEmoji = () => {
    if (happiness >= 80) return '😄';
    if (happiness >= 60) return '🙂';
    if (happiness >= 40) return '😕';
    return '😢';
  };

  const getHappinessMessage = () => {
    if (happiness >= 80) return 'Pancho esta muy feliz con tu cuidado';
    if (happiness >= 60) return 'Pancho esta contento contigo';
    if (happiness >= 40) return 'Pancho necesita un poco mas de atencion';
    return 'Pancho esta triste, dale carino';
  };

  const equippedAccessoryData = ACCESSORIES.find((acc) => acc.id === equippedAccessory);

  return (
    <View className="flex-1 bg-purple-50">
      <View className="bg-purple-600 p-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Tu Mascota</Text>
          <View className="flex-row items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
            <Text className="text-lg">🦴</Text>
            <Text className="text-white font-semibold">{boneCoins}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <Card className="mb-4 relative overflow-hidden">
          <View className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16" />
          <View className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full -ml-12 -mb-12" />

          <CardContent className="relative z-10">
            <View className="items-center mb-4">
              <View className="flex-row items-center gap-2 bg-purple-100 px-4 py-1.5 rounded-full mb-4">
                <Ionicons name="star" size={16} color="#9333EA" />
                <Text className="text-purple-700 text-sm font-semibold">Nivel 5</Text>
              </View>
              <Text className="text-purple-900 mb-1 text-xl font-bold">Pancho</Text>
              <Text className="text-sm text-purple-600">Tu companero de cuidado</Text>
            </View>

            <View className="items-center mb-4">
              <View className="w-48 h-48 bg-amber-200 rounded-3xl items-center justify-center mb-4 relative">
                {equippedAccessoryData && (
                  <View className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 flex-row items-center gap-1">
                    <Text className="text-lg">{equippedAccessoryData.emoji}</Text>
                    <Text className="text-xs text-purple-700 font-semibold">{equippedAccessoryData.name}</Text>
                  </View>
                )}
                {showFeedAnimation && (
                  <View className="absolute inset-0 items-center justify-center">
                    <Ionicons name="sparkles" size={48} color="#FCD34D" />
                  </View>
                )}
                <Text className="text-8xl">🐾</Text>
              </View>
              <Text className="text-4xl mb-2">{getHappinessEmoji()}</Text>
            </View>

            <View className="gap-4 mt-6">
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="heart" size={16} color="#EC4899" />
                    <Text className="text-sm text-gray-700">Felicidad</Text>
                  </View>
                  <Text className="text-sm text-gray-700">{happiness}%</Text>
                </View>
                <Progress value={happiness} barClassName="bg-purple-500" />
              </View>

              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base">🍖</Text>
                    <Text className="text-sm text-gray-700">Hambre</Text>
                  </View>
                  <Text className="text-sm text-gray-700">{hunger}%</Text>
                </View>
                <Progress value={hunger} barClassName="bg-amber-500" />
              </View>
            </View>

            <View className="mt-4 p-3 bg-purple-50 rounded-xl">
              <Text className="text-sm text-purple-700 text-center">{getHappinessMessage()}</Text>
            </View>
          </CardContent>
        </Card>

        <Text className="mb-3 text-gray-900 font-semibold text-lg">Acciones</Text>
        <View className="gap-3">
          <TouchableOpacity
            onPress={handleFeed}
            disabled={boneCoins < 5 || hunger >= 100}
            activeOpacity={0.7}
            className={cn(
              'bg-white rounded-xl p-4 flex-row items-center justify-between',
              (boneCoins < 5 || hunger >= 100) && 'opacity-50'
            )}
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🍖</Text>
              <View>
                <Text className="text-gray-900 font-semibold">Alimentar</Text>
                <Text className="text-sm text-gray-600">Cuesta 5 🦴</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlay}
            disabled={boneCoins < 3}
            activeOpacity={0.7}
            className={cn(
              'bg-white rounded-xl p-4 flex-row items-center justify-between',
              boneCoins < 3 && 'opacity-50'
            )}
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🎾</Text>
              <View>
                <Text className="text-gray-900 font-semibold">Jugar</Text>
                <Text className="text-sm text-gray-600">Cuesta 3 🦴</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-gray-900 font-semibold text-lg mb-1">Accesorios y estilo</Text>
          <Text className="text-sm text-gray-600 mb-3">
            Personaliza a Pancho comprando accesorios con tus Bone Coins.
          </Text>

          <View className="gap-3">
            {ACCESSORIES.map((item) => {
              const alreadyOwns = purchasedAccessories.includes(item.id);
              const isEquipped = equippedAccessory === item.id;
              const canAfford = boneCoins >= item.price;

              return (
                <View
                  key={item.id}
                  className="bg-white rounded-xl border border-purple-100 p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">{item.emoji}</Text>
                    <View>
                      <Text className="text-gray-900 font-semibold">{item.name}</Text>
                      <Text className="text-xs text-gray-500">{item.description}</Text>
                      {!alreadyOwns && (
                        <Text className="text-xs text-purple-600 mt-1">Precio: {item.price} 🦴</Text>
                      )}
                      {alreadyOwns && (
                        <Text className="text-xs text-emerald-600 mt-1">
                          {isEquipped ? 'Equipado' : 'Comprado'}
                        </Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleSelectAccessory(item)}
                    disabled={!alreadyOwns && !canAfford}
                    className={cn(
                      'px-4 py-2 rounded-full',
                      isEquipped
                        ? 'bg-emerald-100'
                        : alreadyOwns
                        ? 'bg-purple-100'
                        : 'bg-purple-600',
                      (!alreadyOwns && !canAfford) && 'opacity-50'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-sm font-semibold',
                        isEquipped
                          ? 'text-emerald-700'
                          : alreadyOwns
                          ? 'text-purple-700'
                          : 'text-white'
                      )}
                    >
                      {isEquipped ? 'Activo' : alreadyOwns ? 'Usar' : 'Comprar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
