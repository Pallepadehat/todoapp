import { StyleSheet, View } from "react-native";

interface SkeletonProps {
  count?: number;
}

export default function Skeleton({ count = 3 }: SkeletonProps) {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.skeletonItem} />
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
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});
