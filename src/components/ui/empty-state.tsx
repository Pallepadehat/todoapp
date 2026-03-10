import { useThemeColor } from "@/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title?: string;
}

export default function EmptyState({
  title = "No items yet. Add one!",
}: EmptyStateProps) {
  const colors = useThemeColor();

  return (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {title}
      </Text>
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
  },
});
