import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";
import PDFUploader from "../../components/PDFUploader";

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

      // Replace with your LAN IP if testing on device!
      const res = await axios.post(
        `https://3qn6nvqb-5000.inc1.devtunnels.ms/interview/upload-context`,
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
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 24 }}>Upload PDFs</Text>
      <PDFUploader label="Resume" onPick={setResume} value={resume} />
      <PDFUploader
        label="Job Description"
        onPick={setJobDescription}
        value={jobDescription}
      />
      <Button title="Upload & Continue" onPress={handleUpload} />
    </View>
  );
}
