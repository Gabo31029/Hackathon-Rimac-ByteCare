import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import './global.css';
import { HomeScreen } from './src/components/HomeScreen';
import { CheckInDaily } from './src/components/CheckInDaily';
import { HealthDashboard } from './src/components/HealthDashboard';
import { DigitalPet } from './src/components/DigitalPet';
import { SupportNetwork } from './src/components/SupportNetwork';
import { EducationModule } from './src/components/EducationModule';
import { RewardsSystem } from './src/components/RewardsSystem';
import { BottomNavigation } from './src/components/BottomNavigation';

type Screen = 'home' | 'checkin' | 'health' | 'pet' | 'support' | 'education' | 'rewards';

const { width } = Dimensions.get('window');

function AppContent() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [hasCompletedCheckIn, setHasCompletedCheckIn] = useState(false);
  const [boneCoins, setBoneCoins] = useState(145);
  const [rimacCoins, setRimacCoins] = useState(28);
  const [streak, setStreak] = useState(7);

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

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
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
          />
        );
      case 'pet':
        return (
          <DigitalPet
            boneCoins={boneCoins}
            onSpendCoins={(amount) => setBoneCoins(prev => prev - amount)}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'support':
        return (
          <SupportNetwork
            onBack={() => setCurrentScreen('home')}
            onEarnCoins={handleEarnCoins}
          />
        );
      case 'education':
        return (
          <EducationModule
            onBack={() => setCurrentScreen('home')}
            onEarnCoins={handleEarnCoins}
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

  const showNavigation = currentScreen === 'home';

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar style="auto" />
      <View className="flex-1 bg-white">
        {/* Top bar with Rimac branding */}
        {currentScreen === 'home' && (
          <View className="bg-rimac px-4 pt-2 pb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Text className="text-rimac text-sm font-bold">R</Text>
                </View>
                <Text className="text-white text-base font-semibold">Rimac Seguros</Text>
              </View>
            </View>
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
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
