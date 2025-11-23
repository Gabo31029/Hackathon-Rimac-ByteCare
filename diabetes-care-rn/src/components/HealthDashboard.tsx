import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Progress } from './ui/Progress';
import { Card, CardContent } from './ui/Card';

interface HealthDashboardProps {
  onBack: () => void;
  onEarnCoins: (bone: number, rimac: number) => void;
  initialTab?: 'overview' | 'challenges' | 'medication';
}

interface GlucoseData {
  day: string;
  value: number;
  inRange: boolean;
}

interface PhysicalMetric {
  name: string;
  current: number;
  unit: string;
  icon: string;
  change: number;
  changeType: 'up' | 'down' | 'neutral';
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
  meal: string;
  taken: boolean;
  takenAt?: string;
  isLate?: boolean;
}

export function HealthDashboard({ onBack, onEarnCoins, initialTab }: HealthDashboardProps) {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'challenges' | 'medication'>(initialTab || 'overview');
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Tomar agua cada 2 horas', completed: true, icon: '💧', coins: 5 },
    { id: 2, title: 'Medir glucosa en ayunas', completed: true, icon: '🩸', coins: 5 },
    { id: 3, title: 'Caminar 10 min después de comer', completed: false, icon: '🚶', coins: 5 },
    { id: 4, title: '1 porción extra de verduras', completed: false, icon: '🥗', coins: 5 },
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: 'Metformina 850mg',
      dosage: '500mg',
      time: '8:15 AM',
      meal: 'Con el desayuno',
      taken: true,
      takenAt: '8:15 AM',
    },
    {
      id: 2,
      name: 'Metformina 850mg',
      dosage: '500mg',
      time: '2:00 PM',
      meal: 'Con el almuerzo',
      taken: false,
    },
    {
      id: 3,
      name: 'Glibenclamida 5mg',
      dosage: '5mg',
      time: '8:00 PM',
      meal: 'Con la cena',
      taken: false,
    },
  ]);

  // Datos de glucosa semanal
  const glucoseData: GlucoseData[] = [
    { day: 'L', value: 95, inRange: true },
    { day: 'M', value: 145, inRange: false },
    { day: 'M', value: 98, inRange: true },
    { day: 'J', value: 102, inRange: true },
    { day: 'V', value: 88, inRange: true },
    { day: 'S', value: 105, inRange: true },
    { day: 'D', value: 92, inRange: true },
  ];

  // Métricas físicas con comparación semanal
  const physicalMetrics: PhysicalMetric[] = [
    { name: 'Presión arterial', current: 118, unit: '/75', icon: 'heart', change: -2, changeType: 'down' },
    { name: 'Peso (kg)', current: 68.2, unit: 'kg', icon: 'scale', change: -0.5, changeType: 'down' },
    { name: 'Pasos hoy', current: 6847, unit: '', icon: 'fitness', change: 234, changeType: 'up' },
    { name: 'Sueño anoche', current: 7.2, unit: 'h', icon: 'moon', change: 0.3, changeType: 'up' },
  ];

  const adherenceRate = 95;
  const emotionalState = 'Tranquilo';
  const stressLevel = 25; // Bajo
  const emotionalMessage = 'Has reportado sentirte tranquilo en los últimos días. Esto es excelente para tu control de glucosa.';
  
  const [showAddMeasureModal, setShowAddMeasureModal] = useState(false);
  const [newMeasureType, setNewMeasureType] = useState<'glucose' | 'pressure' | 'weight'>('glucose');
  const [newMeasureValue, setNewMeasureValue] = useState('');
  
  const handleAddMeasure = () => {
    setShowAddMeasureModal(true);
  };
  
  const handleSaveMeasure = () => {
    if (!newMeasureValue) {
      Alert.alert('Error', 'Por favor ingresa un valor');
      return;
    }
    
    const value = parseFloat(newMeasureValue);
    if (isNaN(value)) {
      Alert.alert('Error', 'Por favor ingresa un valor numÃ©rico vÃ¡lido');
      return;
    }
    
    const formattedValue =
      newMeasureType === 'glucose'
        ? `${value} mg/dL`
        : newMeasureType === 'pressure'
        ? `${value} mmHg`
        : `${value} kg`;

    Alert.alert('Medida agregada', `Has registrado ${formattedValue}`);
    
    setNewMeasureValue('');
    setShowAddMeasureModal(false);
  };

  const handleCompleteChallenge = (id: number) => {
    const challenge = challenges.find(c => c.id === id);
    if (challenge && !challenge.completed) {
      setChallenges(prev =>
        prev.map(c => c.id === id ? { ...c, completed: true } : c)
      );
      onEarnCoins(challenge.coins, 0);
    }
  };

  const handleMarkMedication = (id: number) => {
    const medication = medications.find(m => m.id === id);
    if (!medication || medication.taken) return;

    const now = new Date();
    const [hours, minutes] = medication.time.split(':');
    const [timeType] = medication.time.split(' ').slice(-1);
    const scheduledTime = new Date();
    
    if (timeType === 'AM') {
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0);
    } else {
      scheduledTime.setHours(parseInt(hours) + 12, parseInt(minutes), 0);
    }

    const diffMinutes = (now.getTime() - scheduledTime.getTime()) / (1000 * 60);
    const isLate = diffMinutes > 15;

    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    setMedications(prev =>
      prev.map(m => m.id === id ? {
        ...m,
        taken: true,
        takenAt: timeStr,
        isLate: isLate && diffMinutes > 15,
      } : m)
    );

    if (isLate) {
      Alert.alert(
        'Medicación tardía',
        'Debes tomar a tiempo tu medicina. Tolerancia de 10 a 15 minutos.'
      );
    }
  };

  const renderLineChart = () => {
    const chartHeight = 190;
    const adaptiveMax = Math.max(180, ...glucoseData.map((item) => item.value));

    return (
      <View className="mb-4">
        <Text className="mb-3 text-gray-900 font-semibold text-lg">Tendencia semanal de glucosa</Text>
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <View
            className="flex-row items-end justify-between px-2 mt-4"
            style={{ height: chartHeight + 16, paddingTop: 8 }}
          >
            {glucoseData.map((data) => {
              const heightPercent = Math.min(100, Math.max(0, (data.value / adaptiveMax) * 100));

              return (
                <View key={`${data.day}-${data.value}`} className="flex-1 items-center">
                  <View
                    className="w-6 bg-gray-100 rounded-2xl justify-end overflow-hidden"
                    style={{ height: chartHeight }}
                  >
                    <View
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: data.inRange ? '#10B981' : '#EF4444',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    />
                  </View>
                  <Text className="text-xs text-gray-600 mt-2">{data.day}</Text>
                  <Text className="text-[11px] text-gray-500">{data.value}</Text>
                </View>
              );
            })}
          </View>
          <View className="flex-row items-center justify-center gap-4 mt-4">
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 bg-green-500 rounded-full" />
              <Text className="text-xs text-gray-600">En rango (80-130)</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 bg-red-500 rounded-full" />
              <Text className="text-xs text-gray-600">Fuera de rango</Text>
            </View>
          </View>
        </View>
      </View>
    );
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
          <Text className="text-white text-lg font-semibold">Mi Salud</Text>
          <TouchableOpacity onPress={handleAddMeasure} activeOpacity={0.7}>
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

      <ScrollView 
        className="p-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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

            {/* Monitoreo físico */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Monitoreo físico</Text>
            <View className="flex-row flex-wrap gap-3 mb-4">
              {physicalMetrics.map((metric, index) => (
                <Card key={index} className="w-[48%]">
                  <CardContent>
                    <View className="items-center">
                      <View className="flex-row items-center gap-2 mb-2">
                        {metric.icon === 'heart' && <Ionicons name="heart" size={20} color="#EF4444" />}
                        {metric.icon === 'scale' && <Ionicons name="scale" size={20} color="#3B82F6" />}
                        {metric.icon === 'fitness' && <Ionicons name="fitness" size={20} color="#9333EA" />}
                        {metric.icon === 'moon' && <Ionicons name="moon" size={20} color="#3B82F6" />}
                        {metric.changeType === 'up' && (
                          <Ionicons name="trending-up" size={16} color="#10B981" />
                        )}
                        {metric.changeType === 'down' && (
                          <Ionicons name="trending-down" size={16} color="#10B981" />
                        )}
                      </View>
                      <Text className="text-2xl font-bold text-gray-900">
                        {metric.current}
                        {metric.unit && ` ${metric.unit}`}
                      </Text>
                      <Text className="text-xs text-gray-600 mt-1">{metric.name}</Text>
                      {metric.change !== 0 && (
                        <Text className={cn(
                          'text-xs mt-1',
                          metric.changeType === 'down' ? 'text-green-600' : 'text-green-600'
                        )}>
                          {metric.changeType === 'down' ? '-' : '+'}
                          {Math.abs(metric.change)}
                          {metric.unit.includes('kg') ? ' kg' : metric.unit.includes('h') ? 'h' : ''} esta semana
                        </Text>
                      )}
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Tendencia semanal de glucosa */}
            {renderLineChart()}

            {/* Monitoreo emocional */}
            <View className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
              <Text className="mb-3 text-gray-900 font-semibold text-lg">Monitoreo emocional</Text>
              <View className="flex-row items-start gap-3 mb-4">
                <Text className="text-3xl">😁</Text>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold mb-1">
                    Estado emocional: {emotionalState}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    {emotionalMessage}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-sm text-gray-700 mb-2">Nivel de estrés</Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${stressLevel}%` }}
                    />
                  </View>
                  <Text className="text-sm text-gray-700 font-semibold">Bajo</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'challenges' && (
          <>
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Mini-retos de hoy</Text>
            <Text className="text-sm text-gray-600 mb-4">
              Completa estos retos para cuidar tu diabetes y ganar monedas 🦴
            </Text>
            <View className="gap-3 mb-6">
              {challenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className={cn(challenge.completed ? 'bg-green-50 border-green-200' : 'bg-white')}
                >
                  <CardContent>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <Text className="text-2xl">{challenge.icon}</Text>
                        <View className="flex-1">
                          <Text
                            className={cn(
                              'font-semibold mb-1',
                              challenge.completed ? 'text-green-700 line-through' : 'text-gray-900'
                            )}
                          >
                            {challenge.title}
                          </Text>
                          {challenge.completed ? (
                            <Text className="text-sm text-green-600">
                              ¡Completado! +{challenge.coins} 🦴
                            </Text>
                          ) : (
                            <Text className="text-sm text-gray-600">
                              Completa para ganar {challenge.coins} monedas 🦴
                            </Text>
                          )}
                        </View>
                      </View>
                      {challenge.completed ? (
                        <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleCompleteChallenge(challenge.id)}
                          activeOpacity={0.8}
                          className="bg-rimac px-4 py-2 rounded-lg"
                        >
                          <Text className="text-white text-sm font-semibold">Marcar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Sugerencias para maÃ±ana */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <View className="flex-row items-start gap-3">
                <Text className="text-2xl">💡</Text>
                <View className="flex-1">
                  <Text className="text-blue-900 font-semibold mb-2">Sugerencias para mañana</Text>
                  <View className="gap-2">
                    <Text className="text-sm text-blue-800">
                      • Respiración profunda 2 minutos para reducir estrés
                    </Text>
                    <Text className="text-sm text-blue-800">
                      • Incluir proteína en cada comida
                    </Text>
                    <Text className="text-sm text-blue-800">
                      • Revisar etiquetas nutricionales al comprar
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {selectedTab === 'medication' && (
          <>
            {/* Adherencia mensual */}
            <View className="bg-green-500 rounded-2xl p-6 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-semibold text-lg">Adherencia este mes</Text>
                <Text className="text-2xl">💊</Text>
              </View>
              <Text className="text-4xl text-white font-bold mb-2">{adherenceRate}%</Text>
              <Text className="text-white/90 text-sm mb-4">¡Excelente trabajo!</Text>
              <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-white rounded-full"
                  style={{ width: `${adherenceRate}%` }}
                />
              </View>
            </View>

            {/* Medicación de hoy */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Medicación de hoy</Text>
            <View className="gap-3">
              {medications.map((medication) => (
                <Card
                  key={medication.id}
                  className={cn(
                    medication.taken && !medication.isLate && 'bg-green-50 border-green-200',
                    medication.isLate && 'bg-yellow-50 border-yellow-200',
                    !medication.taken && 'bg-blue-50 border-blue-200'
                  )}
                >
                  <CardContent>
                    <View className="flex-row items-center gap-3 mb-3">
                      {medication.taken && !medication.isLate && (
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      )}
                      {medication.isLate && (
                        <Ionicons name="time" size={24} color="#F59E0B" />
                      )}
                      {!medication.taken && (
                        <Ionicons name="notifications" size={24} color="#3B82F6" />
                      )}
                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold">{medication.name}</Text>
                        <Text className="text-sm text-gray-600">{medication.meal}</Text>
                      </View>
                      <Text className={cn(
                        'text-sm font-semibold',
                        medication.taken && !medication.isLate && 'text-green-700',
                        medication.isLate && 'text-yellow-700',
                        !medication.taken && 'text-gray-600'
                      )}>
                        {medication.taken ? medication.takenAt : medication.time}
                      </Text>
                    </View>
                    {medication.taken && medication.isLate && (
                      <View className="bg-yellow-100 rounded-lg p-2 mb-3">
                        <Text className="text-yellow-800 text-sm">
                          Debes tomar a tiempo tu medicina. Tolerancia de 10 a 15 minutos.
                        </Text>
                      </View>
                    )}
                    {!medication.taken && (
                      <TouchableOpacity
                        onPress={() => handleMarkMedication(medication.id)}
                        activeOpacity={0.8}
                        className="bg-rimac px-4 py-3 rounded-lg items-center"
                      >
                        <Text className="text-white font-semibold">Marcar como tomada</Text>
                      </TouchableOpacity>
                    )}
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal para agregar medidas */}
      <Modal
        visible={showAddMeasureModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddMeasureModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-end">
          <View className="bg-white rounded-t-3xl w-full p-6" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 font-semibold text-lg">Agregar medida</Text>
              <TouchableOpacity onPress={() => setShowAddMeasureModal(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 mb-4">Selecciona el tipo de medida</Text>
            
            <View className="flex-row flex-wrap gap-2 mb-4">
              {[
                { type: 'glucose' as const, label: 'Glucosa', icon: 'GL' },
                { type: 'pressure' as const, label: 'Presion', icon: 'PR' },
                { type: 'weight' as const, label: 'Peso', icon: 'KG' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.type}
                  onPress={() => setNewMeasureType(item.type)}
                  className={cn(
                    'px-4 py-3 rounded-xl border-2',
                    newMeasureType === item.type
                      ? 'border-rimac bg-red-50'
                      : 'border-gray-200 bg-white'
                  )}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-2">
                    <Text>{item.icon}</Text>
                    <Text
                      className={cn(
                        'font-semibold',
                        newMeasureType === item.type ? 'text-rimac' : 'text-gray-700'
                      )}
                    >
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm text-gray-600 mb-2">Valor</Text>
            <TextInput
              value={newMeasureValue}
              onChangeText={setNewMeasureValue}
              placeholder={
                newMeasureType === 'glucose'
                  ? 'mg/dL'
                  : newMeasureType === 'pressure'
                  ? 'mmHg'
                  : 'kg'
              }
              keyboardType="numeric"
              className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
            />

            <TouchableOpacity
              onPress={handleSaveMeasure}
              className="bg-rimac rounded-xl py-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold text-lg">Guardar medida</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

