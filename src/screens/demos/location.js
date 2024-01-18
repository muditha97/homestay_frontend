import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Button,
  TextInput,
} from "react-native";
import Placeholder from "../../components/demo/Placeholder";
import axios from "axios";
import BASE_URL from "../../constants/urls/urls";
import Background from "../../components/home/Background";
import StarRating from "react-native-star-rating";

import * as RootNavigation from "../../navigation/RootNavigation";
import Search from "../../components/home/search";
import Icon from "react-native-vector-icons/FontAwesome5";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function Location() {
  const [homestay, setHomestay] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setsearchText] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await axios.get(`${BASE_URL}/gethomestay`);
        setHomestay(result.data);
        console.log("Error: ", result.data);
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
        setsearchText(undefined);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchData();
  };

  const handleSearch = async () => {
    try {
      let result = await axios.post(`${BASE_URL}/searchHomestay`, {
        text: searchText,
      });
      setHomestay(result.data);
      console.log("Error: ", error);
    } catch (error) {}
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
            <Text style={styles.title}>All Homestays</Text>
            <View style={styles.inputContainer}>
              <Icon name="search" color="#1a303d" size={20} />
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder={"Search the homestay you desire"}
                  style={styles.input}
                  onChangeText={(text) => setsearchText(text)}
                  value={searchText}
                />
              </View>
            </View>
            {searchText != undefined ? (
              <Button title="Search" onPress={() => handleSearch()} />
            ) : null}
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 80 }}>{showData()}</View>
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
  inputContainer: {
    height: 45,
    width: "90%",
    marginTop: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  inputWrapper: {
    width: "70%",
    marginLeft: 10,
  },
  input: {
    fontSize: 13,
    color: "#1a303d",
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
