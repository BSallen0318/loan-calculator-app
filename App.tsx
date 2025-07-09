import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LTVResult, DSRResult } from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import LTVCalculator from './src/components/LTVCalculator';
import DSRCalculator from './src/components/DSRCalculator';
import ResultScreen from './src/components/ResultScreen';

type Screen = 'home' | 'ltv' | 'dsr' | 'result';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [ltvResult, setLtvResult] = useState<LTVResult | undefined>();
  const [dsrResult, setDsrResult] = useState<DSRResult | undefined>();

  const navigateToHome = () => {
    setCurrentScreen('home');
    setLtvResult(undefined);
    setDsrResult(undefined);
  };

  const navigateToLTV = () => {
    setCurrentScreen('ltv');
  };

  const navigateToDSR = () => {
    setCurrentScreen('dsr');
  };

  const navigateToResult = () => {
    setCurrentScreen('result');
  };

  const handleLTVCalculate = (result: LTVResult) => {
    setLtvResult(result);
    navigateToResult();
  };

  const handleDSRCalculate = (result: DSRResult) => {
    setDsrResult(result);
    navigateToResult();
  };

  const handleRecalculate = () => {
    if (dsrResult) {
      navigateToDSR();
    } else if (ltvResult) {
      navigateToLTV();
    } else {
      navigateToHome();
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToLTV={navigateToLTV}
            onNavigateToDSR={navigateToDSR}
          />
        );
      case 'ltv':
        return (
          <LTVCalculator
            onCalculate={handleLTVCalculate}
          />
        );
      case 'dsr':
        return (
          <DSRCalculator
            ltvResult={ltvResult}
            onCalculate={handleDSRCalculate}
          />
        );
      case 'result':
        return (
          <ResultScreen
            ltvResult={ltvResult}
            dsrResult={dsrResult}
            onBack={navigateToHome}
            onRecalculate={handleRecalculate}
          />
        );
      default:
        return (
          <HomeScreen
            onNavigateToLTV={navigateToLTV}
            onNavigateToDSR={navigateToDSR}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}
