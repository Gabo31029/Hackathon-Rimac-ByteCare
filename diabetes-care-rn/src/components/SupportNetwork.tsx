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

interface AlertItem {
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
      name: 'Carlos Fernandez',
      relationship: 'Esposo',
      status: 'active',
      canSee: [
        'Progreso general y adherencia',
        'Alertas de glucosa critica',
        'Reporte mensual',
      ],
      mode: 'accompaniment',
    },
    {
      id: '2',
      name: 'Ana Fernandez',
      relationship: 'Hija',
      status: 'active',
      canSee: ['Alertas de glucosa critica'],
      mode: 'alerts-only',
    },
  ]);

  const [professionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'Dr. Juan Perez',
      specialization: 'Endocrinologo',
      phone: '+51 999 888 777',
      nextAppointment: '15 de enero, 10:00 AM',
      completedAppointments: 3,
    },
    {
      id: '2',
      name: 'Lic. Maria Gonzalez',
      specialization: 'Nutricionista',
      phone: '+51 999 888 666',
      completedAppointments: 1,
    },
    {
      id: '3',
      name: 'Psic. Roberto Silva',
      specialization: 'Psicologo clinico',
      phone: '+51 999 888 555',
      completedAppointments: 0,
    },
  ]);

  const monthlyReport = {
    month: 'Diciembre 2024',
    sentAt: 'Enviado hace 2 dias',
    highlights: [
      { label: 'Dias en rango', value: '24 / 30', delta: '+4 vs nov', color: '#10B981' },
      { label: 'Check-ins completados', value: '82%', delta: '+6%', color: '#3B82F6' },
      { label: 'Actividad fisica', value: '18 sesiones', delta: '+3', color: '#F59E0B' },
    ],
    glucoseStats: {
      promedio: '112 mg/dL',
      picosAltos: '3 eventos > 200 mg/dL',
      picosBajos: '1 evento < 70 mg/dL',
      nocheEnRango: '83% de las noches en 80-130',
    },
    medication: {
      adherencia: '95%',
      dosisAtrasadas: 1,
      notas: 'Se adelanto recordatorio de la dosis nocturna.',
    },
    events: [
      'Se ajusto horario de cena para evitar pico nocturno (Nutricionista).',
      'Familia apoyo en caminata post almuerzo 3 dias.',
      'Sin alertas criticas en las ultimas 2 semanas.',
    ],
    nextMonth: [
      'Programar control endocrino la primera semana (Endocrinólogo).',
      'Mantener respiraciones guiadas 3 veces por semana (Ana).',
      'Revisar colaciones nocturnas y reducir dulces procesados (Carlos).',
    ],
    sections: [
      {
        title: 'Habitos destacados',
        items: [
          'Caminar despues del almuerzo 4 dias por semana.',
          'Registro constante de glucosa en la manana.',
          'Respiraciones guiadas para reducir estres nocturno.',
        ],
      },
      {
        title: 'Enfoques para enero',
        items: [
          'Reforzar hidratacion (2L diarios).',
          'Ajustar meriendas nocturnas con nutricionista.',
        ],
      },
    ],
    sharedWith: ['Carlos', 'Ana'],
  };

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      title: 'Glucosa critica',
      condition: '< 70 o > 250 mg/dL',
      notifyTo: ['Carlos y Ana'],
      enabled: true,
      icon: '⚠️',
      color: '#EF4444',
    },
    {
      id: '2',
      title: 'Sin mediciones',
      condition: 'Mas de 3 dias sin registrar',
      notifyTo: ['Carlos'],
      enabled: true,
      icon: '🔔',
      color: '#F59E0B',
    },
    {
      id: '3',
      title: 'Patron emocional preocupante',
      condition: 'Estres o ansiedad alta por 5+ dias',
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
      message: 'No se han activado alertas en los ultimos 14 dias',
      date: 'Hace 14 dias',
    },
    {
      id: '2',
      type: 'suggestion',
      message: 'El sistema sugirio una cita psicologica',
      date: 'Hace 3 dias',
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
      'Esta funcion te permitira invitar a un familiar a tu red de apoyo.',
      [{ text: 'OK', onPress: () => setShowAddFamily(false) }]
    );
  };

  const handleViewFullReport = () => {
    setShowFullReport(prev => !prev);
  };

  const handleShareReport = () => {
    Alert.alert('Reporte compartido', 'Tu familia recibira la version completa por correo.');
  };

  const handleSchedulePsychologist = () => {
    Alert.alert(
      'Agendar cita con psicologo',
      'Deseas agendar una cita con el psicologo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agendar',
          onPress: () => {
            onEarnCoins(0, 10);
            Alert.alert('Cita agendada', 'Ganaste 10 monedas Rimac');
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
      `Deseas agendar una cita con ${professional.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agendar',
          onPress: () => {
            onEarnCoins(0, 10);
            Alert.alert('Cita agendada', 'Ganaste 10 monedas Rimac');
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
                  <Text className="text-rose-900 mb-1 font-semibold text-lg">No estas solo</Text>
                  <Text className="text-sm text-rose-800">
                    Tu familia puede acompanar tu cuidado de forma respetuosa y sin invadir tu privacidad.
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
                          {member.relationship} - {member.mode === 'accompaniment' ? 'Modo Acompanhar activo' : 'Solo alertas criticas'}
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
            </View>

            {/* Reporte mensual */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Reporte mensual para familia</Text>
            <Card className="mb-4">
              <CardContent>
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-gray-900 font-semibold text-lg">{monthlyReport.month}</Text>
                    <Text className="text-sm text-gray-600">{monthlyReport.sentAt}</Text>
                  </View>
                  <Ionicons name="calendar" size={24} color="#6B7280" />
                </View>

                <View className="gap-3">
                  {monthlyReport.highlights.map((item) => (
                    <View
                      key={item.label}
                      className="flex-row items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <View>
                        <Text className="font-medium" style={{ color: item.color }}>
                          {item.label}
                        </Text>
                        <Text className="text-xs text-gray-600 mt-1">{item.delta}</Text>
                      </View>
                      <Text className="font-bold text-lg" style={{ color: item.color }}>
                        {item.value}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleViewFullReport}
                  className="mt-4 border border-gray-300 rounded-xl py-3 items-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 font-semibold">
                    {showFullReport ? 'Ocultar reporte' : 'Ver reporte completo'}
                  </Text>
                </TouchableOpacity>

                {showFullReport && (
                  <View className="mt-4 border border-gray-200 rounded-2xl p-4 bg-gray-50">
                    <Text className="text-gray-900 font-semibold mb-3">Resumen enviado</Text>
                    <View className="mb-4">
                      <Text className="text-sm text-gray-700 font-semibold mb-2">Glucosa y eventos</Text>
                      <View className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
                        <Text className="text-sm text-gray-700">Promedio: {monthlyReport.glucoseStats.promedio}</Text>
                        <Text className="text-sm text-gray-700 mt-1">{monthlyReport.glucoseStats.picosAltos}</Text>
                        <Text className="text-sm text-gray-700 mt-1">{monthlyReport.glucoseStats.picosBajos}</Text>
                        <Text className="text-sm text-gray-700 mt-1">{monthlyReport.glucoseStats.nocheEnRango}</Text>
                      </View>

                      <Text className="text-sm text-gray-700 font-semibold mb-2">Adherencia y medicacion</Text>
                      <View className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
                        <Text className="text-sm text-gray-700">Adherencia: {monthlyReport.medication.adherencia}</Text>
                        <Text className="text-sm text-gray-700 mt-1">
                          Dosis atrasadas: {monthlyReport.medication.dosisAtrasadas}
                        </Text>
                        <Text className="text-sm text-gray-700 mt-1">{monthlyReport.medication.notas}</Text>
                      </View>
                    </View>

                    {monthlyReport.sections.map((section) => (
                      <View key={section.title} className="mb-4">
                        <Text className="text-sm text-gray-700 font-semibold mb-2">{section.title}</Text>
                        {section.items.map((item, idx) => (
                          <View key={idx} className="flex-row items-start gap-2 mb-1">
                            <Text className="text-base text-gray-500">-</Text>
                            <Text className="text-sm text-gray-600 flex-1">{item}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                    <View className="mb-4">
                      <Text className="text-sm text-gray-700 font-semibold mb-2">Compartido con</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {monthlyReport.sharedWith.map((name) => (
                          <View key={name} className="px-3 py-1 rounded-full bg-white border border-gray-200">
                            <Text className="text-xs text-gray-700">{name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <View className="mb-4">
                      <Text className="text-sm text-gray-700 font-semibold mb-2">Eventos importantes</Text>
                      {monthlyReport.events.map((ev, idx) => (
                        <View key={idx} className="flex-row items-start gap-2 mb-1">
                          <Text className="text-base text-gray-500">-</Text>
                          <Text className="text-sm text-gray-600 flex-1">{ev}</Text>
                        </View>
                      ))}
                    </View>
                    <View className="mb-4">
                      <Text className="text-sm text-gray-700 font-semibold mb-2">Plan proximo mes</Text>
                      {monthlyReport.nextMonth.map((ev, idx) => (
                        <View key={idx} className="flex-row items-start gap-2 mb-1">
                          <Text className="text-base text-gray-500">-</Text>
                          <Text className="text-sm text-gray-600 flex-1">{ev}</Text>
                        </View>
                      ))}
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={handleShareReport}
                        className="flex-1 bg-rimac rounded-xl py-3 items-center"
                        activeOpacity={0.7}
                      >
                        <Text className="text-white font-semibold">Compartir de nuevo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowFullReport(false)}
                        className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-700 font-semibold">Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </CardContent>
            </Card>


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
                    Detectamos que reportaste estres esta semana. Hablar con un profesional puede ayudarte.
                  </Text>
                  <TouchableOpacity
                    onPress={handleSchedulePsychologist}
                    className="bg-purple-600 rounded-xl py-3 px-4 items-center"
                    activeOpacity={0.7}
                  >
                    <Text className="text-white font-semibold">Agendar cita con psicologo</Text>
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

                    {professional.specialization === 'Psicologo clinico' && (
                      <View className="mb-4 p-3 bg-purple-50 rounded-xl">
                        <Text className="text-sm text-purple-800 mb-1">
                          Especialista en manejo de enfermedades cronicas y burnout diabetico
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
                          {professional.nextAppointment ? 'Proxima cita' : 'Agendar cita'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {professional.nextAppointment && (
                      <Text className="text-sm text-gray-600 mt-3 text-center">
                        Proxima cita: {professional.nextAppointment}
                      </Text>
                    )}

                    {professional.completedAppointments > 0 && (
                      <View className="mt-4 pt-4 border-t border-gray-200">
                        <View className="bg-green-50 rounded-xl p-3 flex-row items-center gap-3">
                          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                          <View className="flex-1">
                            <Text className="text-green-900 font-semibold">Cita completada</Text>
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
            {/* Sistema de proteccion */}
            <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-4">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center">
                  <Ionicons name="shield-checkmark" size={24} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-emerald-900 mb-1 font-semibold text-lg">
                    Sistema de proteccion activo
                  </Text>
                  <Text className="text-sm text-emerald-800">
                    Tu familia sera alertada solo cuando realmente lo necesites
                  </Text>
                </View>
              </View>
            </View>

            {/* Alertas automaticas */}
            <Text className="mb-3 text-gray-900 font-semibold text-lg">Alertas automaticas</Text>
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
                          {alert.id === '3' && ' y sugiere cita psicologica'}
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
                            Excelente trabajo manteniendo tu control!
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
                            {item.message} hace 3 dias
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




