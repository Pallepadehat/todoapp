import db from "@/utils/db";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
    swipeableRef.current?.close();
    setTimeout(() => {
      db.transact(db.tx.todos[item.id].delete());
    }, 150);
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
          style={styles.renameAction}
          onPress={() => {
            swipeableRef.current?.close();
            setIsEditing(true);
          }}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </Pressable>
        <Pressable style={styles.deleteAction} onPress={deleteTodo}>
          <Ionicons name="trash" size={20} color="#fff" />
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
          item.isCompleted && styles.containerCompleted,
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
            color={item.isCompleted ? "#007AFF" : "#C7C7CC"}
          />
        </Pressable>

        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={saveRename}
            onBlur={saveRename}
            returnKeyType="done"
          />
        ) : (
          <Text
            style={[styles.text, item.isCompleted && styles.textCompleted]}
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
    backgroundColor: "#FF9500",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  containerCompleted: {
    backgroundColor: "#F9F9FB",
  },
  toggleButton: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  textCompleted: {
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    padding: 0,
    margin: 0,
  },
  rightActionsContainer: {
    flexDirection: "row",
    height: "100%",
  },
  renameAction: {
    width: 64,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteAction: {
    width: 64,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
});
