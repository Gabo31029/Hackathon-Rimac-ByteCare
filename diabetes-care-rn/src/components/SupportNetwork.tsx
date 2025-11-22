import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';
import { Card, CardContent } from './ui/Card';

interface SupportNetworkProps {
  onBack: () => void;
  onEarnCoins: (bone: number, rimac: number) => void;
}

export function SupportNetwork({ onBack, onEarnCoins }: SupportNetworkProps) {
  const [selectedTab, setSelectedTab] = useState<'family' | 'professional' | 'alerts'>('family');

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-rimac p-4 pb-6 pt-12">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Red de Apoyo</Text>
          <TouchableOpacity>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row gap-2 bg-white/10 backdrop-blur rounded-xl p-1">
          {(['family', 'professional', 'alerts'] as const).map((tab) => (
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
                {tab === 'family' ? 'Familia' : tab === 'professional' ? 'Profesionales' : 'Alertas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {selectedTab === 'family' && (
          <>
            {/* Mensaje principal */}
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-4">
              <View className="flex-row items-start gap-3 mb-3">
                <View className="w-12 h-12 bg-rose-100 rounded-full items-center justify-center">
                  <Ionicons name="heart" size={24} color="#E11D48" />
                </View>
                <View className="flex-1">
                  <Text className="text-rose-900 mb-1 font-semibold text-lg">No estás solo</Text>
                  <Text className="text-sm text-rose-800">
                    Tu familia puede acompañarte en tu cuidado de forma respetuosa y sin invadir tu privacidad.
                  </Text>
                </View>
              </View>
            </View>

            {/* Familiares conectados */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Familiares conectados</Text>
            <View className="gap-3 mb-4">
              <Card>
                <CardContent>
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                      <Text className="text-xl">👨</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold">Carlos (Esposo)</Text>
                      <Text className="text-sm text-gray-600">Conectado ahora</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  </View>
                  <View className="pt-3 border-t border-gray-200">
                    <Text className="text-sm text-gray-600">
                      Puede ver: Resumen de salud, Alertas importantes
                    </Text>
                  </View>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                      <Text className="text-xl">👩</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold">Ana (Hija)</Text>
                      <Text className="text-sm text-gray-600">Última vez: Hace 2 horas</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                  </View>
                  <View className="pt-3 border-t border-gray-200">
                    <Text className="text-sm text-gray-600">
                      Puede ver: Solo alertas de emergencia
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          </>
        )}

        {selectedTab === 'professional' && (
          <View className="gap-3">
            <Card>
              <CardContent>
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                    <Ionicons name="medical" size={24} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold">Dr. García</Text>
                    <Text className="text-sm text-gray-600">Endocrinólogo</Text>
                  </View>
                  <TouchableOpacity className="bg-rimac px-4 py-2 rounded-lg">
                    <Text className="text-white text-sm font-semibold">Contactar</Text>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          </View>
        )}

        {selectedTab === 'alerts' && (
          <View className="gap-3">
            <Card>
              <CardContent>
                <View className="flex-row items-start gap-3">
                  <Ionicons name="alert-circle" size={24} color="#EF4444" />
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold mb-1">Configurar alertas</Text>
                    <Text className="text-sm text-gray-600">
                      Notifica a tu familia cuando tu glucosa esté fuera de rango
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

