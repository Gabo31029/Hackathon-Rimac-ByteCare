import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Card, CardContent } from './ui/Card';
import { Progress } from './ui/Progress';

interface EducationModuleProps {
  onBack: () => void;
  onEarnCoins: (bone: number, rimac: number) => void;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'article' | 'quiz';
  points: number;
  content?: string;
  questions?: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  lessons: Lesson[];
}

const initialModules: Module[] = [
  {
    id: 1,
    title: 'Fundamentos de la diabetes',
    description: 'Lo esencial que debes saber sobre tu condición',
    level: 'beginner',
    progress: 80,
    lessons: [
      {
        id: 1,
        title: '¿Qué es la diabetes tipo 2?',
        duration: '5 min',
        completed: true,
        type: 'video',
        points: 5,
        content: 'Este contenido te ayudará a entender mejor cómo manejar tu diabetes en situaciones cotidianas.',
      },
      {
        id: 2,
        title: 'Cómo funciona la insulina',
        duration: '4 min',
        completed: true,
        type: 'article',
        points: 5,
        content: 'La insulina es una hormona producida por el páncreas que ayuda a la glucosa a entrar en las células para ser usada como energía.',
      },
      {
        id: 3,
        title: 'Síntomas de hipo e hiperglucemia',
        duration: '6 min',
        completed: true,
        type: 'video',
        points: 5,
        content: 'Aprende a reconocer los síntomas de niveles altos y bajos de glucosa para actuar a tiempo.',
      },
      {
        id: 4,
        title: 'Quiz: Fundamentos',
        duration: '3 min',
        completed: false,
        type: 'quiz',
        points: 10,
        questions: [
          {
            id: 1,
            question: '¿Qué es la diabetes tipo 2?',
            options: [
              'Falta total de insulina',
              'Resistencia a la insulina',
              'Exceso de insulina',
              'No hay insulina',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Nutrición inteligente',
    description: 'Aprende a comer sin elevar tu glucosa',
    level: 'intermediate',
    progress: 40,
    lessons: [
      {
        id: 5,
        title: 'Cómo leer una etiqueta nutricional',
        duration: '7 min',
        completed: true,
        type: 'video',
        points: 5,
        content: 'Aprende a interpretar las etiquetas nutricionales para tomar mejores decisiones alimentarias.',
      },
      {
        id: 6,
        title: 'Índice glucémico explicado',
        duration: '5 min',
        completed: true,
        type: 'article',
        points: 5,
        content: 'El índice glucémico mide qué tan rápido un alimento eleva tu nivel de glucosa en sangre.',
      },
      {
        id: 7,
        title: 'Comer fuera de casa sin riesgos',
        duration: '8 min',
        completed: false,
        type: 'video',
        points: 5,
        content: 'Consejos prácticos para mantener tu control glucémico cuando comes fuera de casa.',
      },
      {
        id: 8,
        title: 'Porciones adecuadas',
        duration: '6 min',
        completed: false,
        type: 'article',
        points: 5,
        content: 'Aprende a medir porciones adecuadas usando métodos simples y prácticos.',
      },
    ],
  },
];

const learningTips = [
  'Estudia 15 minutos al día. La constancia es más efectiva que sesiones largas.',
  'Toma notas mientras aprendes. Escribir ayuda a retener mejor la información.',
  'Repasa los conceptos clave antes de dormir. Tu cerebro consolida mejor la información durante el sueño.',
  'Comparte lo que aprendes con tu familia. Enseñar a otros refuerza tu propio aprendizaje.',
  'Celebra cada logro educativo. Cada lección completada es un paso hacia mejor salud.',
];

export function EducationModule({ onBack, onEarnCoins }: EducationModuleProps) {
  const insets = useSafeAreaInsets();
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Calcular estadísticas generales
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => l.completed).length,
    0
  );
  const inProgressLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => !l.completed && m.progress > 0).length,
    0
  );
  const totalCoinsEarned = modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => l.completed).reduce((sum, l) => sum + l.points, 0),
    0
  );
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleCompleteLesson = (lesson: Lesson) => {
    if (!lesson.completed && selectedModule) {
      onEarnCoins(lesson.points, 0);
      // Actualizar el estado del módulo
      const updatedModules = modules.map(m => {
        if (m.id === selectedModule.id) {
          const updatedLessons = m.lessons.map(l =>
            l.id === lesson.id ? { ...l, completed: true } : l
          );
          const completedCount = updatedLessons.filter(l => l.completed).length;
          const updatedModule = {
            ...m,
            lessons: updatedLessons,
            progress: Math.round((completedCount / updatedLessons.length) * 100),
          };
          if (selectedModule.id === m.id) {
            setSelectedModule(updatedModule);
          }
          return updatedModule;
        }
        return m;
      });
      setModules(updatedModules);
      Alert.alert('¡Lección completada!', `Ganaste ${lesson.points} monedas 🦴`);
      setSelectedLesson(null);
    }
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleCompleteQuiz = () => {
    if (!selectedLesson || !selectedLesson.questions) return;

    let correctAnswers = 0;
    selectedLesson.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / selectedLesson.questions.length) * 100);
    const passed = score >= 70;

    if (passed) {
      handleCompleteLesson(selectedLesson);
      setShowQuizResults(true);
      Alert.alert(
        '¡Quiz completado!',
        `Obtuviste ${score}% de respuestas correctas. Ganaste ${selectedLesson.points} monedas 🦴`
      );
    } else {
      Alert.alert(
        'Inténtalo de nuevo',
        `Obtuviste ${score}% de respuestas correctas. Necesitas al menos 70% para aprobar.`
      );
    }
  };

  // Vista de lección individual (video, artículo o quiz)
  if (selectedLesson) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-rimac p-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setSelectedLesson(null)} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">{selectedLesson.title}</Text>
            <View className="w-6" />
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {selectedLesson.type === 'quiz' ? (
            <View className="p-4">
              <View className="bg-white rounded-2xl p-6 mb-4">
                <View className="flex-row gap-2 mb-4">
                  <View className="bg-purple-100 px-3 py-1 rounded-full">
                    <Text className="text-purple-700 text-sm font-semibold">
                      {selectedLesson.duration}
                    </Text>
                  </View>
                  <View className="bg-blue-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                    <Text className="text-blue-700 text-sm font-semibold">
                      +{selectedLesson.points}
                    </Text>
                    <Text className="text-blue-700">🦴</Text>
                  </View>
                </View>

                <Text className="text-gray-900 font-semibold text-lg mb-2">
                  {selectedLesson.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-6">
                  Este contenido te ayudará a entender mejor cómo manejar tu diabetes en situaciones
                  cotidianas.
                </Text>

                {selectedLesson.questions?.map((question, qIdx) => (
                  <View key={question.id} className="mb-6">
                    <Text className="text-gray-900 font-semibold mb-4">
                      {qIdx + 1}. {question.question}
                    </Text>
                    <View className="gap-2">
                      {question.options.map((option, optIdx) => (
                        <TouchableOpacity
                          key={optIdx}
                          onPress={() =>
                            setQuizAnswers({ ...quizAnswers, [question.id]: optIdx })
                          }
                          className={cn(
                            'p-4 rounded-xl border-2',
                            quizAnswers[question.id] === optIdx
                              ? 'border-rimac bg-red-50'
                              : 'border-gray-200 bg-white'
                          )}
                          activeOpacity={0.7}
                        >
                          <Text
                            className={cn(
                              quizAnswers[question.id] === optIdx
                                ? 'text-rimac font-semibold'
                                : 'text-gray-900'
                            )}
                          >
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleCompleteQuiz}
                className="bg-rimac rounded-xl py-4 items-center"
                activeOpacity={0.7}
                style={{ marginBottom: Math.max(insets.bottom, 16) }}
              >
                <Text className="text-white font-semibold text-lg">Completar quiz</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="p-4">
              <View className="bg-gray-900 rounded-2xl h-48 mb-4 items-center justify-center">
                {selectedLesson.type === 'video' ? (
                  <Ionicons name="play-circle" size={64} color="white" />
                ) : (
                  <Ionicons name="document-text" size={64} color="white" />
                )}
              </View>

              <View className="bg-white rounded-2xl p-6 mb-4">
                <View className="flex-row gap-2 mb-4">
                  <View className="bg-purple-100 px-3 py-1 rounded-full">
                    <Text className="text-purple-700 text-sm font-semibold">
                      {selectedLesson.duration}
                    </Text>
                  </View>
                  <View className="bg-blue-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                    <Text className="text-blue-700 text-sm font-semibold">
                      +{selectedLesson.points}
                    </Text>
                    <Text className="text-blue-700">🦴</Text>
                  </View>
                </View>

                <Text className="text-gray-900 font-semibold text-lg mb-2">
                  {selectedLesson.title}
                </Text>
                <Text className="text-sm text-gray-600">
                  {selectedLesson.content ||
                    'Este contenido te ayudará a entender mejor cómo manejar tu diabetes en situaciones cotidianas.'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => handleCompleteLesson(selectedLesson)}
                disabled={selectedLesson.completed}
                className={cn(
                  'bg-rimac rounded-xl py-4 items-center',
                  selectedLesson.completed && 'opacity-50'
                )}
                activeOpacity={0.7}
                style={{ marginBottom: Math.max(insets.bottom, 16) }}
              >
                <Text className="text-white font-semibold text-lg">
                  {selectedLesson.completed ? 'Completado' : 'Marcar como completado'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Vista de módulo específico (lista de lecciones)
  if (selectedModule) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-rimac p-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => setSelectedModule(null)} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">Lecciones</Text>
            <View className="w-6" />
          </View>

          <View className="mb-2">
            <Text className="text-white text-sm mb-2">Progreso del módulo</Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-lg font-semibold">{selectedModule.progress}%</Text>
            </View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden">
              <View
                className="h-full bg-white rounded-full"
                style={{ width: `${selectedModule.progress}%` }}
              />
            </View>
          </View>
        </View>

        <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold text-lg mb-1">
              {selectedModule.title}
            </Text>
            <Text className="text-sm text-gray-600">{selectedModule.description}</Text>
          </View>

          <View className="gap-3">
            {selectedModule.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleStartLesson(lesson)}
                activeOpacity={0.7}
              >
                <Card className={cn(lesson.completed && 'border-green-200')}>
                  <CardContent>
                    <View className="flex-row items-center gap-3">
                      {lesson.completed ? (
                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        </View>
                      ) : lesson.type === 'quiz' ? (
                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                          <Ionicons name="bookmark" size={20} color="#6B7280" />
                        </View>
                      ) : (
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                          {lesson.type === 'video' && (
                            <Ionicons name="play-circle" size={20} color="#2563EB" />
                          )}
                          {lesson.type === 'article' && (
                            <Ionicons name="document-text" size={20} color="#2563EB" />
                          )}
                        </View>
                      )}

                      <View className="flex-1">
                        <Text
                          className={cn(
                            'font-semibold mb-1',
                            lesson.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                          )}
                        >
                          {lesson.title}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-sm text-gray-600">{lesson.duration}</Text>
                          <Text className="text-sm text-gray-600">
                            +{lesson.points} 🦴
                          </Text>
                        </View>
                      </View>

                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Vista principal (módulos y progreso general)
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-rimac p-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Aprendo y Mejoro</Text>
          <View className="w-6" />
        </View>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {/* Progreso general */}
        <View className="bg-purple-600 rounded-2xl p-6 mb-4">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white/90 text-sm mb-1">Tu progreso general</Text>
              <Text className="text-white text-4xl font-bold mb-2">{overallProgress}%</Text>
              <Text className="text-white/90 text-sm">Sigue así, vas muy bien</Text>
            </View>
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="book" size={24} color="white" />
            </View>
          </View>

          <View className="pt-4 border-t border-white/20">
            <View className="flex-row items-center justify-around">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{completedLessons}</Text>
                <Text className="text-white/90 text-sm">Completadas</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{inProgressLessons}</Text>
                <Text className="text-white/90 text-sm">En progreso</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">{totalCoinsEarned}</Text>
                <Text className="text-white/90 text-sm">Monedas ganadas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Módulos */}
        <Text className="mb-3 text-gray-900 font-semibold text-lg">Módulos disponibles</Text>
        <View className="gap-4 mb-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardContent>
                <TouchableOpacity onPress={() => setSelectedModule(module)} activeOpacity={0.7}>
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-900 font-semibold text-lg">{module.title}</Text>
                      <View
                        className={cn(
                          'px-2 py-1 rounded-full',
                          module.level === 'beginner' && 'bg-green-100',
                          module.level === 'intermediate' && 'bg-yellow-100',
                          module.level === 'advanced' && 'bg-red-100'
                        )}
                      >
                        <Text
                          className={cn(
                            'text-xs font-semibold',
                            module.level === 'beginner' && 'text-green-700',
                            module.level === 'intermediate' && 'text-yellow-700',
                            module.level === 'advanced' && 'text-red-700'
                          )}
                        >
                          {module.level === 'beginner'
                            ? 'Básico'
                            : module.level === 'intermediate'
                            ? 'Intermedio'
                            : 'Avanzado'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600 mb-3">{module.description}</Text>
                    <Progress value={module.progress} barClassName="bg-blue-500" />
                    <Text className="text-xs text-gray-600 mt-2">
                      {module.progress}% completado
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-end">
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Tip de aprendizaje */}
        <View className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
          <View className="flex-row items-start gap-3">
            <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center">
              <Text className="text-2xl">💡</Text>
            </View>
            <View className="flex-1">
              <Text className="text-amber-900 font-semibold text-lg mb-2">Tip de aprendizaje</Text>
              <Text className="text-sm text-amber-800">
                {learningTips[Math.floor(Math.random() * learningTips.length)]}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
