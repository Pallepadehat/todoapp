import db from "@/utils/db";
import { useThemeColor } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type TodoItemProps = {
  item: {
    id: string;
    text: string;
    isCompleted: boolean;
  };
};

export default function TodoItem({ item }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  const swipeableRef = useRef<any>(null);
  const inputRef = useRef<TextInput>(null);
  const colors = useThemeColor();

  useEffect(() => {
    if (isEditing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setDraft(item.text);
    }
  }, [isEditing, item.text]);

  const toggleCompleted = () => {
    db.transact(
      db.tx.todos[item.id].update({
        isCompleted: !item.isCompleted,
      }),
    );
  };

  const deleteTodo = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this todo?",
      );
      if (confirmed) {
        swipeableRef.current?.close();
        setTimeout(() => {
          db.transact(db.tx.todos[item.id].delete());
        }, 150);
      } else {
        swipeableRef.current?.close();
      }
      return;
    }

    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          swipeableRef.current?.close();
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          swipeableRef.current?.close();
          setTimeout(() => {
            db.transact(db.tx.todos[item.id].delete());
          }, 150);
        },
      },
    ]);
  };

  const saveRename = () => {
    if (draft.trim() && draft.trim() !== item.text) {
      db.transact(
        db.tx.todos[item.id].update({
          text: draft.trim(),
        }),
      );
    } else {
      setDraft(item.text);
    }
    setIsEditing(false);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActionsContainer}>
        <Pressable
          style={[styles.renameAction, { backgroundColor: colors.warning }]}
          onPress={() => {
            swipeableRef.current?.close();
            setIsEditing(true);
          }}
        >
          <Ionicons name="pencil" size={20} color={colors.white} />
        </Pressable>
        <Pressable
          style={[styles.deleteAction, { backgroundColor: colors.error }]}
          onPress={deleteTodo}
        >
          <Ionicons name="trash" size={20} color={colors.white} />
        </Pressable>
      </View>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      containerStyle={styles.swipeableContainer}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card },
          item.isCompleted && { backgroundColor: colors.cardCompleted },
        ]}
      >
        <Pressable
          onPress={toggleCompleted}
          style={styles.toggleButton}
          hitSlop={8}
        >
          <Ionicons
            name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={item.isCompleted ? colors.primary : colors.disabled}
          />
        </Pressable>

        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={saveRename}
            onBlur={saveRename}
            returnKeyType="done"
          />
        ) : (
          <Text
            style={[
              styles.text,
              { color: colors.text },
              item.isCompleted && [
                styles.textCompleted,
                { color: colors.textSecondary },
              ],
            ]}
            onLongPress={() => setIsEditing(true)}
          >
            {item.text || "Unnamed Todo"}
          </Text>
        )}
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  toggleButton: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: "line-through",
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  rightActionsContainer: {
    flexDirection: "row",
    height: "100%",
  },
  renameAction: {
    width: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteAction: {
    width: 64,
    justifyContent: "center",
    alignItems: "center",
  },
});
