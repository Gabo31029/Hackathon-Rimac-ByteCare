import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../utils/cn';
import { Progress } from './ui/Progress';

interface CheckInDailyProps {
  onComplete: (coins: number) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  emoji: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 'morning',
    question: '¿Cómo amaneciste hoy?',
    emoji: '🌅',
    options: ['Con energía', 'Normal', 'Un poco cansado', 'Muy cansado'],
  },
  {
    id: 'glucose',
    question: '¿Mediste tu glucosa hoy?',
    emoji: '🩸',
    options: ['Sí, está bien', 'Sí, está alta', 'Sí, está baja', 'Aún no'],
  },
  {
    id: 'energy',
    question: '¿Cómo está tu energía?',
    emoji: '⚡',
    options: ['Muy bien', 'Bien', 'Baja', 'Sin energía'],
  },
  {
    id: 'mood',
    question: '¿Cómo te sientes emocionalmente?',
    emoji: '💭',
    options: ['Tranquilo', 'Algo estresado', 'Ansioso', 'Frustrado'],
  },
];

export function CheckInDaily({ onComplete, onBack }: CheckInDailyProps) {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelectOption = (option: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 200);
    } else {
      // Check-in completado
      setTimeout(() => {
        onComplete(10); // 10 monedas por completar check-in
      }, 500);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4" style={{ paddingTop: Math.max(insets.top, 16) }}>
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">
            {currentStep + 1} de {questions.length}
          </Text>
        </View>
        {/* Progress bar */}
        <Progress value={progress} />
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Question card */}
        <View className="bg-white rounded-2xl p-6 mb-6 items-center">
          <Text className="text-6xl mb-4">{currentQuestion.emoji}</Text>
          <Text className="mb-2 text-gray-900 text-xl font-semibold text-center px-2">
            {currentQuestion.question}
          </Text>
          <Text className="text-sm text-gray-600 text-center px-2">
            Selecciona la opción que mejor describa tu situación
          </Text>
        </View>

        {/* Options */}
        <View className="gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelectOption(option)}
                activeOpacity={0.7}
                className={cn(
                  'w-full p-4 rounded-xl border-2 flex-row items-center justify-between',
                  isSelected
                    ? 'border-rimac bg-red-50'
                    : 'border-gray-200 bg-white'
                )}
              >
                <Text
                  className={cn(
                    'flex-1',
                    isSelected ? 'text-rimac font-semibold' : 'text-gray-900'
                  )}
                >
                  {option}
                </Text>
                {isSelected && (
                  <Ionicons name="chevron-forward" size={20} color="#EC0000" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tiempo estimado */}
        <View className="mt-8 items-center">
          <View className="flex-row items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full">
            <Text>⏱️</Text>
            <Text className="text-emerald-700 text-sm">
              Tiempo estimado: {(questions.length - currentStep) * 4} segundos
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

