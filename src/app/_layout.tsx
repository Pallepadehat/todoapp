import AuthGuard from "@/components/auth-guard";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthGuard>
        <Stack />
      </AuthGuard>
    </GestureHandlerRootView>
  );
}
