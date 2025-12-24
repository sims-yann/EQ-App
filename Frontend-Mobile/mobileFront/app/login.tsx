import { Text, View, StyleSheet, TextInput, Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'expo-image';

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={require("../assets/images/EQapp-logo.png")} style={styles.image} />
        {/* <Text>Edit app/login.tsx to customize this screen.</Text> */}
      </View>
      <TextInput placeholder="Username" style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, width: 200, paddingHorizontal: 10}} />
      <TextInput placeholder="Password" secureTextEntry style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, width: 200, paddingHorizontal: 10}} />
      <Pressable style={styles.button}>
        <Text style={{fontSize: 16, color: 'white', backgroundColor: 'blue', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5}}>Login</Text>
        </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffffff" },
  image: { width: 150, height: 150 },
  button: { marginTop: 20 }
});
