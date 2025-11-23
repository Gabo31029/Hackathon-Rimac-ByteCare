import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import './global.css';
import { HomeScreen } from './src/components/HomeScreen';
import { CheckInDaily } from './src/components/CheckInDaily';
import { HealthDashboard } from './src/components/HealthDashboard';
import { DigitalPet } from './src/components/DigitalPet';
import { SupportNetwork } from './src/components/SupportNetwork';
import { EducationModule } from './src/components/EducationModule';
import { RewardsSystem } from './src/components/RewardsSystem';
import { BottomNavigation } from './src/components/BottomNavigation';

interface FoodRecommendation {
  id: string;
  commonFood: string;
  swapFor: string;
  reason: string;
  portion: string;
  glycemicLoad: 'baja' | 'media';
}

interface SharedFoodRecommendation extends FoodRecommendation {
  sentAt: string;
  sentTo: string[];
}

type Screen = 'home' | 'checkin' | 'health' | 'pet' | 'support' | 'education' | 'rewards';

function AppContent() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [healthInitialTab, setHealthInitialTab] = useState<'overview' | 'challenges' | 'medication' | undefined>(undefined);
  const [hasCompletedCheckIn, setHasCompletedCheckIn] = useState(false);
  const [boneCoins, setBoneCoins] = useState(145);
  const [rimacCoins, setRimacCoins] = useState(28);
  const [streak, setStreak] = useState(7);
  const [completedLessons, setCompletedLessons] = useState(3); // Lecciones iniciales completadas
  const [sharedFoodTips, setSharedFoodTips] = useState<SharedFoodRecommendation[]>([]);
  const supportRecipients = ['Carlos Fernandez', 'Ana Fernandez'];

  const handleCompleteCheckIn = (coins: number) => {
    setHasCompletedCheckIn(true);
    setBoneCoins(prev => prev + coins);
    setStreak(prev => prev + 1);
    setCurrentScreen('home');
  };

  const handleEarnCoins = (bone: number, rimac: number) => {
    setBoneCoins(prev => prev + bone);
    setRimacCoins(prev => prev + rimac);
  };

  const handleNavigate = (screen: string, healthTab?: 'overview' | 'challenges' | 'medication') => {
    if (screen === 'health' && healthTab) {
      setHealthInitialTab(healthTab);
    } else {
      setHealthInitialTab(undefined);
    }
    setCurrentScreen(screen as Screen);
  };

  const handleShareFoodTips = (tips: FoodRecommendation[]) => {
    const sentAt = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    setSharedFoodTips(prev => {
      const updated = [...prev];

      tips.forEach((tip) => {
        const existingIndex = updated.findIndex(item => item.id === tip.id);
        const entry: SharedFoodRecommendation = {
          ...tip,
          sentAt,
          sentTo: supportRecipients,
        };

        if (existingIndex >= 0) {
          updated[existingIndex] = entry;
        } else {
          updated.push(entry);
        }
      });

      return updated;
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            hasCompletedCheckIn={hasCompletedCheckIn}
            boneCoins={boneCoins}
            rimacCoins={rimacCoins}
            streak={streak}
            onStartCheckIn={() => setCurrentScreen('checkin')}
            onNavigate={handleNavigate}
          />
        );
      case 'checkin':
        return (
          <CheckInDaily
            onComplete={handleCompleteCheckIn}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'health':
        return (
          <HealthDashboard
            onBack={() => setCurrentScreen('home')}
            onEarnCoins={handleEarnCoins}
            initialTab={healthInitialTab}
            onShareFoodTips={handleShareFoodTips}
            sharedFoodTips={sharedFoodTips}
          />
        );
      case 'pet':
        return (
          <DigitalPet
            boneCoins={boneCoins}
            onSpendCoins={(amount) => setBoneCoins(prev => prev - amount)}
            onBack={() => setCurrentScreen('home')}
            onEarnRimacCoins={(amount) => setRimacCoins(prev => prev + amount)}
            completedLessons={completedLessons}
          />
        );
      case 'support':
        return (
          <SupportNetwork
            onBack={() => setCurrentScreen('home')}
            onEarnCoins={handleEarnCoins}
            sharedFoodTips={sharedFoodTips}
          />
        );
      case 'education':
        return (
          <EducationModule
            onBack={() => setCurrentScreen('home')}
            onEarnCoins={(bone, rimac) => {
              handleEarnCoins(bone, rimac);
              // Incrementar contador de lecciones cuando se completa una
              if (bone > 0) {
                setCompletedLessons(prev => prev + 1);
              }
            }}
          />
        );
      case 'rewards':
        return (
          <RewardsSystem
            rimacCoins={rimacCoins}
            onSpendCoins={(amount) => setRimacCoins(prev => prev - amount)}
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  // Mostrar navegación en todas las vistas principales, no en vistas secundarias
  const showNavigation = ['home', 'health', 'support', 'education', 'rewards'].includes(currentScreen);

  // Determinar el color del status bar según la pantalla
  const getStatusBarColor = () => {
    switch (currentScreen) {
      case 'home':
        return { style: 'light' as const, backgroundColor: '#EC0000' };
      case 'pet':
        return { style: 'light' as const, backgroundColor: '#9333EA' };
      case 'health':
      case 'support':
      case 'rewards':
      case 'education':
        return { style: 'light' as const, backgroundColor: '#EC0000' };
      default:
        return { style: 'auto' as const, backgroundColor: '#FFFFFF' };
    }
  };

  const statusBarConfig = getStatusBarColor();

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: statusBarConfig.backgroundColor }}
      edges={['top']}
    >
      <StatusBar style={statusBarConfig.style} backgroundColor={statusBarConfig.backgroundColor} />
      <View className="flex-1 bg-white">
        {/* Top bar with Rimac branding */}
        {currentScreen === 'home' && (
          <View className="bg-rimac px-4 pb-6" style={{ paddingTop: Math.max(insets.top - 10, 8) }}>
            <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'System', letterSpacing: 1 }}>
              RIMAC
            </Text>
          </View>
        )}

        {/* Main content */}
        <View className="flex-1">
          {renderScreen()}
        </View>

        {/* Bottom navigation */}
        {showNavigation && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            bottomInset={insets.bottom}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
