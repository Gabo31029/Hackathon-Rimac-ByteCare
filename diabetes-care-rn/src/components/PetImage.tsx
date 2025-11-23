import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';

interface PetImageProps {
  size?: number;
  style?: any;
}

// Imagen del perro - Agrega la imagen en diabetes-care-rn/assets/pet-rimac.png
// Si la imagen no existe, se mostrará el emoji como fallback
let PET_IMAGE_SOURCE;
try {
  PET_IMAGE_SOURCE = require('../../assets/pet-rimac.png');
} catch {
  PET_IMAGE_SOURCE = null; // Usará emoji si no existe
}

export function PetImage({ size = 200, style }: PetImageProps) {
  const [imageError, setImageError] = useState(false);

  // Si no hay imagen o hay error, mostrar emoji
  if (!PET_IMAGE_SOURCE || imageError) {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <Text style={{ fontSize: size * 0.7 }}>🐕</Text>
      </View>
    );
  }

  return (
    <Image
      source={PET_IMAGE_SOURCE}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      onError={() => {
        setImageError(true);
      }}
    />
  );
}

