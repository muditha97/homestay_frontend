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
import { useValidation } from "react-native-form-validator";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Input from "../components/login/Input";
import Button from "../components/login/Button";
import BASE_URL from "../constants/urls/urls";

export default function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: {
        password,
        confirm,
      },
    });

  const handleSubmit = async () => {
    try {
      const val = validate({
        confirm: { required: true, equalPassword: password },
        password: { required: true },
      });

      const user = await AsyncStorage.getItem("user");

      if (val == true) {
        const response = await axios.post(`${BASE_URL}/resetPassword`, {
          password: password,
          user_id:user,
        });

        if(response.data.Success == true){
            Alert.alert("Success", response.data.message, [
                {
                  text: "OK",
                  onPress: () => RootNavigation.navigate("home"),
                },
              ]);
        }
        else{
            Alert.alert("Success", response.data.message, [
                {
                  text: "OK",
                },
              ]);
        }
        setValid(false);
      }
      else {
        setValid(true);
      }
    } catch (error) {
      console.log("Error: ", error);
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
            placeholder="New Password"
            style={styles.inputGroup}
            onChangeText={(password) => setPassword(password)}
            defaultValue={password}
            secureTextEntry={true}
          />
          <View style={{ height: 25 }} />
          <TextInput
            placeholder="Confirm Password"
            style={styles.inputGroup}
            onChangeText={(confirm) => setConfirm(confirm)}
            defaultValue={confirm}
            secureTextEntry={true}
          />
          <View style={{ height: 25 }} />
        </View>
        <Button title="Reset Password" action={() => handleSubmit()} />
        {/* <View style={styles.accountActions}>
          <TouchableWithoutFeedback
            onPress={() => RootNavigation.navigate("login")}
          >
            <Text style={styles.accountActionText}>
              Already have an account?
            </Text>
          </TouchableWithoutFeedback>
        </View> */}
        <View style={{ height: 25 }} />
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
