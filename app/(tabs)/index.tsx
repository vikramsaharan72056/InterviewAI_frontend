import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import PDFUploader from "../../components/PDFUploader";
import { API_ENDPOINTS, logApiCall } from "../../config/api";


// Types for PDF assets returned by expo-document-picker
type PDFAsset = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  file?: File; // Include File object for web
};

export default function HomeScreen() {
  const [resume, setResume] = useState<PDFAsset | null>(null);
  const [jobDescription, setJobDescription] = useState<PDFAsset | null>(null);
  const [userId] = useState("user1"); // Replace with actual user logic
  const router = useRouter();

  const handleUpload = async () => {
    if (!resume || !jobDescription) {
      Alert.alert("Please select both PDFs");
      return;
    }
    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        formData.append("resume", resume.file as File);
        formData.append("jobDescription", jobDescription.file as File);
      } else {
        formData.append("resume", {
          uri: resume.uri,
          name: resume.name || "resume.pdf",
          type: "application/pdf",
        } as any);
        formData.append("jobDescription", {
          uri: jobDescription.uri,
          name: jobDescription.name || "jobDescription.pdf",
          type: "application/pdf",
        } as any);
      }
      formData.append("userId", userId);

      logApiCall(API_ENDPOINTS.uploadContext, "POST", { userId });

      const res = await axios.post(
        API_ENDPOINTS.uploadContext,
        formData
      );
      if (res.status === 200 || res.status === 201) {
        Alert.alert("Uploaded!", "PDFs uploaded successfully.");
        router.push(`./question?userId=${userId}`);
      } else {
        Alert.alert("Upload Failed", await res.data);
      }
    } catch (e: any) {
      console.log(e, e.message);
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f9fafb" }}>
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8, color: "#111827" }}>
          🎯 Interview Prep AI
        </Text>
        <Text style={{ fontSize: 16, color: "#6b7280", marginBottom: 4 }}>
          Upload your documents to get started
        </Text>
        <Text style={{ fontSize: 14, color: "#9ca3af" }}>
          Step 1 of 2: Upload PDFs (max 2MB each)
        </Text>
      </View>

      <PDFUploader label="Resume" onPick={setResume} value={resume} />
      <PDFUploader
        label="Job Description"
        onPick={setJobDescription}
        value={jobDescription}
      />

      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: resume && jobDescription ? "#10b981" : "#d1d5db",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
          onPress={handleUpload}
          disabled={!resume || !jobDescription}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            {resume && jobDescription ? "Continue to Questions →" : "Select Both PDFs First"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
