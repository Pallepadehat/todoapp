import db from "@/utils/db";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type UserProfileProps = {
  isOpen: boolean;
  onClose: () => void;
};

function getInitials(value: string | null | undefined): string {
  if (!value) return "?";
  const parts = value.trim().split(/[\s._\-+@]/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : value.slice(0, 2).toUpperCase();
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);
  const nicknameInputRef = useRef<TextInput>(null);

  const user = db.useUser();
  const email = user?.email ?? null;

  // Query the full $users entity to get stored nickname
  const { data } = db.useQuery(
    user?.id ? { $users: { $: { where: { id: user.id } } } } : null,
  );
  const currentUser = data?.$users?.[0];
  const savedNickname = currentUser?.nickname ?? "";

  const [nickDraft, setNickDraft] = useState(savedNickname);
  const [isEditingNick, setIsEditingNick] = useState(false);

  // Keep draft in sync when data loads
  useEffect(() => {
    if (!isEditingNick) {
      setNickDraft(savedNickname);
    }
  }, [savedNickname]);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
      setIsEditingNick(false);
    }
  }, [isOpen]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    [],
  );

  const handleStartEdit = () => {
    setIsEditingNick(true);
    setTimeout(() => nicknameInputRef.current?.focus(), 50);
  };

  const handleSaveNickname = () => {
    if (currentUser?.id) {
      db.transact([
        db.tx.$users[currentUser.id].update({ nickname: nickDraft.trim() }),
      ]);
    }
    Keyboard.dismiss();
    setIsEditingNick(false);
  };

  const handleCancelEdit = () => {
    setNickDraft(savedNickname);
    Keyboard.dismiss();
    setIsEditingNick(false);
  };

  const handleSignOut = () => {
    db.auth.signOut();
    onClose();
  };

  const displayName = savedNickname || email?.split("@")[0] || "Guest";

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={onClose}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Avatar + name */}
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
            </View>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.email}>{email ?? "—"}</Text>
          </View>

          {/* Info card */}
          <View style={styles.card}>
            {/* Nickname row */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Nickname</Text>
              {isEditingNick ? (
                <TextInput
                  ref={nicknameInputRef}
                  style={styles.input}
                  value={nickDraft}
                  onChangeText={setNickDraft}
                  placeholder="Add a nickname"
                  placeholderTextColor="#C7C7CC"
                  returnKeyType="done"
                  onSubmitEditing={handleSaveNickname}
                  autoCorrect={false}
                />
              ) : (
                <Pressable onPress={handleStartEdit} hitSlop={12}>
                  <Text
                    style={nickDraft ? styles.rowValue : styles.rowValueEmpty}
                  >
                    {nickDraft || "Add"}
                  </Text>
                </Pressable>
              )}
            </View>

            <View style={styles.separator} />

            {/* Email row */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {email ?? "—"}
              </Text>
            </View>
          </View>

          {/* Save / Cancel when editing */}
          {isEditingNick && (
            <View style={styles.editActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.saveButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleSaveNickname}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          )}

          <View style={{ flex: 1 }} />

          {/* Sign out */}
          {!isEditingNick && (
            <Pressable
              style={({ pressed }) => [
                styles.signOutButton,
                pressed && styles.pressed,
              ]}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 4,
  },

  // Profile block
  profile: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D1D6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3C3C43",
  },
  displayName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
  email: {
    fontSize: 13,
    color: "#8E8E93",
  },

  // Card
  card: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C6C6C8",
    marginLeft: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 46,
  },
  rowLabel: {
    fontSize: 15,
    color: "#000",
  },
  rowValue: {
    fontSize: 15,
    color: "#8E8E93",
    flexShrink: 1,
    marginLeft: 8,
    textAlign: "right",
  },
  rowValueEmpty: {
    fontSize: 15,
    color: "#007AFF",
    marginLeft: 8,
  },
  input: {
    fontSize: 15,
    color: "#000",
    flexShrink: 1,
    marginLeft: 8,
    textAlign: "right",
    minWidth: 140,
  },

  // Edit actions
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3C3C43",
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  // Sign out
  signOutButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FF3B30",
  },
});
