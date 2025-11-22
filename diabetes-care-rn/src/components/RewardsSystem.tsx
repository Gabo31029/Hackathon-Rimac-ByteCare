import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';
import { Card, CardContent } from './ui/Card';

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
      {/* Header */}
      <View className="bg-rimac p-4 pb-6 pt-12">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Premios</Text>
          <View className="flex-row items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
            <Ionicons name="star" size={16} color="white" />
            <Text className="text-white font-semibold">{rimacCoins}</Text>
          </View>
        </View>

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          {(['all', 'health', 'wellbeing', 'benefits'] as const).map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full',
                selectedCategory === category ? 'bg-white' : 'bg-white/10'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  selectedCategory === category ? 'text-rimac' : 'text-white'
                )}
              >
                {category === 'all' ? 'Todos' : category === 'health' ? 'Salud' : category === 'wellbeing' ? 'Bienestar' : 'Beneficios'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          {filteredRewards.map((reward) => (
            <Card key={reward.id} className={cn(!reward.available && 'opacity-50')}>
              <CardContent>
                <View className="flex-row items-start gap-3">
                  <Text className="text-4xl">{reward.icon}</Text>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="text-gray-900 font-semibold text-lg flex-1">
                        {reward.title}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text className="text-gray-900 font-semibold">{reward.cost}</Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600 mb-3">{reward.description}</Text>
                    <TouchableOpacity
                      onPress={() => handleRedeem(reward)}
                      disabled={rimacCoins < reward.cost || !reward.available}
                      activeOpacity={0.8}
                      className={cn(
                        'bg-rimac px-4 py-2 rounded-lg items-center',
                        (rimacCoins < reward.cost || !reward.available) && 'opacity-50'
                      )}
                    >
                      <Text className="text-white font-semibold">
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

