import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";

import * as RootNavigation from "../navigation/RootNavigation";
import axios from "axios";

import Button from "../components/login/Button";
import BASE_URL from "../constants/urls/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useValidation } from "react-native-form-validator";

export default function Login() {
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState();
  const [valid, setValid] = useState(false);

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: {
        email,
        password,
      },
    });

  const handleSubmit = async () => {
    //RootNavigation.navigate("main");
    try {
      const val = validate({
        password: { required: true },
        email: { email: true, required: true },
      });

      if (val == true) {
        const response = await axios.post(`${BASE_URL}/login`, {
          email: email,
          password: password,
        });

        console.log("Response: ", response);

        if (response.data.success == true) {
          await AsyncStorage.setItem("token", response.data.token);
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.user.id)
          );
          await AsyncStorage.setItem(
            "user_type",
            JSON.stringify(response.data.user.user_type)
          );
          RootNavigation.navigate("main");
        } else {
          Alert.alert("Error", response.data.message[0], [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
            },
          ]);
        }
        setValid(false);
      } else {
        setValid(true);
      }
    } catch (err) {}
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        setToken(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="cover"
        style={styles.backgroundImage}
        blurRadius={2}
        source={require("../../assets/login/background.jpg")}
      />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Homestay</Text>
        <Text style={styles.subtitle}>Easy To Book Your Homestay</Text>
        <View style={styles.inputsContainer}>
          <TextInput
            placeholder="Email Address"
            style={styles.inputGroup}
            onChangeText={(email) => setEmail(email)}
            defaultValue={email}
          />
          <View style={{ height: 25 }} />
          <TextInput
            placeholder="Password"
            style={styles.inputGroup}
            onChangeText={(password) => setPassword(password)}
            defaultValue={password}
            secureTextEntry={true}
          />
        </View>
        <Button
          title="Sign In"
          //action={() => RootNavigation.navigate("main")}
          action={() => handleSubmit()}
        />

        <View style={styles.accountActions}>
          {/* <TouchableWithoutFeedback
            onPress={() => RootNavigation.navigate("forgotPassword")}
          >
            <Text style={styles.accountActionText}>Forgot Password?</Text>
          </TouchableWithoutFeedback> */}
          <TouchableWithoutFeedback
            onPress={() => RootNavigation.navigate("register")}
          >
            <Text style={styles.accountActionText}>No Account Yet?</Text>
          </TouchableWithoutFeedback>
        </View>
        {valid == true ? (
          <View style={styles.validationMessage}>
            <Text>{getErrorMessages()}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  backgroundImage: {},
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 9,
    paddingHorizontal: "8%",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: "#fff",
    textAlign: "center",
  },
  inputsContainer: {
    paddingVertical: 30,
    width: "100%",
  },
  accountActions: {
    width: "100%",
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  accountActionText: {
    color: "#fff",
    fontSize: 13,
  },
  inputGroup: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "rgba(225, 225, 225, 0.5)",
  },
  errorMessage: {
    color: "red",
    marginLeft: 20,
    fontSize: 20,
  },
  validationMessage: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "rgba(225, 225, 225, 0.5)",
  },
});
