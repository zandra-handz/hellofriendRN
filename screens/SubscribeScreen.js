import * as React from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import {validateEmail} from '../utils';


const SubscribeScreen = () => {
  const [email, setEmail] = React.useState('');

  const isEmailValid = validateEmail(email);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../img/little-lemon-logo-grey.png")}
      />
      <Text style={styles.title}>
        Subscribe to our newsletter for our latest delicious recipes!
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardText={setEmail}
        keyboardType="email-address"
        textCotnentType="emailAddress"
        placeholder={"email"}
      />
      <Button
        onPress={() => {
          Alert.alert("Thank you for subscribing!");
        }}
        disables={!isEmailValid}
      >
        Subscribe
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#333333",
    textAlign: "center",
    fontSize: 20,
  },
  logo: {
    height: 100,
    width: 300,
    resizeMode: "contain",
    justifyContent: "center",
    marginBottom: 32,
  },
  input: {
    height: 40,
    width: "100%",
    marginVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    fontSize: 16, 
    textAlign: "center",
    borderColor: "#EDEFEE",
  },
});

export default SubscribeScreen;
