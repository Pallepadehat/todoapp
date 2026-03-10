import db from "@/utils/db";
import { useThemeColor } from "@/utils/theme";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function AuthScreen() {
  return <Login />;
}

function Login() {
  const [sentEmail, setSentEmail] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const colors = useThemeColor();

  if (!sentEmail) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Let&apos;s log you in!
        </Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />
        <Button
          title="Send code"
          onPress={() => {
            setSentEmail(email);
            db.auth.sendMagicCode({ email }).catch((err) => {
              Alert.alert("Uh oh", err.body?.message);
              setSentEmail("");
            });
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Enter your code
      </Text>
      <Text style={{ color: colors.textSecondary }}>
        We sent an email to {sentEmail}. Check your email, and enter the code
        you see.
      </Text>
      <TextInput
        placeholder="123456..."
        placeholderTextColor={colors.textSecondary}
        value={code}
        onChangeText={setCode}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
      />
      <Button
        title="Verify Code"
        onPress={() => {
          db.auth
            .signInWithMagicCode({ email: sentEmail, code })
            .catch((err) => {
              Alert.alert("Uh oh", err.body?.message);
              setCode("");
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
});
