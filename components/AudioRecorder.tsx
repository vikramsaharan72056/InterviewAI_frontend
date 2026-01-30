import { Audio } from "expo-av";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Button, Platform, Text, View } from "react-native";

type AudioRecorderProps = {
  setTranscript?: (text: string) => void;
};

export default function AudioRecorder({ onResult }: AudioRecorderProps) {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [listening, setListening] = useState(false);
  const isCancelled = useRef(false);
  const [recordingWeb, setRecordingWeb] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [question, setQuestion] = useState(""); // from manual typing

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Web: record audio via MediaRecorder
  async function startWebRecording() {
    const stream = await (navigator.mediaDevices as any).getUserMedia({
      audio: true,
    });
    const mediaRecorder = new (window as any).MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];
    mediaRecorder.start();
    setRecordingWeb(true);

    mediaRecorder.ondataavailable = (e: any) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setRecordingWeb(false);
      const blob = new Blob(chunksRef.current, { type: "audio/wav" });
      const file = new File([blob], "recording.wav", { type: "audio/wav" });
      setAudioUrl(URL.createObjectURL(blob));
      setTranscript("Transcribing...");
      const text = await speechToTextWhisper(file);
      setTranscript(text);
      onResult(text);
      chunksRef.current = [];
    };
  }

  function stopWebRecording() {
    mediaRecorderRef.current?.stop();
    setRecordingWeb(false);
  }

  // Web: file picker
  if (Platform.OS === "web") {
    return (
      <View style={{ marginTop: 16 }}>
        <Button
          title={recordingWeb ? "Stop Recording" : "Start Recording"}
          onPress={recordingWeb ? stopWebRecording : startWebRecording}
        />
        {audioUrl && (
          <audio src={audioUrl} controls style={{ marginTop: 12 }} />
        )}
        <Text style={{ fontSize: 14, marginTop: 8 }}>
          {transcript ||
            (recordingWeb ? "Recording..." : "Click start to record")}
        </Text>
      </View>
    );
  }

  // Start/stop controlled recording loop
  const startMeeting = async () => {
    setTranscript("");
    setListening(true);
    isCancelled.current = false;
    await recordChunk();
  };

  const stopMeeting = async () => {
    setListening(false);
    isCancelled.current = true;
    if (recording) {
      await recording.stopAndUnloadAsync();
    }
  };

  // Record a short chunk, transcribe, repeat if still listening
  const recordChunk = async () => {
    if (isCancelled.current) return;
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      setListening(false);
      return;
    }
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setTimeout(async () => {
        if (isCancelled.current) return;
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);

        const chunkText = await speechToTextWhisper(uri);

        setTranscript((t) => {
          const newText = (t + " " + chunkText).trim();
          props.setTranscript(newText);
          return newText;
        });

        if (!isCancelled.current) {
          await recordChunk();
        }
      }, 2000);
    } catch (err) {
      setListening(false);
    }
  };

  async function speechToTextWhisper(
    fileOrUri: File | string | null
  ): Promise<string> {
    if (!fileOrUri) return "";
    try {
      const formData = new FormData();
      if (Platform.OS === "web") {
        // Web : real file Object
        formData.append("audio", fileOrUri as File);
      } else {
        // React Native : URI string
        const uri = fileOrUri as string;
        const fileName = uri.split("/").pop() || "audio.wav";
        formData.append("audio", {
          uri,
          name: fileName,
          type: "audio/wav",
        } as any);
      }
      const response = await fetch(
        "https://3qn6nvqb-5000.inc1.devtunnels.ms/interview/transcribe-audio",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const err = await response.text();
        console.error("Whisper error:", err);
        return "";
      }
      const json = await response.json();
      return json.text || "";
    } catch (err) {
      console.error("STT error:", err);
      return "";
    }
  }

  return (
    <View style={{ marginTop: 16 }}>
      <Button
        title={listening ? "Stop Meeting" : "Start Meeting"}
        onPress={listening ? stopMeeting : startMeeting}
      />
      {listening && <ActivityIndicator />}
      <Text style={{ fontSize: 14, marginTop: 8 }}>
        {listening ? "Listening and transcribing..." : "Not listening"}
      </Text>
      <Text style={{ fontSize: 16, marginTop: 12 }}>{transcript}</Text>
    </View>
  );
}
