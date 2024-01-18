import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as RootNavigation from "../navigation/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBar from "../components/booking/TopBar";
import Facility from "../components/booking/Facility";
import BookHotel from "../components/booking/BookHotel";
import Gallery from "../components/booking/Gallery";
import Info from "../components/booking/Info";

import BASE_URL from "../constants/urls/urls";

const { height } = Dimensions.get("screen");

function Booking({ route }) {
  const renderData = route.params.data;
  const [city, setCity] = useState();
  const [userType, setuserType] = useState();


  useEffect(() => {
    if (renderData) {
      async function fetchData() {
        try {
          const id = renderData.city_id;
          let result = await axios.post(`${BASE_URL}/city`, {
            id: renderData.city_id,
          });
          setCity(result.data.Data.name_en);

          const user_type = await AsyncStorage.getItem("user_type");
          setuserType(user_type);
        } catch (error) {
          console.log("Error: ", error);
        }
      }

      fetchData();
    }
  }, []);

  return (
    <ScrollView>
      <View style={styles.bookingHead}>
        <TopBar leadingAction={() => RootNavigation.pop()} />
        <Gallery image={require("../../assets/booking/portfolio.jpg")} />
      </View>
      <View style={styles.bookingInfo}>
        <Info
          title={renderData.name}
          location={city}
          price={renderData.price}
          rating={5}
          available={renderData.available}
          description={renderData.description}
          readMoreAction={() => {}}
        />
        
      </View>
      <View style={styles.bookingFooter}>
        <View style={styles.facilitiesContainer}>
          {renderData.entrance == 1 ? (
            <Facility
              title="Entrance"
              icon={require("../../assets/booking/entrance.png")}
            />
          ) : null}

          {renderData.graden == 1 ? (
            <Facility
              title="Garden"
              icon={require("../../assets/booking/garden.png")}
            />
          ) : null}

          {renderData.furnished == 1 ? (
            <Facility
              title="Furnish"
              icon={require("../../assets/booking/furniture.png")}
            />
          ) : null}

          {renderData.bathrm == 1 ? (
            <Facility
              title="BathRoom"
              icon={require("../../assets/booking/bathrm.png")}
            />
          ) : null}

          {renderData.parking == 1 ? (
            <Facility
              title="Parking"
              icon={require("../../assets/booking/parking.png")}
            />
          ) : null}

          {renderData.bathrm == 1 ? (
            <Facility
              title="BathRoom"
              icon={require("../../assets/booking/bathrm.png")}
            />
          ) : null}

          {renderData.ac == 1 ? (
            <Facility
              title="AC"
              icon={require("../../assets/booking/ac.png")}
            />
          ) : null}

          {renderData.hotWater == 1 ? (
            <Facility
              title="Water"
              icon={require("../../assets/booking/hotWater.png")}
            />
          ) : null}

          {renderData.electricity == 1 ? (
            <Facility
              title="Power"
              icon={require("../../assets/booking/electricity.png")}
            />
          ) : null}

          {renderData.cableTv == 1 ? (
            <Facility
              title="TV"
              icon={require("../../assets/booking/cableTv.png")}
            />
          ) : null}

          {renderData.fibre == 1 ? (
            <Facility
              title="WIFI"
              icon={require("../../assets/booking/fibre.png")}
            />
          ) : null}

          {/* <Facility
            title="Pool"
            icon={require("../../assets/booking/pool.png")}
          />
          <Facility
            title="Gym"
            icon={require("../../assets/booking/gym.png")}
          />
          <Facility title="TV" icon={require("../../assets/booking/tv.png")} /> */}
        </View>

        {userType == 2 && renderData.available > 0 ? (
          <BookHotel title="BOOK NOW" id={renderData.id} />
        ) : null}
      </View>
    </ScrollView>
  );
}

export default Booking;

const topSectionHeight = height / 1.9;

const styles = StyleSheet.create({
  bookingHead: {
    height: topSectionHeight,
  },
  bookingInfo: {
    zIndex: 2,
    borderWidth: 1,
    marginTop: -120,
    height: height / 2.4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: "8%",
    paddingHorizontal: "10%",
  },
  bookingFooter: {
    zIndex: 2,
    marginTop: -30,
    height: height / 3.5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingVertical: "8%", 
    paddingHorizontal: "10%",
    backgroundColor: "#1a2f3b",
  },
  facilitiesContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
});
