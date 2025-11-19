import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <LinearGradient colors={['#1e293b', '#334155', '#475569']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>404</Text>
          <Text style={styles.subtitle}>Page not found</Text>

          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Go Home</Text>
          </Link>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
  link: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#60a5fa",
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
