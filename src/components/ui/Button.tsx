import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from '../../utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const baseStyles = 'rounded-xl items-center justify-center';
  
  const variantStyles = {
    default: 'bg-rimac',
    outline: 'border-2 border-rimac bg-transparent',
    ghost: 'bg-transparent',
  };

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textVariantStyles = {
    default: 'text-white',
    outline: 'text-rimac',
    ghost: 'text-rimac',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' ? 'white' : '#EC0000'} />
      ) : (
        <Text className={cn('font-semibold', textVariantStyles[variant])}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

