import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Card, CardContent } from './ui/Card';

interface SupportNetworkProps {
  onBack: () => void;
  onEarnCoins: (bone: number, rimac: number) => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  status: 'active' | 'inactive';
  canSee: string[];
  mode: 'accompaniment' | 'alerts-only';
}

interface Professional {
  id: string;
  name: string;
  specialization: string;
  phone?: string;
  nextAppointment?: string;
  completedAppointments: number;
}

interface Alert {
  id: string;
  title: string;
  condition: string;
  notifyTo: string[];
  enabled: boolean;
  icon: string;
  color: string;
}

export function SupportNetwork({ onBack, onEarnCoins }: SupportNetworkProps) {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'family' | 'professional' | 'alerts'>('family');
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const [familyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Carlos Fernández',
      relationship: 'Esposo',
      status: 'active',
      canSee: [
        'Progreso general y adherencia',
        'Alertas de glucosa crítica',
        'Reporte mensual',
      ],
      mode: 'accompaniment',
    },
    {
      id: '2',
      name: 'Ana Fernández',
      relationship: 'Hija',
      status: 'active',
      canSee: ['Alertas de glucosa crítica'],
      mode: 'alerts-only',
    },
  ]);

  const [professionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'Dr. Juan Pérez',
      specialization: 'Endocrinólogo',
      phone: '+51 999 888 777',
      nextAppointment: '15 de enero, 10:00 AM',
      completedAppointments: 3,
    },
    {
      id: '2',
      name: 'Lic. María González',
      specialization: 'Nutricionista',
      phone: '+51 999 888 666',
      completedAppointments: 1,
    },
    {
      id: '3',
      name: 'Psic. Roberto Silva',
      specialization: 'Psicólogo clínico',
      phone: '+51 999 888 555',
      completedAppointments: 0,
    },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Glucosa crítica',
      condition: '< 70 o > 250 mg/dL',
      notifyTo: ['Carlos y Ana'],
      enabled: true,
      icon: '⚠️',
      color: '#EF4444',
    },
    {
      id: '2',
      title: 'Sin mediciones',
      condition: 'Más de 3 días sin registrar',
      notifyTo: ['Carlos'],
      enabled: true,
      icon: '🔔',
      color: '#F59E0B',
    },
    {
      id: '3',
      title: 'Patrón emocional preocupante',
      condition: 'Estrés o ansiedad alta por 5+ días',
      notifyTo: ['Carlos'],
      enabled: true,
      icon: '💜',
      color: '#9333EA',
    },
  ]);

  const [alertHistory] = useState([
    {
      id: '1',
      type: 'all-clear',
      message: 'No se han activado alertas en los últimos 14 días',
      date: 'Hace 14 días',
    },
    {
      id: '2',
      type: 'suggestion',
      message: 'El sistema sugirió una cita psicológica',
      date: 'Hace 3 días',
      action: 'Agendar ahora',
    },
  ]);

  const handleToggleAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const handleAddFamily = () => {
    setShowAddFamily(true);
    Alert.alert(
      'Agregar familiar',
      'Esta función te permitirá invitar a un familiar a tu red de apoyo.',
      [{ text: 'OK', onPress: () => setShowAddFamily(false) }]
    );
  };

  const handleViewFullReport = () => {
    setShowFullReport(true);
    Alert.alert(
      'Reporte completo',
      'Aquí verías el reporte mensual completo con todos los detalles de tu salud.',
      [{ text: 'OK', onPress: () => setShowFullReport(false) }]
    );
  };

  const handleSchedulePsychologist = () => {
    Alert.alert(
      'Agendar cita con psicólogo',
      '¿Deseas agendar una cita con el psicólogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agendar',
          onPress: () => {
            onEarnCoins(0, 10);
            Alert.alert('¡Cita agendada!', 'Ganaste 10 monedas Rimac 🎉');
          },
        },
      ]
    );
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleMessage = (name: string) => {
    Alert.alert('Mensaje', `Enviar mensaje a ${name}`);
  };

  const handleScheduleAppointment = (professional: Professional) => {
    Alert.alert(
      'Agendar cita',
      `¿Deseas agendar una cita con ${professional.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agendar',
          onPress: () => {
            onEarnCoins(0, 10);
            Alert.alert('¡Cita agendada!', 'Ganaste 10 monedas Rimac 🎉');
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-rimac p-4 pb-6" style={{ paddingTop: Math.max(insets.top, 16) }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Red de Apoyo</Text>
          <TouchableOpacity onPress={handleAddFamily} activeOpacity={0.7}>
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
              activeOpacity={0.8}
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
              <View className="flex-row items-start gap-3">
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
              {familyMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent>
                    <View className="flex-row items-center gap-3 mb-3">
                      <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                        <Text className="text-xl">{member.relationship === 'Esposo' ? '👨' : '👩'}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold">{member.name}</Text>
                        <Text className="text-sm text-gray-600">
                          {member.relationship} - {member.mode === 'accompaniment' ? 'Modo Acompañar activo' : 'Solo alertas críticas'}
                        </Text>
                      </View>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={member.status === 'active' ? '#10B981' : '#9CA3AF'}
                      />
                    </View>
                    <View className="pt-3 border-t border-gray-200">
                      <Text className="text-sm text-gray-700 mb-2 font-semibold">Puede ver:</Text>
                      {member.canSee.map((item, idx) => (
                        <View key={idx} className="flex-row items-center gap-2 mb-1">
                          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                          <Text className="text-sm text-gray-600">{item}</Text>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Reporte mensual */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Reporte mensual para familia</Text>
            <Card className="mb-4">
              <CardContent>
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-gray-900 font-semibold text-lg">Reporte de Diciembre</Text>
                    <Text className="text-sm text-gray-600">Enviado hace 2 días</Text>
                  </View>
                  <Ionicons name="calendar" size={24} color="#6B7280" />
                </View>

                <View className="gap-3">
                  <View className="flex-row items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="pulse" size={24} color="#059669" />
                      <Text className="text-emerald-700 font-medium">Glucosa promedio</Text>
                    </View>
                    <Text className="text-emerald-900 font-bold text-lg">112 mg/dL</Text>
                  </View>

                  <View className="flex-row items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="checkmark-circle" size={24} color="#059669" />
                      <Text className="text-emerald-700 font-medium">Adherencia</Text>
                    </View>
                    <Text className="text-emerald-900 font-bold text-lg">95%</Text>
                  </View>

                  <View className="flex-row items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="flame" size={24} color="#2563EB" />
                      <Text className="text-blue-700 font-medium">Racha actual</Text>
                    </View>
                    <Text className="text-blue-900 font-bold text-lg">7 días</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleViewFullReport}
                  className="mt-4 border border-gray-300 rounded-xl py-3 items-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 font-semibold">Ver reporte completo</Text>
                </TouchableOpacity>
              </CardContent>
            </Card>

            {/* Agregar familiar */}
            <TouchableOpacity
              onPress={handleAddFamily}
              className="bg-white border border-gray-200 rounded-xl p-6 items-center mb-4"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="add" size={32} color="#6B7280" />
              </View>
              <Text className="text-gray-900 font-semibold text-lg mb-1">Agregar familiar</Text>
              <Text className="text-sm text-gray-600 text-center">
                Invita a alguien a tu red de apoyo
              </Text>
            </TouchableOpacity>
          </>
        )}

        {selectedTab === 'professional' && (
          <>
            {/* Cuidado emocional */}
            <View className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-4">
              <View className="flex-row items-start gap-3 mb-4">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                  <Ionicons name="medical" size={24} color="#9333EA" />
                </View>
                <View className="flex-1">
                  <Text className="text-purple-900 mb-1 font-semibold text-lg">Cuidado emocional</Text>
                  <Text className="text-sm text-purple-800 mb-3">
                    Detectamos que has reportado estrés en algunos momentos esta semana. Hablar con un profesional puede ayudarte.
                  </Text>
                  <TouchableOpacity
                    onPress={handleSchedulePsychologist}
                    className="bg-purple-600 rounded-xl py-3 px-4 items-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-white font-semibold">Agendar cita con psicólogo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Equipo de salud */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Equipo de salud</Text>
            <View className="gap-3 mb-4">
              {professionals.map((professional) => (
                <Card key={professional.id}>
                  <CardContent>
                    <View className="flex-row items-center gap-3 mb-4">
                      <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="medical" size={24} color="#2563EB" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold">{professional.name}</Text>
                        <Text className="text-sm text-gray-600">{professional.specialization}</Text>
                      </View>
                      {professional.phone && (
                        <TouchableOpacity
                          onPress={() => handleCall(professional.phone!)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="call" size={24} color="#6B7280" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {professional.specialization === 'Psicólogo clínico' && (
                      <View className="mb-4 p-3 bg-purple-50 rounded-xl">
                        <Text className="text-sm text-purple-800 mb-1">
                          Especialista en manejo de enfermedades crónicas y burnout diabético
                        </Text>
                      </View>
                    )}

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleMessage(professional.name)}
                        className="flex-1 bg-rimac rounded-xl py-3 items-center"
                        activeOpacity={0.7}
                      >
                        <Text className="text-white font-semibold">Mensaje</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleScheduleAppointment(professional)}
                        className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-700 font-semibold">
                          {professional.nextAppointment ? 'Próxima cita' : 'Agendar cita'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {professional.nextAppointment && (
                      <Text className="text-sm text-gray-600 mt-3 text-center">
                        Próxima cita: {professional.nextAppointment}
                      </Text>
                    )}

                    {professional.completedAppointments > 0 && (
                      <View className="mt-4 pt-4 border-t border-gray-200">
                        <View className="bg-green-50 rounded-xl p-3 flex-row items-center gap-3">
                          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                          <View className="flex-1">
                            <Text className="text-green-900 font-semibold">¡Cita completada!</Text>
                            <Text className="text-sm text-green-700">
                              Completaste tu cita con el {professional.specialization.toLowerCase()} el 15 de diciembre.
                            </Text>
                            <Text className="text-sm text-green-700 mt-1">
                              🦴 Ganaste 10 monedas Rimac
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'alerts' && (
          <>
            {/* Sistema de protección */}
            <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-4">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center">
                  <Ionicons name="shield-checkmark" size={24} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-emerald-900 mb-1 font-semibold text-lg">
                    Sistema de protección activo
                  </Text>
                  <Text className="text-sm text-emerald-800">
                    Tu familia será alertada solo cuando realmente lo necesites
                  </Text>
                </View>
              </View>
            </View>

            {/* Alertas automáticas */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Alertas automáticas</Text>
            <View className="gap-3 mb-4">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent>
                    <View className="flex-row items-start gap-3">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${alert.color}20` }}
                      >
                        <Text className="text-2xl">{alert.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold mb-1">{alert.title}</Text>
                        <Text className="text-sm text-gray-600 mb-2">{alert.condition}</Text>
                        <Text className="text-sm text-gray-700">
                          Notifica a {alert.notifyTo.join(' y ')} {alert.id === '3' ? 'inmediatamente' : alert.id === '2' ? '' : 'inmediatamente'}
                          {alert.id === '3' && ' y sugiere cita psicológica'}
                        </Text>
                      </View>
                      <Switch
                        value={alert.enabled}
                        onValueChange={() => handleToggleAlert(alert.id)}
                        trackColor={{ false: '#D1D5DB', true: alert.color }}
                        thumbColor={alert.enabled ? '#FFFFFF' : '#F3F4F6'}
                      />
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Historial reciente */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Historial reciente</Text>
            <View className="gap-3 mb-4">
              {alertHistory.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    {item.type === 'all-clear' ? (
                      <View className="flex-row items-start gap-3">
                        <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center">
                          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-emerald-900 font-semibold mb-1">Todo en orden</Text>
                          <Text className="text-sm text-emerald-700 mb-1">{item.message}</Text>
                          <Text className="text-sm text-emerald-600">
                            ¡Excelente trabajo manteniendo tu control!
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row items-start gap-3">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                          <Ionicons name="notifications" size={24} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-blue-900 font-semibold mb-1">Sugerencia de apoyo</Text>
                          <Text className="text-sm text-blue-700 mb-3">
                            {item.message} hace 3 días
                          </Text>
                          <TouchableOpacity
                            onPress={handleSchedulePsychologist}
                            className="self-start"
                            activeOpacity={0.7}
                          >
                            <Text className="text-blue-600 font-semibold underline">{item.action}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </CardContent>
                </Card>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
