import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, SafeAreaView, Text } from "react-native";
import axios from "axios";
import BASE_URL from "../constants/urls/urls";

import TopBar from "../components/home/TopBar";
import Search from "../components/home/search";
import Background from "../components/home/Background";
import Bookings from "../components/home/bookings/index";

import * as RootNavigation from "../navigation/RootNavigation";

const { height } = Dimensions.get("screen");

const bookings = [
  {
    title: "Grand Luxury",
    image: require("../../assets/home/bookings/booking-1.png"),
    tag: "Featured",
    members: 500,
    rating: 3,
  },
  {
    title: "Otman Hall",
    image: require("../../assets/home/bookings/booking-2.png"),
    tag: "New",
    members: 200,
    rating: 4,
  },
  {
    title: "Grand Luxury",
    image: require("../../assets/home/bookings/booking-1.png"),
    tag: "Featured",
    members: 500,
    rating: 3,
  },
  {
    title: "Otman Hall",
    image: require("../../assets/home/bookings/booking-2.png"),
    tag: "New",
    members: 200,
    rating: 4,
  },
];

const bookingTabs = [
  { key: "popular", title: "Popular" },
  { key: "top_rated", title: "Top rated" },
  { key: "best_price", title: "Best price" },
  { key: "best_choice", title: "Best for you" },
];

export default function Home() {
  const [homestay, setHomestay] = useState();
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    async function fetchData() {
        try {
            let result = await axios.get(`${BASE_URL}/gethomestay`);
            setHomestay(result.data);
            setIsLoading(false); 
          } catch (error) {
            console.log('Error: ', error);
          }
      }
      fetchData();
      console.log('Homestay: ', homestay);
  }, []);

  return isLoading == true ? null : (
    <SafeAreaView>
      <View style={styles.homeHeader}>
        <Background image={require("../../assets/home/header-bg.png")} />
        <View style={styles.headerWrapper}>
          {/* <TopBar
            menuIcon="bars"
            //profileImage={require('../../assets/home/avatar.png')}
            profileAction={() => RootNavigation.pop()}
          /> */}
          <View style={styles.container}>
            <Text style={styles.title}>Homestays</Text>
          </View>
          {/* <Search
            title="Homestay"
            inputPlaceholder="Search the homestay you desire"
          /> */}
        </View>
      </View>
      <Bookings data={homestay} tabs={bookingTabs} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    height: height / 2,
  },
  headerWrapper: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    color: "#fff",
  },
});
