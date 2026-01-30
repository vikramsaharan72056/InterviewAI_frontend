import * as DocumentPicker from "expo-document-picker";
import * as React from "react";
import { Button, Platform, Text, View } from "react-native";

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

  if (Platform.OS === "web") {
    return (
      <View style={{ marginVertical: 8 }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              onPick({
                uri: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                mimeType: file.type,
                file, // new: store File object for web
              });
            } else {
              onPick(null);
            }
          }}
        />
        {value && <Text>Picked: {value.name}</Text>}
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 8 }}>
      <Button title={`Pick ${label} PDF`} onPress={pickDocument} />
      {value && <Text>Picked: {value.name}</Text>}
    </View>
  );
}
