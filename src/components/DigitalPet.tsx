import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Progress } from './ui/Progress';
import { Card, CardContent } from './ui/Card';
import { Coin } from './ui/Coin';
import { PetImage } from './PetImage';

interface DigitalPetProps {
  boneCoins: number;
  onSpendCoins: (amount: number) => void;
  onBack: () => void;
  onEarnRimacCoins?: (amount: number) => void;
  completedLessons?: number; // Número de lecciones completadas
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

interface RankingUser {
  id: string;
  name: string;
  petName: string;
  growth: number; // 0-100
  wisdom: number; // 0-100
  accessories: number; // 0-100
  average: number;
  isCurrentUser?: boolean;
}

export function DigitalPet({ boneCoins, onSpendCoins, onBack, onEarnRimacCoins, completedLessons = 0 }: DigitalPetProps) {
  const insets = useSafeAreaInsets();
  const [happiness, setHappiness] = useState(85);
  const [hunger, setHunger] = useState(60);
  const [showFeedAnimation, setShowFeedAnimation] = useState(false);
  const [purchasedAccessories, setPurchasedAccessories] = useState<string[]>([]);
  const [equippedAccessory, setEquippedAccessory] = useState<string | null>(null);
  
  // Tracking para ranking
  const [growth, setGrowth] = useState(45); // Crecimiento inicial
  const [wisdom, setWisdom] = useState(Math.min(100, completedLessons * 10)); // Basado en lecciones completadas
  const [lastMonthChecked, setLastMonthChecked] = useState<string>('');
  const [hasReceivedMonthlyReward, setHasReceivedMonthlyReward] = useState(false);

  // Efecto para actualizar sabiduría cuando cambian las lecciones completadas
  useEffect(() => {
    setWisdom(Math.min(100, completedLessons * 10));
  }, [completedLessons]);

  // Verificar si es un nuevo mes y resetear recompensa mensual
  useEffect(() => {
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    if (lastMonthChecked !== currentMonth) {
      setLastMonthChecked(currentMonth);
      setHasReceivedMonthlyReward(false);
    }
  }, [lastMonthChecked]);

  // Calcular promedio para ranking
  const calculateAverage = (growth: number, wisdom: number, accessories: number) => {
    return Math.round((growth + wisdom + accessories) / 3);
  };

  // Calcular métricas del usuario actual
  const currentUserAccessories = useMemo(() => Math.min(100, purchasedAccessories.length * 25), [purchasedAccessories.length]);
  const currentUserAverage = useMemo(() => calculateAverage(growth, wisdom, currentUserAccessories), [growth, wisdom, currentUserAccessories]);

  // Generar ranking simulado con useMemo
  const ranking = useMemo((): RankingUser[] => {
    const otherUsers: RankingUser[] = [
      { id: '2', name: 'María', petName: 'Luna', growth: 78, wisdom: 85, accessories: 75, average: 79 },
      { id: '3', name: 'Carlos', petName: 'Max', growth: 65, wisdom: 70, accessories: 60, average: 65 },
      { id: '4', name: 'Ana', petName: 'Bella', growth: 90, wisdom: 88, accessories: 85, average: 88 },
      { id: '5', name: 'Luis', petName: 'Rocky', growth: 55, wisdom: 60, accessories: 50, average: 55 },
      { id: '6', name: 'Sofía', petName: 'Coco', growth: 72, wisdom: 75, accessories: 70, average: 72 },
    ];

    const currentUser: RankingUser = {
      id: '1',
      name: 'Tú',
      petName: 'Pancho',
      growth,
      wisdom,
      accessories: currentUserAccessories,
      average: currentUserAverage,
      isCurrentUser: true,
    };

    const allUsers = [...otherUsers, currentUser];
    return allUsers.sort((a, b) => b.average - a.average);
  }, [growth, wisdom, currentUserAccessories, currentUserAverage]);

  const currentUserRank = useMemo(() => ranking.findIndex(u => u.isCurrentUser) + 1, [ranking]);

  // Verificar si el usuario ganó el ranking mensual y otorgar recompensa
  useEffect(() => {
    if (ranking.length > 0 && ranking[0].isCurrentUser && !hasReceivedMonthlyReward && onEarnRimacCoins) {
      // Pequeño delay para evitar múltiples ejecuciones
      const timer = setTimeout(() => {
        onEarnRimacCoins(10);
        setHasReceivedMonthlyReward(true);
        Alert.alert(
          '🎉 ¡Felicidades!',
          'Has ganado el ranking mensual. Has recibido 10 monedas Rimac como recompensa.',
          [{ text: '¡Genial!' }]
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [ranking, hasReceivedMonthlyReward, onEarnRimacCoins]);

  const handleFeed = () => {
    if (boneCoins >= 5 && hunger < 100) {
      onSpendCoins(5);
      setHunger(Math.min(100, hunger + 20));
      setHappiness(Math.min(100, happiness + 5));
      // Incrementar crecimiento cuando alimentas
      setGrowth(prev => Math.min(100, prev + 2));
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
    // Los accesorios ya se cuentan en el cálculo del ranking
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
      <StatusBar style="light" backgroundColor="#9333EA" />
      <View className="bg-purple-600 p-4" style={{ paddingTop: Math.max(insets.top - 10, 8) }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Tu Mascota</Text>
          <View className="flex-row items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
            <Coin type="bone" size={18} />
            <Text className="text-white font-semibold">{boneCoins}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="p-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
              <View className="w-64 h-64 bg-amber-200 rounded-3xl items-center justify-center mb-4 relative overflow-hidden">
                {equippedAccessoryData && (
                  <View className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 flex-row items-center gap-1 z-20">
                    <Text className="text-lg">{equippedAccessoryData.emoji}</Text>
                    <Text className="text-xs text-purple-700 font-semibold">{equippedAccessoryData.name}</Text>
                  </View>
                )}
                {showFeedAnimation && (
                  <View className="absolute inset-0 items-center justify-center z-10">
                    <Ionicons name="sparkles" size={48} color="#FCD34D" />
                  </View>
                )}
                <PetImage size={200} />
              </View>
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

        {/* Logros de Pancho */}
        <View className="mt-6">
          <Text className="text-gray-900 font-semibold text-lg mb-3">Logros de Pancho</Text>
          <Card className="mb-4">
            <CardContent className="p-4">
              <View className="gap-4">
                <View>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl">🌱</Text>
                      <Text className="text-sm text-gray-700 font-semibold">Crecimiento</Text>
                    </View>
                    <Text className="text-sm text-gray-700 font-semibold">{growth}%</Text>
                  </View>
                  <Progress value={growth} barClassName="bg-green-500" />
                  <Text className="text-xs text-gray-500 mt-1">
                    Alimenta a Pancho para que crezca más fuerte
                  </Text>
                </View>

                <View>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl">📚</Text>
                      <Text className="text-sm text-gray-700 font-semibold">Sabiduría</Text>
                    </View>
                    <Text className="text-sm text-gray-700 font-semibold">{wisdom}%</Text>
                  </View>
                  <Progress value={wisdom} barClassName="bg-blue-500" />
                  <Text className="text-xs text-gray-500 mt-1">
                    Completa lecciones educativas para aumentar la sabiduría
                  </Text>
                </View>

                <View>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl">✨</Text>
                      <Text className="text-sm text-gray-700 font-semibold">Accesorios</Text>
                    </View>
                    <Text className="text-sm text-gray-700 font-semibold">
                      {Math.min(100, purchasedAccessories.length * 25)}%
                    </Text>
                  </View>
                  <Progress value={Math.min(100, purchasedAccessories.length * 25)} barClassName="bg-purple-500" />
                  <Text className="text-xs text-gray-500 mt-1">
                    Compra accesorios con tus Bone Coins para personalizar a Pancho
                  </Text>
                </View>

                <View className="mt-2 p-3 bg-purple-50 rounded-xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-purple-700 font-semibold">Promedio Total</Text>
                    <Text className="text-lg text-purple-900 font-bold">
                      {currentUserAverage}%
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Ranking Mensual */}
        <View className="mt-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 font-semibold text-lg">Ranking Mensual</Text>
            <View className="flex-row items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <Text className="text-xs text-amber-700 font-semibold">
                {new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-600 mb-3">
            Compite con otros usuarios. El ganador mensual recibe 10 monedas Rimac 🏆
          </Text>
          
          <Card>
            <CardContent className="p-4">
              <View className="gap-2">
                {ranking.slice(0, 5).map((user, index) => {
                  const isTopThree = index < 3;
                  const medalEmojis = ['🥇', '🥈', '🥉'];
                  
                  return (
                    <View
                      key={user.id}
                      className={cn(
                        'flex-row items-center justify-between p-3 rounded-xl',
                        user.isCurrentUser
                          ? 'bg-purple-100 border-2 border-purple-400'
                          : 'bg-white border border-gray-200'
                      )}
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-10 items-center justify-center">
                          {isTopThree ? (
                            <Text className="text-2xl">{medalEmojis[index]}</Text>
                          ) : (
                            <Text className="text-gray-600 font-bold text-sm">#{index + 1}</Text>
                          )}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2">
                            <Text className="text-gray-900 font-semibold">
                              {user.name}
                            </Text>
                            {user.isCurrentUser && (
                              <View className="bg-purple-600 px-2 py-0.5 rounded-full">
                                <Text className="text-white text-xs font-semibold">TÚ</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-xs text-gray-500">{user.petName}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-gray-900 font-bold text-base">{user.average}%</Text>
                        <Text className="text-xs text-gray-500">Promedio</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {currentUserRank > 5 && (
                <View className="mt-2 pt-2 border-t border-gray-200">
                  <View className="flex-row items-center justify-between p-3 rounded-xl bg-purple-100 border-2 border-purple-400">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 items-center justify-center">
                        <Text className="text-gray-600 font-bold text-sm">#{currentUserRank}</Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-gray-900 font-semibold">Tú</Text>
                          <View className="bg-purple-600 px-2 py-0.5 rounded-full">
                            <Text className="text-white text-xs font-semibold">TÚ</Text>
                          </View>
                        </View>
                        <Text className="text-xs text-gray-500">Pancho</Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-900 font-bold text-base">
                        {currentUserAverage}%
                      </Text>
                      <Text className="text-xs text-gray-500">Promedio</Text>
                    </View>
                  </View>
                </View>
              )}

              {ranking[0].isCurrentUser && hasReceivedMonthlyReward && (
                <View className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="trophy" size={20} color="#F59E0B" />
                    <Text className="text-sm text-amber-800 font-semibold">
                      ¡Eres el ganador del mes! Has recibido 10 monedas Rimac 🎉
                    </Text>
                  </View>
                </View>
              )}
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
