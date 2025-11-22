# Diabetes Care - React Native App

Aplicación móvil de cuidado de diabetes convertida de React Web a React Native con Expo v54 y Tailwind CSS (NativeWind).

## 🚀 Características

- ✅ Expo SDK 54
- ✅ React Native con TypeScript
- ✅ NativeWind (Tailwind CSS para React Native)
- ✅ Navegación entre pantallas
- ✅ Componentes UI adaptados para móvil
- ✅ Sistema de monedas y recompensas
- ✅ Check-in diario
- ✅ Dashboard de salud
- ✅ Mascota digital
- ✅ Red de apoyo
- ✅ Módulos educativos
- ✅ Sistema de premios

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. **IMPORTANTE**: Para que los estilos de Tailwind funcionen, debes limpiar la caché y reiniciar:
```bash
npm start -- --clear
```

O si prefieres hacerlo manualmente:
```bash
# Detén el servidor (Ctrl+C)
# Luego ejecuta:
npx expo start --clear
```

3. Escanea el código QR con la app Expo Go (iOS/Android) o presiona:
   - `a` para Android
   - `i` para iOS
   - `w` para web

## ⚠️ Solución de Problemas

### Los estilos no aparecen

Si los estilos de Tailwind no aparecen:

1. **Limpia la caché de Metro**:
   ```bash
   npx expo start --clear
   ```

2. **Limpia la caché de npm** (si es necesario):
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Verifica que `global.css` esté importado** en `App.tsx`:
   ```tsx
   import './global.css';
   ```

4. **Verifica la configuración**:
   - `metro.config.js` debe usar `withNativeWind`
   - `babel.config.js` debe tener `nativewind/babel` en plugins
   - `tailwind.config.js` debe tener el preset de NativeWind

## 🏗️ Estructura del Proyecto

```
diabetes-care-rn/
├── src/
│   ├── components/
│   │   ├── ui/          # Componentes UI reutilizables
│   │   ├── HomeScreen.tsx
│   │   ├── CheckInDaily.tsx
│   │   ├── HealthDashboard.tsx
│   │   ├── DigitalPet.tsx
│   │   ├── SupportNetwork.tsx
│   │   ├── EducationModule.tsx
│   │   ├── RewardsSystem.tsx
│   │   └── BottomNavigation.tsx
│   └── utils/
│       └── cn.ts        # Utilidad para className
├── App.tsx              # Componente principal
├── index.ts             # Punto de entrada
├── global.css           # Estilos globales de Tailwind
├── metro.config.js      # Configuración de Metro con NativeWind
├── tailwind.config.js   # Configuración de Tailwind
└── babel.config.js       # Configuración de Babel con NativeWind
```

## 🎨 Estilos

La aplicación usa NativeWind (Tailwind CSS para React Native). Puedes usar todas las clases de Tailwind CSS directamente en los componentes:

```tsx
<View className="bg-rimac p-4 rounded-xl">
  <Text className="text-white font-semibold">Hola</Text>
</View>
```

## 📱 Pantallas

- **HomeScreen**: Pantalla principal con resumen y acceso rápido
- **CheckInDaily**: Check-in diario con preguntas rápidas
- **HealthDashboard**: Dashboard de salud con métricas y retos
- **DigitalPet**: Mascota digital interactiva
- **SupportNetwork**: Red de apoyo familiar y profesional
- **EducationModule**: Módulos educativos sobre diabetes
- **RewardsSystem**: Sistema de premios y recompensas

## 🛠️ Tecnologías

- Expo SDK 54
- React Native 0.81.5
- TypeScript
- NativeWind (Tailwind CSS)
- @expo/vector-icons
- React Navigation

## 📝 Notas

- Los componentes han sido adaptados de React Web a React Native
- Se reemplazaron los iconos de `lucide-react` por `@expo/vector-icons`
- Los componentes HTML (`div`, `button`, etc.) fueron reemplazados por componentes de React Native (`View`, `TouchableOpacity`, `Text`, etc.)
- Los estilos se mantienen usando Tailwind CSS a través de NativeWind

## 🚧 Próximos Pasos

- [ ] Agregar animaciones con react-native-reanimated
- [ ] Implementar persistencia de datos
- [ ] Agregar notificaciones push
- [ ] Integrar con APIs backend
- [ ] Agregar más componentes UI
- [ ] Mejorar la experiencia de usuario

## 📄 Licencia

Este proyecto fue convertido de un proyecto React Web a React Native.
