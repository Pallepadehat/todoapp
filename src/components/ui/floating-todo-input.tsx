import db from "@/utils/db";
import { useThemeColor } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { id } from "@instantdb/react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingTodoInput() {
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const height = useSharedValue(0);
  const colors = useThemeColor();

  useKeyboardHandler(
    {
      onMove: (event) => {
        "worklet";
        height.value = Math.max(event.height, 0);
      },
      onEnd: (event) => {
        "worklet";
        height.value = Math.max(event.height, 0);
      },
    },
    [],
  );

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -height.value,
        },
      ],
    };
  }, []);

  const handleAdd = () => {
    if (!text.trim()) return;

    db.transact(
      db.tx.todos[id()].create({
        text: text.trim(),
        isCompleted: false,
      }),
    );

    setText("");
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        containerStyle,
        { bottom: Math.max(insets.bottom, 20) },
      ]}
    >
      <View
        style={[
          styles.view,
          {
            backgroundColor: colors.card,
            borderColor: colors.borderLight,
            boxShadow: `0px 10px 20px ${colors.borderLight}`,
          },
        ]}
      >
        <TextInput
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primaryLight },
            !text.trim() && { backgroundColor: colors.primaryDisabled },
            pressed && styles.buttonPressed,
          ]}
          disabled={!text.trim()}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={!text.trim() ? colors.disabled : colors.primary}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 10,
    right: 10,
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 16,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  } as any,
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
