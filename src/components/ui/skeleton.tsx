import { useThemeColor } from "@/utils/theme";
import { StyleSheet, View } from "react-native";

interface SkeletonProps {
  count?: number;
}

export default function Skeleton({ count = 3 }: SkeletonProps) {
  const colors = useThemeColor();

  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[styles.skeletonItem, { backgroundColor: colors.skeleton }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    gap: 12,
  },
  skeletonItem: {
    height: 60,
    borderRadius: 8,
  },
});
