import db from "@/utils/db";
import { useThemeColor } from "@/utils/theme";
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
  const colors = useThemeColor();

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
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.disabled }}
    >
      <BottomSheetView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Avatar + name */}
          <View style={styles.profile}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.avatarBackground },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.avatarText }]}>
                {getInitials(displayName)}
              </Text>
            </View>
            <Text style={[styles.displayName, { color: colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>
              {email ?? "—"}
            </Text>
          </View>

          {/* Info card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Nickname row */}
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                Nickname
              </Text>
              {isEditingNick ? (
                <TextInput
                  ref={nicknameInputRef}
                  style={[styles.input, { color: colors.text }]}
                  value={nickDraft}
                  onChangeText={setNickDraft}
                  placeholder="Add a nickname"
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="done"
                  onSubmitEditing={handleSaveNickname}
                  autoCorrect={false}
                />
              ) : (
                <Pressable onPress={handleStartEdit} hitSlop={12}>
                  <Text
                    style={
                      nickDraft
                        ? [styles.rowValue, { color: colors.textSecondary }]
                        : [styles.rowValueEmpty, { color: colors.primary }]
                    }
                  >
                    {nickDraft || "Add"}
                  </Text>
                </Pressable>
              )}
            </View>

            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />

            {/* Email row */}
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                Email
              </Text>
              <Text
                style={[styles.rowValue, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
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
                  { backgroundColor: colors.card },
                  pressed && styles.pressed,
                ]}
                onPress={handleCancelEdit}
              >
                <Text
                  style={[styles.cancelText, { color: colors.textSecondary }]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                  pressed && styles.pressed,
                ]}
                onPress={handleSaveNickname}
              >
                <Text style={[styles.saveText, { color: colors.white }]}>
                  Save
                </Text>
              </Pressable>
            </View>
          )}

          <View style={{ flex: 1 }} />

          {/* Sign out */}
          {!isEditingNick && (
            <Pressable
              style={({ pressed }) => [
                styles.signOutButton,
                { backgroundColor: colors.card },
                pressed && styles.pressed,
              ]}
              onPress={handleSignOut}
            >
              <Text style={[styles.signOutText, { color: colors.error }]}>
                Sign Out
              </Text>
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "600",
  },
  displayName: {
    fontSize: 17,
    fontWeight: "600",
  },
  email: {
    fontSize: 13,
  },

  // Card
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
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
  },
  rowValue: {
    fontSize: 15,
    flexShrink: 1,
    marginLeft: 8,
    textAlign: "right",
  },
  rowValueEmpty: {
    fontSize: 15,
    marginLeft: 8,
  },
  input: {
    fontSize: 15,
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
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Sign out
  signOutButton: {
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
  },
});
