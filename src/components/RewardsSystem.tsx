import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Card, CardContent } from './ui/Card';
import { Coin } from './ui/Coin';

interface RewardsSystemProps {
  rimacCoins: number;
  onSpendCoins: (amount: number) => void;
  onBack: () => void;
}

interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  icon: string;
  category: 'health' | 'wellbeing' | 'benefits';
  available: boolean;
}

const rewards: Reward[] = [
  {
    id: 1,
    title: 'Cita con psicólogo',
    description: 'Sesión de 45 minutos con especialista en diabetes',
    cost: 25,
    icon: '🧠',
    category: 'health',
    available: true,
  },
  {
    id: 2,
    title: 'Consulta con nutricionista',
    description: 'Plan nutricional personalizado',
    cost: 20,
    icon: '🥗',
    category: 'health',
    available: true,
  },
  {
    id: 3,
    title: 'Teleconsulta médica',
    description: 'Consulta virtual con tu endocrinólogo',
    cost: 15,
    icon: '👨‍⚕️',
    category: 'health',
    available: true,
  },
  {
    id: 4,
    title: 'Kit de medición premium',
    description: 'Glicómetro digital + 100 tiras reactivas',
    cost: 50,
    icon: '🩸',
    category: 'health',
    available: false,
  },
  {
    id: 5,
    title: 'Clase de yoga adaptada',
    description: 'Sesión grupal virtual especializada',
    cost: 10,
    icon: '🧘',
    category: 'wellbeing',
    available: true,
  },
];

export function RewardsSystem({ rimacCoins, onSpendCoins, onBack }: RewardsSystemProps) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'health' | 'wellbeing' | 'benefits'>('all');

  const filteredRewards = selectedCategory === 'all'
    ? rewards
    : rewards.filter(r => r.category === selectedCategory);

  const handleRedeem = (reward: Reward) => {
    if (rimacCoins >= reward.cost && reward.available) {
      onSpendCoins(reward.cost);
      // Aquí podrías mostrar un modal de confirmación o alerta
      alert(`¡Premio canjeado! Has canjeado: ${reward.title}`);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="light" backgroundColor="#EC0000" />
      {/* Header */}
      <View className="bg-rimac p-4 pb-6" style={{ paddingTop: Math.max(insets.top - 10, 8) }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Premios</Text>
          <View className="flex-row items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
            <Coin type="rimac" size={18} />
            <Text className="text-white font-semibold">{rimacCoins}</Text>
          </View>
        </View>

        {/* Category tabs - Scroll horizontal más grande */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {(['all', 'health', 'wellbeing', 'benefits'] as const).map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={cn(
                'px-5 py-3 rounded-xl',
                selectedCategory === category ? 'bg-white' : 'bg-white/10'
              )}
              activeOpacity={0.8}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  selectedCategory === category ? 'text-rimac' : 'text-white'
                )}
              >
                {category === 'all' ? 'Todos' : category === 'health' ? 'Salud' : category === 'wellbeing' ? 'Bienestar' : 'Beneficios'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="p-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="gap-4">
          {filteredRewards.map((reward) => (
            <Card key={reward.id} className={cn(!reward.available && 'opacity-50', 'border border-gray-100')}>
              <CardContent>
                <View className="flex-row items-start gap-4">
                  <View className="w-16 h-16 bg-gray-50 rounded-xl items-center justify-center">
                    <Text className="text-4xl">{reward.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-gray-900 font-bold text-lg flex-1 pr-2">
                        {reward.title}
                      </Text>
                      <View className="flex-row items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-full">
                        <Coin type="rimac" size={18} />
                        <Text className="text-gray-900 font-bold">{reward.cost}</Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600 mb-4 leading-5">{reward.description}</Text>
                    <TouchableOpacity
                      onPress={() => handleRedeem(reward)}
                      disabled={rimacCoins < reward.cost || !reward.available}
                      activeOpacity={0.8}
                      className={cn(
                        'bg-rimac px-5 py-3 rounded-xl items-center',
                        (rimacCoins < reward.cost || !reward.available) && 'opacity-50 bg-gray-300'
                      )}
                    >
                      <Text className="text-white font-bold text-base">
                        {!reward.available
                          ? 'No disponible'
                          : rimacCoins < reward.cost
                          ? 'Monedas insuficientes'
                          : 'Canjear'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

