import { Text, View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.push('/login')} style={{position: 'absolute', top: 50, right: 20}} accessibilityRole="button">
        <Text style={{fontSize: 16, color: 'blue'}}>Go to Login</Text>
      </Pressable>
    <View style={{alignItems: 'center'}}>
      <Image source={require("../assets/images/EQapp-logo.png")} style={styles.image}/>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Welcome to EQ-App</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffffff" },
  image: { width: 200, height: 200 }
});
