import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated/lib/reanimated2/js-reanimated';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/lib/trpc';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="new-dream" 
              options={{ 
                presentation: 'modal',
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="dream/[id]" 
              options={{ 
                title: 'Dream Details',
                headerStyle: { backgroundColor: '#1a1a1a' },
                headerTintColor: '#ffffff',
              }} 
            />
            <Stack.Screen 
              name="analysis" 
              options={{ 
                title: 'Dream Analysis',
                headerStyle: { backgroundColor: '#1a1a1a' },
                headerTintColor: '#ffffff',
              }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}