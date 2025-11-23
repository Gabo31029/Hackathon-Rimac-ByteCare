import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Progress } from './ui/Progress';

interface HomeScreenProps {
  hasCompletedCheckIn: boolean;
  boneCoins: number;
  rimacCoins: number;
  streak: number;
  onStartCheckIn: () => void;
  onNavigate: (screen: string, healthTab?: 'overview' | 'challenges' | 'medication') => void;
}

export function HomeScreen({
  hasCompletedCheckIn,
  boneCoins,
  rimacCoins,
  streak,
  onStartCheckIn,
  onNavigate,
}: HomeScreenProps) {
  return (
    <ScrollView className="flex-1 pb-24" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Hero section with curved bottom */}
      <View className="bg-rimac pt-4 pb-8 px-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mt-4 mb-1">
          <View className="flex-1">
            <Text className="text-white text-xl font-semibold">
              Hola, María 👋
            </Text>
            <Text className="text-white/90 text-sm">¿Cómo va tu día?</Text>
          </View>
          {/* Racha de check-ins - más pequeña y al costado */}
          <View className="bg-white/10 backdrop-blur rounded-xl px-3 py-2 flex-row items-center gap-2">
            <Ionicons name="flame" size={16} color="#FCD34D" />
            <View className="items-center">
              <Text className="text-white text-lg font-bold">{streak}</Text>
              <Text className="text-white/80 text-xs">días</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-4 mt-6">
        {/* Check-in card */}
        {!hasCompletedCheckIn ? (
          <View className="bg-rimac rounded-2xl p-5 mb-4 shadow-lg">
            <View className="mb-3">
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="flash" size={20} color="white" />
                <Text className="text-sm opacity-90 text-white">Tu check-in diario</Text>
              </View>
              <Text className="mb-1 text-white text-lg font-semibold">
                ¡Es hora de tu check-in!
              </Text>
              <Text className="text-sm text-white/90">
                Solo 15 segundos para cuidarte hoy
              </Text>
            </View>
            <TouchableOpacity
              onPress={onStartCheckIn}
              className="w-full bg-white py-3 rounded-xl flex-row items-center justify-center gap-2 mt-4"
              activeOpacity={0.8}
            >
              <Text className="text-rimac font-semibold">Empezar check-in</Text>
              <Ionicons name="chevron-forward" size={20} color="#EC0000" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-1 mt-3">
              <Ionicons name="flame" size={16} color="#FCD34D" />
              <Text className="opacity-90 text-sm text-white">
                Racha de {streak} días
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
                <Ionicons name="trophy" size={24} color="white" />
              </View>
              <View>
                <Text className="text-green-900 font-semibold">
                  ¡Check-in completado!
                </Text>
                <Text className="text-sm text-green-700">Ganaste 10 monedas 🦴</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="flame" size={16} color="#F97316" />
              <Text className="text-sm text-green-700">
                Racha de {streak} días consecutivos
              </Text>
            </View>
          </View>
        )}

        {/* Tu mascota */}
        <TouchableOpacity 
          onPress={() => onNavigate('pet')}
          className="bg-purple-50 rounded-2xl p-5 mb-4 border border-purple-100"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-sm text-purple-600">Tu compañero de cuidado</Text>
              <Text className="text-purple-900 font-semibold text-lg">Pancho 🐕</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9333EA" />
          </View>
          <View className="flex-row items-center gap-4">
            <View className="w-20 h-20 bg-amber-200 rounded-2xl items-center justify-center">
              <Text className="text-4xl">🐕</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between text-sm text-purple-700 mb-1">
                <Text className="text-sm text-purple-700">Felicidad</Text>
                <Text className="text-sm text-purple-700">85%</Text>
              </View>
              <View className="h-3 bg-purple-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: '85%' }}
                />
              </View>
              <Text className="text-xs text-purple-600 mt-2">
                Pancho está contento con tu cuidado 💜
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Módulos principales */}
        <Text className="mb-3 text-gray-900 font-semibold text-lg">
          Cuidado Diario Inteligente
        </Text>

        <View className="gap-3 mb-6">
          {/* Mini-retos de hoy */}
          <TouchableOpacity
            onPress={() => onNavigate('health', 'challenges')}
            className="bg-white border border-gray-200 rounded-xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="trending-up" size={20} color="#2563EB" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">Mini-retos de hoy</Text>
                  <Text className="text-sm text-gray-600">2 de 4 completados</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            <View className="gap-2">
              {[
                { text: 'Tomar agua cada 2 horas', completed: true },
                { text: 'Medir glucosa en ayunas', completed: true },
                { text: 'Caminar 10 min después de comer', completed: false },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center gap-2">
                  <View
                    className={cn(
                      'w-5 h-5 rounded-full items-center justify-center',
                      item.completed
                        ? 'bg-green-500'
                        : 'border-2 border-gray-300'
                    )}
                  >
                    {item.completed && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                  <Text
                    className={cn(
                      'text-sm',
                      item.completed ? 'text-gray-700' : 'text-gray-500'
                    )}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {/* Adherencia a medicación */}
          <TouchableOpacity
            onPress={() => onNavigate('health', 'medication')}
            className="bg-white border border-gray-200 rounded-xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
                  <Text className="text-xl">💊</Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">Medicación</Text>
                  <Text className="text-sm text-green-600">Todas al día</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-gray-600">Siguiente: 2:00 PM</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Estado de glicemia */}
          <TouchableOpacity
            onPress={() => onNavigate('health')}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center">
                  <Ionicons name="pulse" size={20} color="#059669" />
                </View>
                <View>
                  <Text className="text-gray-900 font-semibold">Glicemia actual</Text>
                  <Text className="text-sm text-emerald-700">En rango objetivo</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-xl text-emerald-900 font-bold">105</Text>
                <Text className="text-xs text-emerald-700">mg/dL</Text>
              </View>
            </View>
            <Text className="text-xs text-emerald-700">
              Última medición: Hace 2 horas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recomendación del día */}
        <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <View className="flex-row items-start gap-3">
            <Text className="text-2xl">💡</Text>
            <View className="flex-1">
              <Text className="text-amber-900 mb-1 font-semibold">
                Recomendación para ti
              </Text>
              <Text className="text-sm text-amber-800">
                Tu glucosa suele subir después del almuerzo. Hoy intenta caminar 10
                minutos después de comer para ayudar a controlarla mejor.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <Text className="mb-3 text-gray-900 font-semibold text-lg">
          Accesos rápidos
        </Text>
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => onNavigate('education')}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mb-2">
              <Text className="text-xl">📚</Text>
            </View>
            <Text className="text-gray-900 mb-1 font-semibold">Aprendo y Mejoro</Text>
            <Text className="text-xs text-gray-600">Educación sobre diabetes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onNavigate('support')}
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 bg-rose-100 rounded-full items-center justify-center mb-2">
              <Text className="text-xl">👨‍👩‍👧</Text>
            </View>
            <Text className="text-gray-900 mb-1 font-semibold">Red de Apoyo</Text>
            <Text className="text-xs text-gray-600">Familia conectada</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

