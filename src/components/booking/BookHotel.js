import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Alert,
  Button,
} from "react-native";
import DatePicker from "react-native-datepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../../constants/urls/urls";
import axios from "axios";
import * as RootNavigation from "../../navigation/RootNavigation";

export default function BookHotel(props) {
  const { title, id, action = () => {} } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState();
  const [dateOut, setDateOut] = useState();
  const [userId, setUserId] = useState();
  const [minDate, setminDate] = useState();

  useEffect(() => {
    const getId = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setUserId(user);
      } catch (error) {}
    };

    getId();

    var utc = new Date().toJSON().slice(0, 10);
    setminDate(utc);
    //console.log(utc);
  }, []);

  const handleBooking = async () => {
    try {
      let result = await axios.post(`${BASE_URL}/bookHomestay`, {
        hotel_id: id,
        user_id: userId,
        check_in: date,
        check_out: dateOut,
      });
      if (result) {
        setModalVisible(!modalVisible);
        Alert.alert("Successful", result.data.message, [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
          },
        ]);
        RootNavigation.navigate("main");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <TouchableHighlight
        onPress={() => setModalVisible(true)}
        style={styles.button}
        underlayColor="#0e0e0e"
      >
        <View style={styles.wrapper}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableHighlight>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Check In</Text>
            <DatePicker
              style={{ width: 200 }}
              date={date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate={minDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={(date) => setDate(date)}
            />

            {date ? (
              <>
                <Text>Check Out</Text>
                <DatePicker
                  style={{ width: 200 }}
                  date={dateOut}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate={date ? date : minDate}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: "absolute",
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      marginLeft: 36,
                    },
                  }}
                  onDateChange={(dateOut) => setDateOut(dateOut)}
                />
              </>
            ) : null}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Button onPress={() => handleBooking()} title="Book" />
              </View>

              <View>
                <Button
                  color={"red"}
                  onPress={() => setModalVisible(!modalVisible)}
                  title="Close"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4a7187",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 7,

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  wrapper: {
    borderRadius: 7,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
