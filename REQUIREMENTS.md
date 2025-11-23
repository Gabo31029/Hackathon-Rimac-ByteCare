# Requirements

Lista de requisitos minimos y dependencias necesarias para levantar diabetes-care-rn en un entorno local.

## 1. Herramientas del sistema
| Herramienta | Version recomendada | Notas |
|-------------|--------------------|-------|
| Node.js     | 20.x (LTS)         | Definido en package.json > engines. Evita versiones <20 o >=24. |
| npm         | 10.x               | Se instala junto a Node. Puedes usar pnpm/yarn si lo prefieres. |
| Expo CLI    | ^8 (opcional)      | Solo si quieres ejecutar expo directamente (`npm install -g expo-cli`). Con `npx expo` no es necesario global. |
| Git         | Ultima estable     | Para clonar y versionar. |
| Expo Go     | Ultima version App Store / Play Store | Permite visualizar la app en un dispositivo fisico. |
| Android Studio / Xcode | Ultima estable | Solo si usaras emuladores o builds nativos. |

Verifica versiones ejecutando `node -v` y `npm -v`.

## 2. Dependencias del proyecto
Todas se instalan automaticamente con:
```bash
npm install
```
Principales paquetes declarados en `package.json`:
- `expo@~54.0.25` y `react-native@0.81.5` (runtime base Expo).
- `react@19.1.0` y `typescript@~5.9.2`.
- Estilo con `nativewind`, `tailwindcss`, `tailwind-merge`.
- Navegacion: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler`, `react-native-reanimated`.
- UI: `@expo/vector-icons`.
- Configuracion: `@expo/metro-config`, `babel-preset-expo`.

Si necesitas reinstalar desde cero:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 3. Variables y archivos especiales
- `global.css` debe importarse desde `App.tsx` para habilitar NativeWind.
- `nativewind-env.d.ts` lo genera NativeWind (no editarlo).
- No se requieren variables de entorno (.env) para ejecutar la version actual.

## 4. Comandos utiles
```bash
npm start -- --clear   # Limpia cache de Metro + inicia Expo
npm run android        # Abre Expo en un emulador/dispositivo Android
npm run ios            # Abre Expo en iOS Simulator (macOS)
npm run web            # Vista web experimental
```

Con estos requisitos satisfechos podras instalar y correr el proyecto sin pasos adicionales.
