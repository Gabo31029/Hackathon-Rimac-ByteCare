import React, { useEffect, useRef } from 'react';
import { View, Text, Animated as RNAnimated, Image } from 'react-native';

interface AnimatedPetFallbackProps {
  happiness: number;
  hunger: number;
  equippedAccessory?: string | null;
  showReaction?: 'feed' | 'play' | 'accessory' | null;
  onReactionComplete?: () => void;
}

export function AnimatedPetFallback({
  happiness,
  hunger,
  equippedAccessory,
  showReaction,
  onReactionComplete,
}: AnimatedPetFallbackProps) {
  // Animaciones usando Animated API nativo
  const breathingAnim = useRef(new RNAnimated.Value(0)).current;
  const tailWagAnim = useRef(new RNAnimated.Value(0)).current;
  const bodyBounceAnim = useRef(new RNAnimated.Value(0)).current;
  const reactionScale = useRef(new RNAnimated.Value(1)).current;
  const reactionRotation = useRef(new RNAnimated.Value(0)).current;
  const happyJump = useRef(new RNAnimated.Value(0)).current;
  const barkOpacity = useRef(new RNAnimated.Value(0)).current;

  // Animación de respiración continua
  useEffect(() => {
    const breathingAnimation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(breathingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(breathingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();
    return () => breathingAnimation.stop();
  }, []);

  // Animación de cola (más rápida cuando está feliz)
  useEffect(() => {
    const wagSpeed = happiness > 70 ? 300 : happiness > 40 ? 500 : 800;
    const tailAnimation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(tailWagAnim, {
          toValue: 1,
          duration: wagSpeed,
          useNativeDriver: true,
        }),
        RNAnimated.timing(tailWagAnim, {
          toValue: 0,
          duration: wagSpeed,
          useNativeDriver: true,
        }),
      ])
    );
    tailAnimation.start();
    return () => tailAnimation.stop();
  }, [happiness]);

  // Movimiento suave del cuerpo
  useEffect(() => {
    const bounceAnimation = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(bodyBounceAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(bodyBounceAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();
    return () => bounceAnimation.stop();
  }, []);

  // Reacciones a acciones
  useEffect(() => {
    if (showReaction === 'feed') {
      RNAnimated.parallel([
        RNAnimated.sequence([
          RNAnimated.timing(happyJump, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.sequence([
          RNAnimated.timing(reactionScale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(reactionScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (onReactionComplete) onReactionComplete();
      });
    } else if (showReaction === 'play') {
      RNAnimated.parallel([
        RNAnimated.timing(reactionRotation, {
          toValue: 360,
          duration: 600,
          useNativeDriver: true,
        }),
        RNAnimated.sequence([
          RNAnimated.timing(happyJump, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        reactionRotation.setValue(0);
        if (onReactionComplete) onReactionComplete();
      });
    } else if (showReaction === 'accessory') {
      RNAnimated.parallel([
        RNAnimated.sequence([
          RNAnimated.timing(barkOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          RNAnimated.timing(barkOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          RNAnimated.timing(barkOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          RNAnimated.timing(barkOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.sequence([
          RNAnimated.timing(reactionScale, {
            toValue: 1.15,
            duration: 200,
            useNativeDriver: true,
          }),
          RNAnimated.timing(reactionScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        RNAnimated.sequence([
          RNAnimated.timing(happyJump, {
            toValue: 0.8,
            duration: 250,
            useNativeDriver: true,
          }),
          RNAnimated.timing(happyJump, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (onReactionComplete) onReactionComplete();
      });
    }
  }, [showReaction]);

  // Estilos animados - simplificados
  const bodyScale = breathingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const finalScale = reactionScale.interpolate({
    inputRange: [0.8, 1.2],
    outputRange: [0.8, 1.2],
  });

  const bodyTranslateY = bodyBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const jumpTranslateY = happyJump.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const tailRotation = tailWagAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-25deg', '25deg'],
  });

  const rotationDeg = reactionRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const getEmoji = () => {
    if (happiness >= 80) return '😄';
    if (happiness >= 60) return '😊';
    if (happiness >= 40) return '🙂';
    return '😕';
  };

  return (
    <View className="items-center justify-center relative" style={{ width: 200, height: 200 }}>
      {/* Perro animado con imagen */}
      <RNAnimated.View
        style={{
          transform: [
            { scale: finalScale },
            { translateY: jumpTranslateY },
            { rotate: rotationDeg },
          ],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RNAnimated.View
          style={{
            transform: [
              { scale: bodyScale },
              { translateY: bodyTranslateY },
            ],
            position: 'relative',
          }}
        >
          {/* Imagen del perro golden retriever - usando emoji grande */}
          <View style={{ position: 'relative', width: 160, height: 160, alignItems: 'center', justifyContent: 'center' }}>
            {/* Perro principal */}
            <Text style={{ fontSize: 140 }}>🐕</Text>
            
            {/* Camiseta RIMAC superpuesta */}
            <View
              style={{
                position: 'absolute',
                top: 75,
                left: 25,
                width: 110,
                height: 45,
                backgroundColor: '#EC0000',
                borderRadius: 8,
                borderWidth: 3,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 'bold',
                  letterSpacing: 2,
                }}
              >
                RIMAC
              </Text>
            </View>
          </View>

          {/* Accesorio equipado */}
          {equippedAccessory && (
            <View
              style={{
                position: 'absolute',
                top: -10,
                left: 60,
                zIndex: 15,
              }}
            >
              <Text style={{ fontSize: 50 }}>{equippedAccessory}</Text>
            </View>
          )}

          {/* Efecto de ladrido */}
          <RNAnimated.View
            style={{
              position: 'absolute',
              top: -40,
              left: 70,
              zIndex: 20,
              opacity: barkOpacity,
            }}
          >
            <Text style={{ fontSize: 40 }}>💬</Text>
          </RNAnimated.View>
        </RNAnimated.View>
      </RNAnimated.View>

      {/* Emoji de estado */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 32 }}>{getEmoji()}</Text>
      </View>
    </View>
  );
}
