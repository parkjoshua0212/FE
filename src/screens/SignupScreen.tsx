// src/screens/SignupScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import PandaIcon from '../components/PandaIcon';

import { useAuth0 } from 'react-native-auth0';
import { useAuth } from '../providers/AuthProvider';

const AUTH0_DOMAIN = "dev-rc5gsyjk5pfptk72.us.auth0.com";

// 🔥 YOUR REQUIRED REDIRECT URI
const REDIRECT_URI = `com.lingomateapp://${AUTH0_DOMAIN}/android/com.lingomateapp/callback`;

export default function SignupScreen({ navigation }: any) {
  const { authorize } = useAuth0();
  const { login } = useAuth();

  const handleSignup = async () => {
    try {
      console.log("🔵 Using redirect:", REDIRECT_URI);

      const credentials = await authorize({
        scope: "openid profile email",
        audience: "https://api.lingomate.com",
        redirectUri: REDIRECT_URI,        // ✅ REQUIRED
        additionalParameters: {
          screen_hint: "signup",          // 👈 Force signup UI
        },
      });

      if (!credentials?.accessToken) {
        console.warn("No access token returned");
        return;
      }

      // Save + register user
      await login(credentials.accessToken);

      navigation.replace("Home");

    } catch (err: any) {
      console.error("Signup error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.card}>

            {/* Logo */}
            <View style={styles.logoSection}>
              <View style={styles.logoRow}>
                <Text style={styles.logoText}>LING</Text>
                <PandaIcon size="small" />
                <Text style={styles.logoText}>MATE</Text>
              </View>
              <Text style={styles.desc}>AI와 함께하는 외국어 회화</Text>
            </View>

            {/* These fields are purely visual — Auth0 handles actual signup */}
            <TextInput
              style={styles.inputBoxId}
              placeholder="닉네임 (선택)"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={styles.inputBoxEmail}
              placeholder="이메일 (Auth0에서 입력)"
              placeholderTextColor="#9ca3af"
              editable={false}
            />

            <TextInput
              style={styles.inputBoxPw}
              placeholder="비밀번호 (Auth0에서 입력)"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              editable={false}
            />

            <Pressable style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>회원가입</Text>
            </Pressable>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#e5e7ed" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#d5d8e0",
    borderRadius: 24,
    padding: 24,
  },
  logoSection: { alignItems: "center", marginBottom: 16 },
  logoRow: { flexDirection: "row", alignItems: "center", columnGap: 4 },
  logoText: { fontSize: 22, fontWeight: "bold", color: "#2c303c" },
  desc: { marginTop: 8, fontSize: 13, color: "#6b7280", textAlign: "center" },

  inputBoxId: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    marginBottom: 8,
    color: "#2c303c",
  },
  inputBoxEmail: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ffffff80",
    paddingHorizontal: 14,
    marginBottom: 8,
    color: "#9ca3af",
  },
  inputBoxPw: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#ffffff80",
    paddingHorizontal: 14,
    marginBottom: 12,
    color: "#9ca3af",
  },
  signupButton: {
    height: 48,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#2c303c",
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
