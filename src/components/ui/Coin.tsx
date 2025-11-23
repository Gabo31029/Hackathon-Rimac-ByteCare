import React from 'react';
import { View, Text } from 'react-native';

interface CoinProps {
  type: 'rimac' | 'bone';
  size?: number;
}

export function Coin({ type, size = 24 }: CoinProps) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFD700', // Oro
        borderWidth: 2,
        borderColor: '#FFA500', // Borde dorado más oscuro
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {type === 'rimac' ? (
        <Text
          style={{
            fontSize: size * 0.5,
            fontWeight: 'bold',
            color: '#B8860B', // Dorado oscuro para el texto
          }}
        >
          R
        </Text>
      ) : (
        <Text
          style={{
            fontSize: size * 0.5,
            color: '#B8860B',
          }}
        >
          🦴
        </Text>
      )}
    </View>
  );
}

