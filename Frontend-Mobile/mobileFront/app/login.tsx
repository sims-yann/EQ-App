import React, { useRef } from "react";
import { Text, View, StyleSheet, TextInput, Button, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'expo-image';

export default function Login() {
  const pressAnim = useRef(new Animated.Value(0)).current;
  const bgColor = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2990ffff', '#1f7be6ff']
  });

  const handlePressIn = () => {
    Animated.timing(pressAnim, { toValue: 1, duration: 150, useNativeDriver: false }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={require("../assets/images/EQapp-logo.png")} style={styles.image} />
        {/* <Text>Edit app/login.tsx to customize this screen.</Text> */}
      </View>
      <TextInput placeholder="Matricule" style={styles.input} />
      <TextInput placeholder="School Mail" style={styles.input} />
      <TextInput placeholder="Class" style={styles.input} />
      <Pressable style={styles.button} onPress={() => {}} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.animatedButton, { backgroundColor: bgColor }]}>
          <Text style={styles.buttonText}>Login</Text>
        </Animated.View>
     </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffffff" },
  image: { width: 150, height: 150 },
  button: { marginTop: 15, width: 200, alignItems: 'center' },
  animatedButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, width: '100%' },
  buttonText: {fontSize: 16, color: 'white', textAlign: 'center'},
  input: {height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, width: 200, paddingHorizontal: 10,borderRadius: 5}
});
