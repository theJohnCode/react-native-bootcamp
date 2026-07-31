import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

// Image upload functions
const BUCKET_NAME = process.env.EXPO_PUBLIC_SUPABASE_BUCKET || "laptop-images";

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function uploadImage(
  fileUri: string,
  fileName: string,
): Promise<{ data: { path: string } | null; error: any }> {
  try {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to binary data without using fetch(data:...), which is
    // rejected by Android's native networking URL parser in newer Expo/RN.
    const arrayBuffer = base64ToArrayBuffer(base64);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${fileName}`, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export function getPublicImageUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(path: string): Promise<{ error: any }> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  return { error };
}
