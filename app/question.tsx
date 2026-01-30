import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import AudioRecorder from "../components/AudioRecorder";

export default function QuestionScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");

  const askQuestion = async () => {
    const q = transcript || question;
    if (!q || !userId) {
      Alert.alert(
        "Missing info",
        "Please provide a question and ensure userId is set."
      );
      return;
    }
    setLoading(true);
    setAnswer("");
    try {
      const res = await axios.post(
        `https://3qn6nvqb-5000.inc1.devtunnels.ms/interview/get-answer`,
        {
          userId,
          question: q,
        }
      );
      setAnswer(res.data.answer ?? JSON.stringify(res.data));
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Ask a Question</Text>

      {/* AudioRecorder: Start/Stop meeting, updates question live */}
      <AudioRecorder setTranscript={setQuestion} />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 8,
          padding: 8,
          marginBottom: 12,
        }}
        placeholder="Type your question"
        value={question}
        onChangeText={setQuestion}
        editable={!loading}
      />
      <Button
        title={loading ? "Getting Response..." : "Get Response"}
        onPress={askQuestion}
        disabled={loading || !question}
      />

      {loading && <ActivityIndicator style={{ marginTop: 24 }} />}
      {answer !== "" && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontWeight: "bold" }}>AI Answer:</Text>
          <Text style={{ fontSize: 16, marginTop: 8 }}>{answer}</Text>
        </View>
      )}
    </ScrollView>
  );
}
