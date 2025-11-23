# Diabetes Care (React Native + Expo)

Aplicacion movil creada con Expo 54 y React Native 0.81 pensada para acompanhar a personas con diabetes tipo 1 o 2. Incluye check-in diario, panel de metricas, sistema de recompensas Rimac/Bone Coins, mascota digital y modulos educativos adaptados desde la version web original.

## Caracteristicas destacadas
- Experiencia 100 % movil escrita en TypeScript y preparada para Expo Go.
- Flujo central de check-in guiado que registra energia, glucosa, estado animico y rutina.
- Dashboard de salud con metricas, retos, adherencia a medicacion y seguimiento de habitos.
- Sistema de monedas dual (Bone y Rimac) que incentiva habitos saludables y canjea premios.
- Mascota virtual "Pancho" que responde al cuidado y consumo de monedas y ahora permite personalizar accesorios.
- Red de apoyo (familia/equipo medico) y micro-lecciones de educacion en diabetes.
- Estilos construidos con NativeWind (Tailwind CSS para RN) y componentes reutilizables (Button, Card, Progress).

## Stack tecnologico
- Expo SDK 54 y bundler Metro con soporte NativeWind.
- React Native 0.81 + React 19 + TypeScript ~5.9.
- React Navigation (bottom-tabs) y Safe Area Context para manejar areas seguras.
- NativeWind, Tailwind CSS y tailwind-merge para componer estilos responsivos.
- @expo/vector-icons, react-native-gesture-handler, reanimated, screens y safe-area-context.

## Requisitos previos
1. Node.js 20.x (definido en `package.json > engines`).
2. npm 10+ o pnpm/yarn equivalente.
3. Expo CLI (opcional si usas `npx expo`).
4. App Expo Go instalada en el dispositivo fisico o en emuladores Android Studio / Xcode.

## Instalacion y ejecucion
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Limpia la cache de Metro cuando vengas de la version web o actualices estilos:
   ```bash
   npm start -- --clear
   # o
   npx expo start --clear
   ```
3. Una vez arranque Metro, selecciona:
   - `a` para emulador/dispositivo Android.
   - `i` para iOS Simulator.
   - `w` para vista web (limitada, preferible movil).
   - Tambien puedes escanear el QR desde Expo Go.

## Scripts disponibles
- `npm start`: lanza Metro Bundler.
- `npm run android`: abre Expo en emulador o dispositivo Android conectado.
- `npm run ios`: abre Expo en iOS Simulator (macOS requerido).
- `npm run web`: abre la version experimental web.

## Arquitectura y carpetas
```
diabetes-care-rn/
|-- App.tsx             # Navegacion manual entre pantallas y estado global
|-- global.css          # Directivas Tailwind para NativeWind
|-- src/
|   |-- components/
|   |   |-- HomeScreen.tsx
|   |   |-- CheckInDaily.tsx
|   |   |-- HealthDashboard.tsx
|   |   |-- DigitalPet.tsx
|   |   |-- SupportNetwork.tsx
|   |   |-- EducationModule.tsx
|   |   |-- RewardsSystem.tsx
|   |   |-- BottomNavigation.tsx
|   |   `-- ui/         # Button, Card, Progress reutilizables
|   `-- utils/cn.ts     # Helper para concatenar clases Tailwind
|-- app.json            # Configuracion Expo
|-- metro.config.js     # Integracion con NativeWind
|-- tailwind.config.js  # Fuente de clases disponibles
`-- nativewind-env.d.ts # Tipos generados por NativeWind
```

## Flujos principales
- **HomeScreen**: dashboard diario que muestra progreso, check-in, acceso a mascota, modulos de salud, glicemia y accesos rapidos.
- **CheckInDaily**: cuestionario de 4 pasos con barra de progreso que recompensa con 10 Bone Coins y actualiza la racha.
- **HealthDashboard**: metricas detalladas, graficos, retos diarios, adherencia a medicacion y habitos (ganancia de Bone/Rimac Coins).
- **DigitalPet**: mascota Pancho con stats de felicidad/energia; permite gastar Bone Coins en actividades, comprar accesorios y equiparlos para personalizar su estilo.
- **SupportNetwork**: contactos de apoyo, chat rapido, recordatorios y eventos compartidos.
- **EducationModule**: cursos cortos, trivias y contenido educativo con recompensas.
- **RewardsSystem**: catalogo de premios Rimac, filtros y flujo para canjear Rimac Coins.
- **BottomNavigation**: navegacion principal para modulos clave cuando `currentScreen === 'home'`.

## Estilos y configuracion tecnica
- Importa `global.css` en `App.tsx` para habilitar Tailwind en toda la app.
- `babel.config.js` habilita `nativewind/babel` y ajusta `jsxImportSource` requerido.
- `metro.config.js` usa `withNativeWind` apuntando a `global.css`.
- `tailwind.config.js` extiende el tema con el color corporativo `rimac` y escanea `App.tsx` + `src/**/*` para generar las clases.

## Consejos de solucion de problemas
- **Estilos que no aparecen**: ejecuta `npx expo start --clear` para limpiar la cache de Metro.
- **Errores de paquetes nativos**: elimina `node_modules` y `package-lock.json`, luego vuelve a `npm install`.
- **Problemas con NativeWind**: verifica que `global.css` este importado, que el archivo `nativewind-env.d.ts` exista y que no se edite.
- **Runtime en iOS/Android**: recuerda instalar pods solo si haces un build nativo (`npx pod-install ios`). Para Expo Go no es necesario.

## Proximos pasos sugeridos
- Persistir la informacion (AsyncStorage o backend) para que check-ins, monedas y progresos sobrevivan reinicios.
- Anhadir notificaciones push y recordatorios inteligentes.
- Conectar metricas reales mediante APIs o integraciones con dispositivos medicos.
- Animaciones con Reanimated para mejorar transiciones e interacciones.
- Tests unitarios/visual regression para componentes criticos.
