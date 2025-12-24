import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'expo-image';

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
    <View>
      <Image source={require("../assets/images/EQapp-logo.png")} style={styles.image}/>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffffff" },
  image: { width: 200, height: 200 }
});