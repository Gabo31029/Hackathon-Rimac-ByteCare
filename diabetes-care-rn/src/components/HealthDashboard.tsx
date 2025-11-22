import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';
import { Progress } from './ui/Progress';
import { Card, CardContent } from './ui/Card';

interface HealthDashboardProps {
  onBack: () => void;
  onEarnCoins: (bone: number, rimac: number) => void;
}

export function HealthDashboard({ onBack, onEarnCoins }: HealthDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'challenges' | 'medication'>('overview');
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Tomar agua cada 2 horas', completed: true, icon: '💧' },
    { id: 2, title: 'Medir glucosa en ayunas', completed: true, icon: '🩸' },
    { id: 3, title: 'Caminar 10 min después de comer', completed: false, icon: '🚶' },
    { id: 4, title: '1 porción extra de verduras', completed: false, icon: '🥗' },
  ]);

  const handleCompleteChallenge = (id: number) => {
    setChallenges(prev =>
      prev.map(c => c.id === id ? { ...c, completed: true } : c)
    );
    onEarnCoins(5, 0);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-rimac p-4 pb-6 pt-12">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Mi Salud</Text>
          <TouchableOpacity>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 bg-white/10 backdrop-blur rounded-xl p-1">
          {(['overview', 'challenges', 'medication'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={cn(
                'flex-1 py-2 rounded-lg items-center',
                selectedTab === tab ? 'bg-white' : ''
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  selectedTab === tab ? 'text-rimac' : 'text-white'
                )}
              >
                {tab === 'overview' ? 'Resumen' : tab === 'challenges' ? 'Retos' : 'Medicación'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
            {/* Glucosa card destacada */}
            <View className="bg-emerald-500 rounded-2xl p-6 mb-4 shadow-lg">
              <View className="flex-row items-start justify-between mb-4">
                <View>
                  <Text className="text-sm opacity-90 mb-1 text-white">Glicemia actual</Text>
                  <Text className="text-4xl mb-1 text-white font-bold">105</Text>
                  <Text className="text-sm opacity-90 text-white">mg/dL</Text>
                </View>
                <View className="bg-white/20 backdrop-blur rounded-full p-3">
                  <Ionicons name="water" size={24} color="white" />
                </View>
              </View>
              <View className="mb-3">
                <View className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <View className="h-full bg-white rounded-full" style={{ width: '65%', marginLeft: '15%' }} />
                </View>
              </View>
              <View className="flex-row items-center justify-between text-xs opacity-90 mb-4">
                <Text className="text-white">70</Text>
                <View className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  <Text className="text-white text-xs">Rango objetivo: 80-130</Text>
                </View>
                <Text className="text-white">180</Text>
              </View>
              <View className="pt-4 border-t border-white/20 flex-row items-center justify-between">
                <Text className="text-sm text-white">Última medición: Hace 2 horas</Text>
                <Ionicons name="trending-down" size={16} color="white" />
              </View>
            </View>

            {/* Métricas físicas */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Monitoreo físico</Text>
            <View className="flex-row gap-3 mb-4">
              <Card className="flex-1">
                <CardContent>
                  <View className="items-center">
                    <Ionicons name="heart" size={24} color="#EF4444" />
                    <Text className="text-2xl font-bold text-gray-900 mt-2">72</Text>
                    <Text className="text-xs text-gray-600">bpm</Text>
                  </View>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent>
                  <View className="items-center">
                    <Ionicons name="fitness" size={24} color="#3B82F6" />
                    <Text className="text-2xl font-bold text-gray-900 mt-2">8,234</Text>
                    <Text className="text-xs text-gray-600">pasos</Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          </>
        )}

        {selectedTab === 'challenges' && (
          <View className="gap-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className={cn(challenge.completed && 'opacity-60')}>
                <CardContent>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-2xl">{challenge.icon}</Text>
                      <Text
                        className={cn(
                          'flex-1',
                          challenge.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        )}
                      >
                        {challenge.title}
                      </Text>
                    </View>
                    {!challenge.completed && (
                      <TouchableOpacity
                        onPress={() => handleCompleteChallenge(challenge.id)}
                        activeOpacity={0.8}
                        className="bg-rimac px-4 py-2 rounded-lg"
                      >
                        <Text className="text-white text-sm font-semibold">Completar</Text>
                      </TouchableOpacity>
                    )}
                    {challenge.completed && (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    )}
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {selectedTab === 'medication' && (
          <View className="gap-3">
            <Card>
              <CardContent>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">💊</Text>
                    <View>
                      <Text className="text-gray-900 font-semibold">Metformina</Text>
                      <Text className="text-sm text-gray-600">500mg - 2 veces al día</Text>
                    </View>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-xs font-semibold">Al día</Text>
                  </View>
                </View>
                <View className="mt-4 pt-4 border-t border-gray-200">
                  <Text className="text-sm text-gray-600">Siguiente dosis: 2:00 PM</Text>
                </View>
              </CardContent>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

