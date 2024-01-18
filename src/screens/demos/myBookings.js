import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Button,
  Alert,
  Modal,
} from "react-native";
import Placeholder from "../../components/demo/Placeholder";
import axios from "axios";
import BASE_URL from "../../constants/urls/urls";
import Background from "../../components/home/Background";
import StarRating from "react-native-star-rating";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-datepicker";

import * as RootNavigation from "../../navigation/RootNavigation";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function MyBookings() {
  const [homestay, setHomestay] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [today, setToday] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDate, setModalVisibleDate] = useState(false);
  const [starCount, setStarCount] = useState();
  const [itemRender, setItemRender] = useState();
  const [date, setDate] = useState();
  const [dateOut, setDateOut] = useState();
  const [minDate, setminDate] = useState();
  const [itemUpdate, setItemUpdate] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        let user_id = await AsyncStorage.getItem("user");
        let result = await axios.post(`${BASE_URL}/getBookingsById`, {
          id: user_id,
        });
        setHomestay(result.data);

        const d = new Date().toISOString().slice(0, 10);
        setToday(d);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();

    var utc = new Date().toJSON().slice(0, 10);
    setminDate(utc);
  }, []);

  const showData = () => {
    if (homestay) {
      const views = homestay.map((item) => {
        return (
          <View style={styles.homestaySingleView}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 30, marginLeft: 10, marginBottom: 5 }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 20, marginRight: 10 }}>
                LKR {item.price}
              </Text>
            </View>

            <View style={styles.ratingsContainer}>
              <Text style={styles.sectionAvailable}>
                Chek In : {item.check_in}
              </Text>

              <Text style={styles.sectionAvailable}>
                Chek Out : {item.check_out}
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 40,
                  width: "90%",
                }}
              >
                <View style={{ width: "30%" }}>
                  <Button title="Edit" onPress={() => handleModal(item)} />
                </View>

                {item.rated == 0 ? (
                  <View style={{ width: "30%" }}>
                    <Button title="Rate" onPress={() => handleRatings(item)} />
                  </View>
                ) : null}

                <View style={{ width: "30%" }}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      cancelBooking(item);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        );
      });
      return views;
    }
  };

  const cancelBooking = (e) => {
    try {
      Alert.alert("Warning", "Are you sure you want to cancel this booking?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleCancel(e),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (e) => {
    try {
      const result = await axios.post(`${BASE_URL}/cancelBooking`, {
        id: e.book_id,
        hotel_id:e.hotel_id,
      });

      if (result.data.Success == true) {
        async function fetchData() {
          try {
            let user_id = await AsyncStorage.getItem("user");
            let result = await axios.post(`${BASE_URL}/getBookingsById`, {
              id: user_id,
            });
            setHomestay(result.data);
            setRefreshing(false);
          } catch (error) {
            console.log("Error: ", error);
          }
        }

        fetchData();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    async function fetchData() {
      try {
        let user_id = await AsyncStorage.getItem("user");
        let result = await axios.post(`${BASE_URL}/getBookingsById`, {
          id: user_id,
        });
        setHomestay(result.data);
        setRefreshing(false);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();
  };

  const handleRatings = (item) => {
    setItemRender(item);
    setModalVisible(!modalVisible);
  };

  const submitRating = async () => {
    try {
      let result = await axios.post(`${BASE_URL}/ratings`, {
        hotel_id: itemRender.hotel_id,
        rate: starCount,
        book_id:itemRender.book_id,
      });

      if(result.data.success == true){
        async function fetchData() {
          try {
            let user_id = await AsyncStorage.getItem("user");
            let result = await axios.post(`${BASE_URL}/getBookingsById`, {
              id: user_id,
            });
            setHomestay(result.data);
            setRefreshing(false);
          } catch (error) {
            console.log("Error: ", error);
          }
        }
    
        fetchData();
      }

      setModalVisible(false);
    } catch (error) {}
  };

  const handleModal = (item) => {
    setItemUpdate(item);
    setDate(item.check_in);
    setDateOut(item.check_out);
    setModalVisibleDate(!modalVisibleDate);
  };

  const handleBookingUpdate = async () => {
    try {
      let result = await axios.post(`${BASE_URL}/updateBooking`, {
        id: itemUpdate.book_id,
        check_in: date,
        check_out: dateOut,
      });

      if (result.data.success == true) {
        async function fetchData() {
          try {
            let user_id = await AsyncStorage.getItem("user");
            let result = await axios.post(`${BASE_URL}/getBookingsById`, {
              id: user_id,
            });
            setHomestay(result.data);

            const d = new Date().toISOString().slice(0, 10);
            setToday(d);
          } catch (error) {
            console.log("Error: ", error);
          }
        }

        fetchData();
        setModalVisibleDate(!modalVisibleDate);
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
      } else {
        Alert.alert("Error", result.data.message, [
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
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={refresh} refreshing={refreshing} />
      }
    >
      <View style={styles.homeHeader}>
        <Background image={require("../../../assets/home/header-bg.png")} />
        <View style={styles.headerWrapper}>
          <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 80 }}>{showData()}</View>

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
            <View>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={starCount}
                selectedStar={(rating) => setStarCount(rating)}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 40,
              }}
            >
              <View>
                <Button onPress={() => submitRating()} title="Submit" />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleDate}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisibleDate(!modalVisibleDate);
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
                <Button onPress={() => handleBookingUpdate()} title="Book" />
              </View>

              <View>
                <Button
                  color={"red"}
                  onPress={() => setModalVisibleDate(!modalVisibleDate)}
                  title="Close"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  homestaySingleView: {
    backgroundColor: "#808080",
    width: (width / 100) * 95,
    height: 200,
    borderRadius: 9,
    marginTop: 20,
    alignSelf: "center",
  },
  ratingsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingsWrapper: {
    width: 94,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  sectionAvailable: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "red",
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
});
