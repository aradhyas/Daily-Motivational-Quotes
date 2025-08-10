
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

const MOODS = ["happy", "sad", "anxious", "angry", "motivated", "lonely", "grateful", "tired"];

/**
 * Pick the right base URL:
 * - iOS Simulator: http://localhost:8787
 * - Android Emulator: http://10.0.2.2:8787
 * - Physical device (same Wi‑Fi): http://YOUR_LAPTOP_LAN_IP:8787  e.g. http://192.168.1.25:8787
 */
const API_BASE =
  Platform.OS === "android"
    ? "http://10.0.2.2:8787" // Android emulator special localhost
    : "http://192.168.1.21:8787"; // iOS sim / change to LAN IP for real device

export default function Page() {
  const [selected, setSelected] = useState("happy");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    try {
      setLoading(true);
      setQuote("");
      const res = await fetch(`${API_BASE}/quote?mood=${encodeURIComponent(selected)}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setQuote(data.quote || "Keep going. Your next step matters most.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not fetch a quote. Is the server running and reachable?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you feel today?</Text>

      <View style={styles.grid}>
        {MOODS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.chip, selected === m && styles.chipActive]}
            onPress={() => setSelected(m)}
          >
            <Text style={[styles.chipText, selected === m && styles.chipTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={getQuote} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Thinking…" : "Hit it"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {!!quote && (
        <View style={styles.card}>
          <Text style={styles.sparkles}>✨</Text>
          <Text style={styles.quote}>{quote}</Text>
          <Text style={styles.mood}>— {selected}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 24, backgroundColor: "#FFF" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 12,
  },
  chipActive: { backgroundColor: "#111", borderColor: "#111" },
  chipText: { fontSize: 16, color: "#111" },
  chipTextActive: { color: "#fff" },
  button: {
    marginTop: 20,
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  card: { marginTop: 24, padding: 16, borderRadius: 16, borderColor: "#eee", borderWidth: 1 },
  sparkles: { fontSize: 18 },
  quote: { fontSize: 22, lineHeight: 30, marginTop: 8 },
  mood: { marginTop: 8, color: "#666" },
});
