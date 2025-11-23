import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';

interface AnimatedPetProps {
  happiness: number;
  hunger: number;
  equippedAccessory?: string | null;
  showReaction?: 'feed' | 'play' | 'accessory' | null;
  onReactionComplete?: () => void;
}

export function AnimatedPet({
  happiness,
  hunger,
  equippedAccessory,
  showReaction,
  onReactionComplete,
}: AnimatedPetProps) {
  // Animaciones base (respiración, movimiento suave)
  const breathing = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const bodyBounce = useSharedValue(0);
  const headTilt = useSharedValue(0);
  
  // Animaciones de reacción
  const reactionScale = useSharedValue(1);
  const reactionRotation = useSharedValue(0);
  const barkAnimation = useSharedValue(0);
  const happyJump = useSharedValue(0);

  // Animación de respiración continua
  useEffect(() => {
    breathing.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Animación de cola (más activa cuando está feliz)
  useEffect(() => {
    const wagSpeed = happiness > 70 ? 300 : happiness > 40 ? 500 : 800;
    tailWag.value = withRepeat(
      withSequence(
        withTiming(1, { duration: wagSpeed, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: wagSpeed, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [happiness]);

  // Movimiento suave del cuerpo
  useEffect(() => {
    bodyBounce.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Inclinación ocasional de la cabeza
  useEffect(() => {
    const tiltInterval = setInterval(() => {
      headTilt.value = withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 }),
        withTiming(-1, { duration: 500 }),
        withTiming(0, { duration: 500 })
      );
    }, 5000);
    return () => clearInterval(tiltInterval);
  }, []);

  // Reacciones a acciones
  useEffect(() => {
    if (showReaction === 'feed') {
      // Reacción al alimentar: salto de felicidad
      happyJump.value = withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) }),
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );
      reactionScale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      setTimeout(() => {
        if (onReactionComplete) onReactionComplete();
      }, 1000);
    } else if (showReaction === 'play') {
      // Reacción al jugar: giro y salto
      reactionRotation.value = withSequence(
        withTiming(360, { duration: 600, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 0 })
      );
      happyJump.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 200 }),
        withTiming(0.7, { duration: 200 }),
        withTiming(0, { duration: 200 })
      );
      setTimeout(() => {
        if (onReactionComplete) onReactionComplete();
      }, 1200);
    } else if (showReaction === 'accessory') {
      // Reacción al equipar accesorio: ladrido y salto
      barkAnimation.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      reactionScale.value = withSequence(
        withTiming(1.15, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      happyJump.value = withSequence(
        withTiming(0.8, { duration: 250 }),
        withTiming(0, { duration: 250 })
      );
      setTimeout(() => {
        if (onReactionComplete) onReactionComplete();
      }, 1000);
    }
  }, [showReaction]);

  // Estilos animados
  const bodyStyle = useAnimatedStyle(() => {
    const scale = 1 + breathing.value * 0.02;
    const translateY = interpolate(bodyBounce.value, [0, 1], [0, -3]);
    const jumpY = interpolate(happyJump.value, [0, 1], [0, -30]);
    const scaleReaction = reactionScale.value;
    
    return {
      transform: [
        { scale: scale * scaleReaction },
        { translateY: translateY + jumpY },
        { rotate: `${reactionRotation.value}deg` },
      ],
    };
  });

  const headStyle = useAnimatedStyle(() => {
    const tilt = interpolate(headTilt.value, [-1, 1], [-8, 8]);
    return {
      transform: [{ rotate: `${tilt}deg` }],
    };
  });

  const tailStyle = useAnimatedStyle(() => {
    const wag = interpolate(tailWag.value, [0, 1], [-25, 25]);
    return {
      transform: [{ rotate: `${wag}deg` }],
    };
  });

  const barkStyle = useAnimatedStyle(() => {
    const opacity = barkAnimation.value;
    return {
      opacity,
    };
  });

  // Determinar emoji según estado
  const getEmoji = () => {
    if (happiness >= 80) return '😄';
    if (happiness >= 60) return '😊';
    if (happiness >= 40) return '🙂';
    return '😕';
  };

  return (
    <View className="items-center justify-center relative" style={{ width: 180, height: 180 }}>
      {/* Perro animado */}
      <Animated.View style={[bodyStyle, { position: 'relative', alignItems: 'center', justifyContent: 'center' }]}>
        <View className="items-center justify-center relative" style={{ width: 140, height: 140 }}>
          {/* Cuerpo del perro */}
          <View className="relative" style={{ width: 140, height: 140 }}>
            {/* Cuerpo principal (perro golden retriever) */}
            <View
              style={{
                position: 'absolute',
                top: 40,
                left: 20,
                width: 100,
                height: 80,
                backgroundColor: '#F4D03F',
                borderRadius: 50,
                borderWidth: 2,
                borderColor: '#D4A574',
              }}
            />

            {/* Camiseta RIMAC */}
            <View
              style={{
                position: 'absolute',
                top: 50,
                left: 25,
                width: 90,
                height: 45,
                backgroundColor: '#EC0000',
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 'bold',
                  letterSpacing: 1.5,
                }}
              >
                RIMAC
              </Text>
            </View>

            {/* Cabeza */}
            <Animated.View style={[headStyle, { position: 'absolute', top: 0, left: 35 }]}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: '#F4D03F',
                  borderRadius: 35,
                  borderWidth: 2,
                  borderColor: '#D4A574',
                }}
              />
              {/* Ojos */}
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 18,
                  width: 10,
                  height: 10,
                  backgroundColor: '#000000',
                  borderRadius: 5,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 18,
                  width: 10,
                  height: 10,
                  backgroundColor: '#000000',
                  borderRadius: 5,
                }}
              />
              {/* Nariz */}
              <View
                style={{
                  position: 'absolute',
                  top: 32,
                  left: 30,
                  width: 10,
                  height: 8,
                  backgroundColor: '#000000',
                  borderRadius: 5,
                }}
              />
              {/* Boca sonriente */}
              <View
                style={{
                  position: 'absolute',
                  top: 40,
                  left: 22,
                  width: 26,
                  height: 14,
                  borderBottomWidth: 3,
                  borderLeftWidth: 3,
                  borderRightWidth: 3,
                  borderColor: '#000000',
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                }}
              />
              {/* Mejillas rosadas */}
              <View
                style={{
                  position: 'absolute',
                  top: 25,
                  left: 5,
                  width: 14,
                  height: 14,
                  backgroundColor: '#FFB6C1',
                  borderRadius: 7,
                  opacity: 0.7,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 25,
                  right: 5,
                  width: 14,
                  height: 14,
                  backgroundColor: '#FFB6C1',
                  borderRadius: 7,
                  opacity: 0.7,
                }}
              />
            </Animated.View>

            {/* Orejas */}
            <View
              style={{
                position: 'absolute',
                top: 8,
                left: 20,
                width: 30,
                height: 35,
                backgroundColor: '#D4A574',
                borderRadius: 18,
                transform: [{ rotate: '-25deg' }],
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 20,
                width: 30,
                height: 35,
                backgroundColor: '#D4A574',
                borderRadius: 18,
                transform: [{ rotate: '25deg' }],
              }}
            />

            {/* Cola animada */}
            <Animated.View
              style={[
                tailStyle,
                {
                  position: 'absolute',
                  bottom: 30,
                  right: -12,
                  width: 18,
                  height: 45,
                  backgroundColor: '#F4D03F',
                  borderRadius: 9,
                  borderWidth: 2,
                  borderColor: '#D4A574',
                  transformOrigin: 'top center',
                },
              ]}
            />

            {/* Patas delanteras */}
            <View
              style={{
                position: 'absolute',
                bottom: -12,
                left: 30,
                width: 18,
                height: 28,
                backgroundColor: '#F4D03F',
                borderRadius: 9,
                borderWidth: 2,
                borderColor: '#D4A574',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -12,
                right: 30,
                width: 18,
                height: 28,
                backgroundColor: '#F4D03F',
                borderRadius: 9,
                borderWidth: 2,
                borderColor: '#D4A574',
              }}
            />
          </View>

          {/* Accesorio equipado */}
          {equippedAccessory && (
            <View
              style={{
                position: 'absolute',
                top: -8,
                left: 55,
                zIndex: 10,
              }}
            >
              <Text style={{ fontSize: 36 }}>{equippedAccessory}</Text>
            </View>
          )}

          {/* Efecto de ladrido */}
          <Animated.View
            style={[
              barkStyle,
              {
                position: 'absolute',
                top: -25,
                left: 60,
                zIndex: 15,
              },
            ]}
          >
            <Text style={{ fontSize: 28 }}>💬</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Emoji de estado */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 28 }}>{getEmoji()}</Text>
      </View>
    </View>
  );
}

