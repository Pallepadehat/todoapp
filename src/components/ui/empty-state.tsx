import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title?: string;
}

export default function EmptyState({
  title = "No items yet. Add one!",
}: EmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
