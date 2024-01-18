import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Button,
  Pressable,
} from "react-native";
import Placeholder from "../../components/demo/Placeholder";
import axios from "axios";
import BASE_URL from "../../constants/urls/urls";
import Background from "../../components/home/Background";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as RootNavigation from "../../navigation/RootNavigation";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

export default function Settings() {
  const [homestay, setHomestay] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      let result = await axios.post(`${BASE_URL}/logout`, {
        token: user,
      });

      if(result.data.success == true){
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("user_type");
        RootNavigation.navigate("login");
      }
      
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.homeHeader}>
        <Background image={require("../../../assets/home/header-bg.png")} />
        <View style={styles.headerWrapper}>
          <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 80 }}>
        <View style={styles.container1}>
          <View style={styles.flatListView}>
            <Pressable onPress={() => RootNavigation.navigate("forgotPassword")}>
              <Text style={{ fontSize: 20 }}>Change Password</Text>
            </Pressable>
          </View>
          <View style={styles.flatListView}>
            <Pressable onPress={handleLogout}>
              <Text style={{ fontSize: 20 }}>Logout</Text>
            </Pressable>
          </View>
        </View>
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
  container1: {
    flex: 1,
    paddingTop: 22,
  },
  flatListView: {
    padding: 10,
    height: 44,
    marginLeft: 20,
  },
});
