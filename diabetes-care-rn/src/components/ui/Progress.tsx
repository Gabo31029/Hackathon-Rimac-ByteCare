import React from 'react';
import { View } from 'react-native';
import { cn } from '../../utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({ value, max = 100, className, barClassName }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View className={cn('h-2 bg-gray-200 rounded-full overflow-hidden', className)}>
      <View
        className={cn('h-full bg-rimac', barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}

