import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';
import { Progress } from './ui/Progress';
import { Card, CardContent } from './ui/Card';

interface DigitalPetProps {
  boneCoins: number;
  onSpendCoins: (amount: number) => void;
  onBack: () => void;
}

export function DigitalPet({ boneCoins, onSpendCoins, onBack }: DigitalPetProps) {
  const [happiness, setHappiness] = useState(85);
  const [hunger, setHunger] = useState(60);
  const [showFeedAnimation, setShowFeedAnimation] = useState(false);

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

  const getHappinessEmoji = () => {
    if (happiness >= 80) return '😊';
    if (happiness >= 60) return '🙂';
    if (happiness >= 40) return '😐';
    return '😢';
  };

  const getHappinessMessage = () => {
    if (happiness >= 80) return 'Pancho está muy feliz con tu cuidado';
    if (happiness >= 60) return 'Pancho está contento contigo';
    if (happiness >= 40) return 'Pancho necesita más atención';
    return 'Pancho está triste, dale cariño';
  };

  return (
    <View className="flex-1 bg-purple-50">
      {/* Header */}
      <View className="bg-purple-600 p-4 pt-12">
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
        {/* Pet card */}
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
              <Text className="text-sm text-purple-600">Tu compañero de cuidado</Text>
            </View>

            {/* Pet display */}
            <View className="items-center mb-4">
              <View className="w-48 h-48 bg-amber-200 rounded-3xl items-center justify-center mb-4 relative">
                {showFeedAnimation && (
                  <View className="absolute inset-0 items-center justify-center">
                    <Ionicons name="sparkles" size={48} color="#FCD34D" />
                  </View>
                )}
                <Text className="text-8xl">🐕</Text>
              </View>
              <Text className="text-4xl mb-2">{getHappinessEmoji()}</Text>
            </View>

            {/* Status bars */}
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
              <Text className="text-sm text-purple-700 text-center">
                {getHappinessMessage()}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Actions */}
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
      </ScrollView>
    </View>
  );
}

