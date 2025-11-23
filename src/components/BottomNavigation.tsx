import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../utils/cn';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  bottomInset?: number;
}

export function BottomNavigation({ currentScreen, onNavigate, bottomInset = 0 }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: 'home' as const },
    { id: 'health', label: 'Salud', icon: 'heart' as const },
    { id: 'support', label: 'Red de Apoyo', icon: 'people' as const },
    { id: 'education', label: 'Aprendo', icon: 'book' as const },
    { id: 'rewards', label: 'Premios', icon: 'gift' as const },
  ];

  return (
    <View
      className="bg-white border-t border-gray-200 shadow-sm"
      style={{ paddingBottom: Math.max(bottomInset, 10) }}
    >
      <View className="flex-row items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onNavigate(tab.id as any)}
              className="flex-col items-center gap-1 py-2 px-4"
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? '#EC0000' : '#6B7280'}
              />
              <Text
                className={cn(
                  'text-xs',
                  isActive ? 'text-rimac' : 'text-gray-600'
                )}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
