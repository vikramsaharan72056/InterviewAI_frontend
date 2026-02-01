import * as DocumentPicker from "expo-document-picker";
import * as React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Match PDFAsset type to the one used in HomeScreen
export type PDFAsset = {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
  file?: File; // new: include File object for web
};

type Props = {
  label: string;
  onPick: (file: PDFAsset | null) => void;
  value: PDFAsset | null;
};

export default function PDFUploader({ label, onPick, value }: Props) {
  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
      multiple: false,
    });

    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      onPick({
        uri: asset.uri,
        name: asset.name ?? "file.pdf",
        size: asset.size,
        mimeType: asset.mimeType,
      });
    } else {
      onPick(null);
    }
  };

  // Determine color based on label
  const isResume = label.toLowerCase().includes("resume");
  const primaryColor = isResume ? "#3b82f6" : "#8b5cf6"; // Blue for resume, Purple for JD
  const bgColor = isResume ? "#eff6ff" : "#f5f3ff";

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: primaryColor }]}>
            📄 {label}
          </Text>
          <Text style={styles.hint}>
            {isResume ? "Upload your CV/Resume" : "Upload the job posting"}
          </Text>
        </View>

        <label style={{ ...styles.webButton, borderColor: primaryColor, cursor: 'pointer' } as any}>
          <input
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                onPick({
                  uri: URL.createObjectURL(file),
                  name: file.name,
                  size: file.size,
                  mimeType: file.type,
                  file,
                });
              } else {
                onPick(null);
              }
            }}
          />
          <Text style={{ color: primaryColor, fontWeight: '600' }}>
            {value ? "✓ Change File" : `+ Choose ${label}`}
          </Text>
        </label>

        {value && (
          <View style={styles.selectedFile}>
            <Text style={styles.fileName}>✓ {value.name}</Text>
            {value.size && (
              <Text style={styles.fileSize}>
                {(value.size / 1024).toFixed(1)} KB
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: primaryColor }]}>
          📄 {label}
        </Text>
        <Text style={styles.hint}>
          {isResume ? "Upload your CV/Resume" : "Upload the job posting"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { borderColor: primaryColor }]}
        onPress={pickDocument}
      >
        <Text style={[styles.buttonText, { color: primaryColor }]}>
          {value ? "✓ Change File" : `+ Choose ${label}`}
        </Text>
      </TouchableOpacity>

      {value && (
        <View style={styles.selectedFile}>
          <Text style={styles.fileName}>✓ {value.name}</Text>
          {value.size && (
            <Text style={styles.fileSize}>
              {(value.size / 1024).toFixed(1)} KB
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  header: {
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: "#6b7280",
    fontStyle: "italic",
  },
  button: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  webButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    textAlign: "center",
    backgroundColor: "white",
    display: "block",
  },
  selectedFile: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: "#16a34a",
  },
});
