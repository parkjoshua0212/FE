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

type Props = {
  navigation: any;
};

export default function SignupScreen({ navigation }: Props) {
  const { authorize } = useAuth0();
  const { login } = useAuth();

  const handleSignup = async () => {
    try {
      // 1️⃣ Open Auth0 signup page
      const credentials = await authorize({
        scope: 'openid profile email',
        audience: 'https://api.lingomate.com',
        additionalParameters: { screen_hint: "signup" }, // 👈 forces signup UI
      });

      if (!credentials?.accessToken) {
        console.warn("No access token returned");
        return;
      }

      // 2️⃣ Send token to AuthProvider → save → register-if-needed
      await login(credentials.accessToken);

      // 3️⃣ Navigate to Home after successful signup
      navigation.replace('Home');

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
            {/* Logo + Title */}
            <View style={styles.logoSection}>
              <View style={styles.logoRow}>
                <Text style={styles.logoText}>LING</Text>
                <PandaIcon size="small" />
                <Text style={styles.logoText}>MATE</Text>
              </View>
              <Text style={styles.desc}>AI와 함께하는 외국어 회화</Text>
            </View>

            {/* These input fields are OPTIONAL visual fields (not used by Auth0) */}
            <TextInput
              style={styles.inputBoxId}
              placeholder="닉네임 (선택)"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={styles.inputBoxEmail}
              placeholder="이메일 (Auth0에서 입력)"
              placeholderTextColor="#9ca3af"
              editable={false} // Auth0 handles it
            />

            <TextInput
              style={styles.inputBoxPw}
              placeholder="비밀번호 (Auth0에서 입력)"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              editable={false}
            />

            {/* Signup button */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#e5e7ed',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#d5d8e0',
    borderRadius: 24,
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c303c',
  },
  desc: {
    marginTop: 8,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  inputBoxId: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#2c303c',
    marginBottom: 8,
  },
  inputBoxEmail: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff80',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  inputBoxPw: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ffffff80',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  signupButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2c303c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 15,
  },
});
