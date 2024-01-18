import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  Picker,
  CheckBox,
  Alert,
} from "react-native";
import Background from "../../components/home/Background";
import ButtonCus from "../../components/login/Button";
import { useValidation } from "react-native-form-validator";
import axios from "axios";
import BASE_URL from "../../constants/urls/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function Bookmarks() {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [rooms, setRooms] = useState();
  const [price, setPrice] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [paymentTerm, setPaymentTerm] = useState();
  const [userId, setUserId] = useState();
  const [city, setCity] = useState();
  const [allCities, setAllCities] = useState();
  const [entrance, setEntrance] = useState(false);
  const [graden, setGarden] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [bathrm, setBathrm] = useState(false);
  const [parking, setParking] = useState(false);
  const [ac, setAC] = useState(false);
  const [hotWater, setHotWater] = useState(false);
  const [electricity, setElectricity] = useState(false);
  const [cableTv, setCableTv] = useState(false);
  const [fibre, setFibre] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await axios.get(`${BASE_URL}/cities`);
        setAllCities(result.data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();
  }, []);

  const { validate, isFieldInError, getErrorsInField, getErrorMessages } =
    useValidation({
      state: {
        name,
        rooms,
        price,
        paymentMethod,
      },
    });

  const handleSubmit = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      console.log("User: ");
      const val = validate({
        name: { required: true },
        description: { required: true },
        rooms: { required: true, numbers: true },
        price: { required: true, numbers: true },
        paymentMethod: { numbers: true, required: true },
      });
      console.log("User: ", val);

      if (val == true) {
        const response = await axios.post(`${BASE_URL}/addhomestay`, {
          name: name,
          description: description,
          rooms: rooms,
          price: price,
          paymentMethod: paymentMethod,
          city: city,
          available: rooms,
          rating: 5,
          user_id: user,
          entrance: entrance,
          graden: graden,
          furnished: furnished,
          bathrm: bathrm,
          parking: parking,
          ac: ac,
          hotWater: hotWater,
          electricity: electricity,
          cableTv: cableTv,
          fibre: fibre,
        });

        if (response.data.Success == true) {
          setName("");
          setPrice("");
          setRooms("");
          setDescription("");
          setCity(null);
          setPaymentMethod(null);
          setPaymentTerm(null);
          setEntrance(false),
            setGarden(false),
            setFurnished(false),
            setBathrm(false),
            setParking(false),
            setAC(false),
            setHotWater(false),
            setElectricity(false),
            setCableTv(false),
            setFibre(false),

            Alert.alert("Successfull", response.data.message, [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
              },
            ]);
        } else {
          Alert.alert("Error", response.data.message, [
            {
              text: "OK",
            },
          ]);
        }

        setValid(false);
      } else {
        setValid(true);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const getCities = () => {
    if (allCities) {
      const cities = allCities.map((items) => {
        return <Picker.Item label={items.name_en} value={items.id} />;
      });

      return cities;
    }
  };

  return (
    <ScrollView>
      <View style={styles.homeHeader}>
        <Background image={require("../../../assets/home/header-bg.png")} />
        <View style={styles.headerWrapper}>
          <View style={styles.container}>
            <Text style={styles.title}>Add Homestay</Text>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 100 }}>
        <View style={{ height: 15 }} />
        <TextInput
          placeholder="Name"
          style={styles.inputGroup}
          onChangeText={(name) => setName(name)}
          defaultValue={name}
        />

        <View style={{ height: 15 }} />
        <TextInput
          placeholder="Description"
          style={styles.inputGroup}
          numberOfLines={4}
          onChangeText={(description) => setDescription(description)}
          defaultValue={description}
        />

        <View style={{ height: 15 }} />
        <TextInput
          placeholder="Price"
          style={styles.inputGroup}
          onChangeText={(price) => setPrice(price)}
          defaultValue={price}
          keyboardType="number-pad"
        />

        <View style={{ height: 15 }} />

        <Picker
          selectedValue={rooms}
          style={{ height: 50, width: 250, marginLeft: 15 }}
          onValueChange={(rooms) => setRooms(rooms)}
        >
          <Picker.Item label="Select no of rooms" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="8" value="8" />
          <Picker.Item label="9" value="9" />
          <Picker.Item label="10" value="10" />
        </Picker>

        <View style={{ height: 15 }} />
        <Picker
          selectedValue={paymentMethod}
          style={{ height: 50, width: 250, marginLeft: 15 }}
          onValueChange={(itemValue, itemIndex) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Payment Method" />
          <Picker.Item label="Cash" value="1" />
          <Picker.Item label="Card and Cash" value="2" />
        </Picker>

        <View style={{ height: 15 }} />
        <Picker
          selectedValue={city}
          style={{ height: 50, width: 250, marginLeft: 15 }}
          onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
        >
          {getCities()}
        </Picker>

        <View style={styles.checkBoxContainer}>
          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>Separate Entrance</Text>

            <CheckBox
              value={entrance}
              onValueChange={setEntrance}
              style={styles.checkbox}
            />
          </View>

          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>OUTDOOR GARDEN</Text>

            <CheckBox
              value={graden}
              onValueChange={setGarden}
              style={styles.checkbox}
            />
          </View>
        </View>

        <View style={styles.checkBoxContainer}>
          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>FULLY FURNISHED</Text>

            <CheckBox
              value={furnished}
              onValueChange={setFurnished}
              style={styles.checkbox}
            />
          </View>

          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>Attach Bathroom</Text>

            <CheckBox
              value={bathrm}
              onValueChange={setBathrm}
              style={styles.checkbox}
            />
          </View>
        </View>

        <View style={styles.checkBoxContainer}>
          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>Parking Facility</Text>

            <CheckBox
              value={parking}
              onValueChange={setParking}
              style={styles.checkbox}
            />
          </View>

          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>Air Conditioning</Text>

            <CheckBox
              value={ac}
              onValueChange={setAC}
              style={styles.checkbox}
            />
          </View>
        </View>

        <View style={styles.checkBoxContainer}>
          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>HOT WATER</Text>

            <CheckBox
              value={hotWater}
              onValueChange={setHotWater}
              style={styles.checkbox}
            />
          </View>

          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>Electricity / Water</Text>

            <CheckBox
              value={electricity}
              onValueChange={setElectricity}
              style={styles.checkbox}
            />
          </View>
        </View>

        <View style={styles.checkBoxContainer}>
          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>CABLE/SAT TV</Text>

            <CheckBox
              value={cableTv}
              onValueChange={setCableTv}
              style={styles.checkbox}
            />
          </View>

          <View style={styles.checkBoxRow}>
            <Text style={styles.checkbox}>Wi-Fi / Fibre</Text>

            <CheckBox
              value={fibre}
              onValueChange={setFibre}
              style={styles.checkbox}
            />
          </View>
        </View>

        <View style={{ height: 15 }} />
        <ButtonCus
          title="Submit"
          action={() => handleSubmit()}
          //onPress={() => console.log('sdasdasdas')}
        />
        {valid == true ? (
          <View style={styles.validationMessage}>
            <Text>{getErrorMessages()}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    height: height / 4,
  },
  headerWrapper: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "#fff",
  },
  container: {
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
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
  checkbox: {
    alignSelf: "center",
  },
  checkBoxContainer: {
    display: "flex",
    flexDirection: "row",
    //justifyContent:'center'
    marginTop: 20,
  },
  checkBoxRow: {
    width: ((width /2) * 80) /100,
    display: "flex",
    flexDirection: "row",
    justifyContent:'space-between',
    marginLeft: 25,
    marginTop: 20,
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
