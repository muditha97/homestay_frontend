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

export default function Account() {
  const [homestay, setHomestay] = useState();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
          let user_id = await AsyncStorage.getItem('user');
        let result = await axios.post(`${BASE_URL}/getHomestayById`,{
            id:user_id
        });
        setHomestay(result.data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (item) => {
    try {
      Alert.alert("Warning", "Are you sure you want to delete this homestay?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteHomestay(item),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHomestay =async (item) => {
    try {
      const result = await axios.post(`${BASE_URL}/deleteHomestay`, {
        id: item.id,
      });

      if (result.data.success == true) {
        async function fetchData() {
          try {
              let user_id = await AsyncStorage.getItem('user');
            let result = await axios.post(`${BASE_URL}/getHomestayById`,{
                id:user_id
            });
            setHomestay(result.data);
          } catch (error) {
            console.log("Error: ", error);
          }
        }
    
        fetchData();
      }
      
    } catch (error) {
      
    }

  }

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
                marginTop:10
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
              <View style={styles.ratingsWrapper}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={item.rating}
                  starSize={14}
                  fullStar="star"
                  emptyStar="star"
                  fullStarColor="#dbb16c"
                />
              </View>
              <Text style={styles.sectionTitle}>
                {item.rating} Star Reviews
              </Text>

              <Text style={styles.sectionAvailable}>
                {item.available} Rooms available
              </Text>

              {/* <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  marginRight:25,
                  marginTop:40
                }}
              > */}
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
                  <Button title="Delete" color={'red'} onPress={() => handleDelete(item)} />
                </View>

                <View style={{ width: "30%" }}>
                  <Button title="Edit" color={'green'} onPress={() => RootNavigation.navigate("editHomestay", { data: item })} />
                </View>
                
                <View style={{ width: "30%" }}>
                  
                  <Button
                    title="View Details"
                    onPress={() =>
                      RootNavigation.navigate("booking", { data: item })
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

  const refresh = () => {
    setRefreshing(true);
    async function fetchData() {
      try {
        let result = await axios.get(`${BASE_URL}/gethomestay`);
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
            <Text style={styles.title}>My Homestays</Text>
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
