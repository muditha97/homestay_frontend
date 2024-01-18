import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Button,
  Alert
} from "react-native";
import Placeholder from "../../components/demo/Placeholder";
import axios from "axios";
import BASE_URL from "../../constants/urls/urls";
import Background from "../../components/home/Background";
import StarRating from "react-native-star-rating";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as RootNavigation from "../../navigation/RootNavigation";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function BookingProvider() {
  const [homestay, setHomestay] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let user_id = await AsyncStorage.getItem('user');
        
        let result = await axios.post(`${BASE_URL}/getBookingsProvider`,{id:user_id});

        setHomestay(result.data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();
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
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  marginRight: 25,
                  marginTop: 40,
                }}
              >
                  <View style={{ width: "30%" }}>
                  <Button
                    title="Done"
                    onPress={() =>
                        handleDone(item)
                    }
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

  const handleDone = (item) => {
    Alert.alert("Warning", "Are you sure you want to cancel this booking?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => doneBooking(item),
        },
      ]);
  }

  const doneBooking = async (item) => {
      console.log('Item: ', item);
      try {
          let result = await axios.post(`${BASE_URL}/bookingDone`,{hotel_id:item.hotel_id, book_id:item.book_id});

          async function fetchData() {
            try {
              let user_id = await AsyncStorage.getItem('user');
              
              let result = await axios.post(`${BASE_URL}/getBookingsProvider`,{id:user_id});
              setHomestay(result.data);
              setRefreshing(false);
            } catch (error) {
              console.log("Error: ", error);
            }
          }
      
          fetchData();

          
      } catch (error) {
          
      }
  }

  const refresh = () => {
    setRefreshing(true);
    async function fetchData() {
      try {
        let user_id = await AsyncStorage.getItem('user');
        
        let result = await axios.post(`${BASE_URL}/getBookingsProvider`,{id:user_id});
        setHomestay(result.data);
        setRefreshing(false);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();
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
      <View style={{marginBottom:80}}>
      {showData()}
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
});
