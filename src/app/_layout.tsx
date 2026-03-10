import AuthGuard from "@/components/ui/auth-guard";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AuthGuard>
          <Stack />
        </AuthGuard>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
