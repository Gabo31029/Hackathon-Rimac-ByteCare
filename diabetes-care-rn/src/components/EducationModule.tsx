import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
      { id: 1, title: '¿Qué es la diabetes tipo 2?', duration: '5 min', completed: true, type: 'video', points: 5 },
      { id: 2, title: 'Cómo funciona la insulina', duration: '4 min', completed: true, type: 'article', points: 5 },
      { id: 3, title: 'Síntomas de hipo e hiperglucemia', duration: '6 min', completed: true, type: 'video', points: 5 },
      { id: 4, title: 'Quiz: Fundamentos', duration: '3 min', completed: false, type: 'quiz', points: 10 },
    ],
  },
  {
    id: 2,
    title: 'Nutrición inteligente',
    description: 'Aprende a comer sin elevar tu glucosa',
    level: 'intermediate',
    progress: 40,
    lessons: [
      { id: 5, title: 'Cómo leer una etiqueta nutricional', duration: '7 min', completed: true, type: 'video', points: 5 },
      { id: 6, title: 'Índice glucémico explicado', duration: '5 min', completed: true, type: 'article', points: 5 },
      { id: 7, title: 'Comer fuera de casa sin riesgos', duration: '8 min', completed: false, type: 'video', points: 5 },
      { id: 8, title: 'Porciones adecuadas', duration: '6 min', completed: false, type: 'article', points: 5 },
    ],
  },
];

export function EducationModule({ onBack, onEarnCoins }: EducationModuleProps) {
  const insets = useSafeAreaInsets();
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

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
            progress: Math.round((completedCount / updatedLessons.length) * 100)
          };
          setSelectedModule(updatedModule);
          return updatedModule;
        }
        return m;
      });
      setModules(updatedModules);
    }
  };

  if (selectedModule) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-rimac p-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setSelectedModule(null)}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">{selectedModule.title}</Text>
            <View className="w-6" />
          </View>
        </View>

        <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Progress value={selectedModule.progress} />
            <Text className="text-sm text-gray-600 mt-2">
              {selectedModule.progress}% completado
            </Text>
          </View>

          <View className="gap-3">
            {selectedModule.lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardContent>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                        {lesson.type === 'video' && <Ionicons name="play-circle" size={20} color="#2563EB" />}
                        {lesson.type === 'article' && <Ionicons name="document-text" size={20} color="#2563EB" />}
                        {lesson.type === 'quiz' && <Ionicons name="help-circle" size={20} color="#2563EB" />}
                      </View>
                      <View className="flex-1">
                        <Text
                          className={cn(
                            'font-semibold',
                            lesson.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                          )}
                        >
                          {lesson.title}
                        </Text>
                        <Text className="text-sm text-gray-600">{lesson.duration}</Text>
                      </View>
                    </View>
                    {lesson.completed ? (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleCompleteLesson(lesson)}
                        activeOpacity={0.8}
                        className="bg-rimac px-4 py-2 rounded-lg"
                      >
                        <Text className="text-white text-sm font-semibold">Comenzar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-rimac p-4 pt-12">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Aprendo y Mejoro</Text>
          <View className="w-6" />
        </View>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardContent>
                <TouchableOpacity onPress={() => setSelectedModule(module)}>
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-900 font-semibold text-lg">{module.title}</Text>
                      <View className={cn(
                        'px-2 py-1 rounded-full',
                        module.level === 'beginner' && 'bg-green-100',
                        module.level === 'intermediate' && 'bg-yellow-100',
                        module.level === 'advanced' && 'bg-red-100'
                      )}>
                        <Text className={cn(
                          'text-xs font-semibold',
                          module.level === 'beginner' && 'text-green-700',
                          module.level === 'intermediate' && 'text-yellow-700',
                          module.level === 'advanced' && 'text-red-700'
                        )}>
                          {module.level === 'beginner' ? 'Básico' : module.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-600 mb-3">{module.description}</Text>
                    <Progress value={module.progress} />
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
      </ScrollView>
    </View>
  );
}

