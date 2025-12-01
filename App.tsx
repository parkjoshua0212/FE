// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Auth0Provider } from "react-native-auth0";   // ✅ IMPORTANT
import { AuthProvider } from "./src/providers/AuthProvider";
import { WebSocketProvider } from "./src/providers/WebSocketProvider";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/login";
import ProfileScreen from "./src/screens/Profile";
import SplashScreen from "./src/screens/SplashScreen";
import SignupScreen from "./src/screens/SignupScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import StudyStatsScreen from "./src/screens/StudyStatsScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import SubscriptionSimpleScreen from "./src/screens/SubscriptionSimpleScreen";
import PremiumSubscribeModal from "./src/screens/PremiumSubscribeModal";
import PremiumCancelModal from "./src/screens/PremiumCancelModal";
import AccountManageScreen from "./src/screens/AccountManageScreen";
import DeleteAccountScreen from "./src/screens/DeleteAccountScreen";
import DeleteAccountModal from "./src/screens/DeleteAccountModal";
import LogoutModal from "./src/screens/LogoutModal";
import ChatSettingsScreen from "./src/screens/chatSettingScreen";
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Auth0Provider
      domain="dev-rc5gsyjk5pfptk72.us.auth0.com"       // ✅ YOUR AUTH0 DOMAIN
      clientId="k1naLtV7ldGAv6ufgUsNe6XlrOQynDpt"             // ❗ INSERT CLIENT ID
    >
      <AuthProvider>
        <WebSocketProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">

              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: "회원가입" }}
              />

              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Lingomate" }}
              />

              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "설정" }}
              />

              <Stack.Screen
                name="StudyStats"
                component={StudyStatsScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="SubscriptionSimple"
                component={SubscriptionSimpleScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Subscription"
                component={SubscriptionScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="PremiumSubscribeModal"
                component={PremiumSubscribeModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />

              <Stack.Screen
                name="PremiumCancelModal"
                component={PremiumCancelModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />

              <Stack.Screen
                name="AccountManage"
                component={AccountManageScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="LogoutModal"
                component={LogoutModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />

              <Stack.Screen
                name="DeleteAccount"
                component={DeleteAccountScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="DeleteAccountModal"
                component={DeleteAccountModal}
                options={{
                  presentation: "transparentModal",
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />

              <Stack.Screen
                name="ChatSettings"
                component={ChatSettingsScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: false }}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </WebSocketProvider>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;
