// src/screens/ChatScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";

import { ChevronLeft, Send, Mic } from "lucide-react-native";
import PandaIcon from "../components/PandaIcon";
import { useNavigation } from "@react-navigation/native";
import { useWebSocket } from "../providers/WebSocketProvider";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatScreen() {
  const navigation = useNavigation<any>();

  const { connected, sendMessage, messages: wsMessages } = useWebSocket();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "start",
      role: "assistant",
      content: "Hello! How can I help you practice English today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Listen for WS incoming messages
  useEffect(() => {
    if (!wsMessages || wsMessages.length === 0) return;
    const latest = wsMessages[wsMessages.length - 1];

    if (latest.type === "ai_response") {
      const botMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: latest.text,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }
  }, [wsMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!connected) {
      Alert.alert("Not connected", "WebSocket is disconnected. Please try again.");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Send to backend via WebSocket
    sendMessage({
      type: "chat",
      text: userMsg.content,
    });
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageRow,
        item.role === "user" ? styles.userRow : styles.assistantRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          item.role === "user" ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <ChevronLeft size={24} color="#2c303c" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>English Conversation</Text>

        <View>
          <Text style={{ fontSize: 12, color: connected ? "green" : "red" }}>
            {connected ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.mascotContainer}>
            <View style={styles.mascotCircle}>
              <PandaIcon size="medium" />
            </View>
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#6b7280" size="small" />
            </View>
          ) : null
        }
      />

      {/* INPUT BOX */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Say something..."
              placeholderTextColor="#9ca3af"
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity>
              <Mic size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              (!input.trim() || isLoading) && styles.disabledButton,
            ]}
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ======================= STYLES ======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8eaf0" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#d5d8e0",
    borderBottomWidth: 1,
    borderBottomColor: "#c5c8d4",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c303c",
  },

  iconButton: { padding: 4 },

  listContent: { padding: 16 },

  mascotContainer: { alignItems: "center", marginVertical: 10 },

  mascotCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#2c303c",
    justifyContent: "center",
    alignItems: "center",
  },

  messageRow: { marginBottom: 10, flexDirection: "row" },
  userRow: { justifyContent: "flex-end" },
  assistantRow: { justifyContent: "flex-start" },

  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 14,
  },

  userBubble: { backgroundColor: "#b8bcc9", borderBottomRightRadius: 4 },
  assistantBubble: { backgroundColor: "#d5d8e0", borderBottomLeftRadius: 4 },

  messageText: { color: "#2c303c", fontSize: 14 },

  loadingContainer: {
    paddingVertical: 10,
    paddingLeft: 10,
  },

  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#d5d8e0",
    alignItems: "center",
  },

  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    height: 44,
    marginRight: 8,
  },

  input: { flex: 1, fontSize: 14, color: "#2c303c" },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2c303c",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: { opacity: 0.5 },
});
