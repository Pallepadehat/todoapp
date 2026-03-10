import TodolistScreen from "@/components/screens/todolist-screen";
import FloatingTodoInput from "@/components/ui/floating-todo-input";
import UserProfile from "@/components/ui/user-profile";
import db from "@/utils/db";
import { useThemeColor } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import { Platform, Pressable } from "react-native";

export default function Index() {
  const user = db.useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const colors = useThemeColor();

  return (
    <>
      {/* IOS */}
      {Platform.OS !== "ios" ? (
        <Stack.Screen
          options={{
            title: "Todos",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerRight: () => (
              <Pressable
                onPress={() => setProfileOpen(true)}
                hitSlop={10}
                style={{ paddingHorizontal: 16 }}
              >
                <Ionicons name="person" size={24} color={colors.text} />
              </Pressable>
            ),
            headerLeft: () => (
              <Pressable
                onPress={() => {}}
                hitSlop={10}
                style={{ paddingHorizontal: 16 }}
              >
                <Ionicons name="settings-sharp" size={24} color={colors.text} />
              </Pressable>
            ),
          }}
        />
      ) : (
        <>
          <Stack.Header style={{ backgroundColor: colors.background }} />
          <Stack.Screen.Title>Todos</Stack.Screen.Title>
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button
              icon={"person"}
              onPress={() => setProfileOpen(true)}
            />
          </Stack.Toolbar>
          <Stack.Toolbar placement="left">
            <Stack.Toolbar.Button icon={"gear"} onPress={() => {}} />
          </Stack.Toolbar>
        </>
      )}

      {/* TODO LIST SCREEN */}
      <TodolistScreen />

      {/* Floating Input Field */}
      <FloatingTodoInput />

      {/* User Profile Sheet */}
      <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
