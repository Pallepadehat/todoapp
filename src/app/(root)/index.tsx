import UserProfile from "@/components/user-profile";
import db from "@/utils/db";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const user = db.useUser();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello {user.email}</Text>
        <Button title="Show Profile" onPress={() => setProfileOpen(true)} />
      </View>

      <UserProfile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
