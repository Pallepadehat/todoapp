import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import TodoItem from "@/components/ui/todo-item";
import db from "@/utils/db";
import React, { Activity, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TodolistScreen() {
  const query = { todos: {} };
  const { isLoading, error, data } = db.useQuery(query);

  const isEmpty = data?.todos?.length === 0;

  const sortedTodos = useMemo(() => {
    if (!data?.todos) return [];
    return [...data.todos].sort((a: any, b: any) => {
      // Uncompleted items at the top
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // If same status, keep them ordered by ID
      return a.id.localeCompare(b.id);
    });
  }, [data?.todos]);

  return (
    <View style={styles.container}>
      <Activity mode={isLoading ? "visible" : "hidden"}>
        <Skeleton />
      </Activity>

      <Activity mode={!isLoading && isEmpty ? "visible" : "hidden"}>
        <EmptyState title="No todos yet. Add one!" />
      </Activity>

      <Activity mode={!isLoading && !isEmpty ? "visible" : "hidden"}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Text style={styles.title}>Todos</Text>
          {sortedTodos.map((item: any) => (
            <TodoItem key={item.id} item={item} />
          ))}
        </ScrollView>
      </Activity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  todoItem: {
    fontSize: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
