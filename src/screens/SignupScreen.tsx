// src/screens/SignupScreen.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PandaIcon from '../components/PandaIcon';
import { ChevronLeft } from 'lucide-react-native';
import { AuthContext } from '../../App';

export default function SignupScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const auth = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      await auth.signup(); // ⬅ Auth0 signup
    } catch (err) {
      console.log("Signup failed:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top }]}>

        {/* Back Button */}
        <View style={styles.topHeader}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={26} color="#2c303c" strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Logo + Auth0 Signup */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>회원가입</Text>

          <View style={styles.card}>
            <View style={styles.logoSection}>
              <View style={styles.logoRow}>
                <Text style={styles.logoText}>LING</Text>
                <PandaIcon size="small" />
                <Text style={styles.logoText}>MATE</Text>
              </View>
              <Text style={styles.desc}>AI와 함께하는 외국어 회화</Text>
            </View>

            {/* Auth0 Signup Button */}
            <Pressable style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Auth0로 회원가입</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e5e7ed' },
  container: { flex: 1, paddingHorizontal: 24 },
  topHeader: { width: '100%', alignItems: 'flex-start', marginBottom: 8 },
  backButton: { width: 32, height: 32, justifyContent: 'center' },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
  },

  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2c303c', marginBottom: 12 },

  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#d5d8e0',
    borderRadius: 24,
    padding: 24,
  },

  logoSection: { alignItems: 'center', marginBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', columnGap: 4 },

  logoText: { fontSize: 22, fontWeight: 'bold', color: '#2c303c' },
  desc: { marginTop: 8, fontSize: 13, color: '#6b7280', textAlign: 'center' },

  signupButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2c303c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: { color: '#ffffff', fontWeight: '500', fontSize: 15 },
});
