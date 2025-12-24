import { Text, View, StyleSheet, TextInput, Button } from "react-native";
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
      <Button title="Login" onPress={() => { /* Handle login logic here */ }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffffff" },
  image: { width: 150, height: 150 },
});
