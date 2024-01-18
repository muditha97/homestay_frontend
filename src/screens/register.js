import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Picker,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useValidation } from "react-native-form-validator";

import * as RootNavigation from "../navigation/RootNavigation";

import axios from "axios";
import Button from "../components/login/Button";
import BASE_URL from "../constants/urls/urls";

export default function Register() {
  //const [passwordSecure, setPasswordSecure] = useState(true);
  const [selectedValue, setSelectedValue] = useState(1);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [country, setCountry] = useState("Select");
  const [countryList, setCountryList] = useState();
  const [valid, setValid] = useState(false);

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: {
        fName,
        lName,
        email,
        telephone,
        password,
        passwordConfirm,
        selectedValue,
        country,
      },
    });

  const handleSubmit = async () => {
    try {
      const val = validate({
        fName: { minlength: 3, maxlength: 20, required: true },
        lName: { minlength: 3, maxlength: 20, required: true },
        email: { email: true },
        telephone: { numbers: true, minlength: 10, maxlength:15, required:true },
        password:{hasNumber:true, hasUpperCase:true, hasLowerCase:true, hasSpecialCharacter:true},
        passwordConfirm: { equalPassword: password },
        country: { numbers: true, required: true },
      });

      if (val == true) {
        const response = await axios.post(`${BASE_URL}/register`, {
          first_name: fName,
          last_name: lName,
          email: email,
          telephone: telephone,
          password: password,
          user_type: selectedValue,
          country: country,
        });

        if(response.data.Success == true){
          Alert.alert("Success", response.data.message, [
            {
              text: "OK",
              onPress: () => RootNavigation.navigate("login"),
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
    } catch (err) {}
  };

  

  useEffect(() => {
    const getCountries = async () => {
      const result = await axios.get(`${BASE_URL}/countries`);
      setCountryList(result.data);
    };
    
    getCountries();
    
  }, []);

  return countryList ? (
    <ScrollView>
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
              style={styles.inputGroup}
              placeholder="First Name"
              onChangeText={(fName) => setFName(fName)}
              defaultValue={fName}
            />
            <View style={{ height: 15 }} />
            <TextInput
              placeholder="Last Name"
              style={styles.inputGroup}
              onChangeText={(lName) => setLName(lName)}
              defaultValue={lName}
            />
            <View style={{ height: 15 }} />
            <TextInput
              placeholder="Email"
              style={styles.inputGroup}
              onChangeText={(email) => setEmail(email)}
              defaultValue={email}
            />
            <View style={{ height: 15 }} />
            <TextInput
              placeholder="Password"
              style={styles.inputGroup}
              onChangeText={(password) => setPassword(password)}
              defaultValue={password}
              secureTextEntry={true}
            />

            <View style={{ height: 15 }} />
            <TextInput
              placeholder="Confirm Password"
              style={styles.inputGroup}
              onChangeText={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
              defaultValue={passwordConfirm}
              secureTextEntry={true}
            />
            {isFieldInError("passwordConfirm") &&
              getErrorsInField("passwordConfirm").map((errorMessage) => (
                <Text>{errorMessage}</Text>
              ))}

            <View style={{ height: 15 }} />
            <TextInput
              placeholder="Telephone"
              style={styles.inputGroup}
              onChangeText={(telephone) => setTelephone(telephone)}
              defaultValue={telephone}
            />

            <View style={{ height: 25 }} />

            <Picker
              selectedValue={country}
              
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue, itemIndex) =>
                setCountry(itemValue)
              }
            >
              {
                countryList.map((item) => {
                  return <Picker.Item label={item.country_name} value={item.id} />
                })
              }
            
            </Picker>

            <View style={{ height: 15 }} />
            <Picker
              selectedValue={selectedValue}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
            >
              <Picker.Item label="Provider" value="1" />
              <Picker.Item label="Finder" value="2" />
            </Picker>
          </View>
          <Button
            title="Sign Up"
            action={() => handleSubmit()}
            //onPress={() => console.log('sdasdasdas')}
          />
          <View style={{ height: 15 }} />

          {valid == true ? (
          <View style={styles.validationMessage}>
            <Text>{getErrorMessages()}</Text>
          </View>
        ) : null}

          <View style={styles.accountActions}>
            <TouchableWithoutFeedback
              onPress={() => RootNavigation.navigate("login")}
            >
              <Text style={styles.accountActionText}>
                Already have an account?
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </ScrollView>
  ) : null;
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
