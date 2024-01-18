import * as React from "react";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "./RootNavigation";

import TabBar from "../navigation/tabBar";

import Home from "../screens/home";
import Login from "../screens/login";
import Booking from "../screens/booking";
import Account from "../screens/demos/account";
import Location from "../screens/demos/location";
import Bookmarks from "../screens/demos/bookmarks";
import Settings from "../screens/demos/settings";
import Register from "../screens/register";
import ForgotPassword from "../screens/forgot-password";
import MyBookings from "../screens/demos/myBookings";
import BookingsProvider from "../screens/demos/bookingProvider";
import EditHomestay from "../screens/demos/editHomestay";

const Stack = createStackNavigator();

function Main() {
  const Tab = createBottomTabNavigator();
  const [userType, setUserType] = useState();
  

  useEffect(async () => {
    const getType = async () => {
      try {
        const user_type = await AsyncStorage.getItem("user_type");
        setUserType(user_type);

        const user_token = await AsyncStorage.getItem("token");
        setToken(user_token);
      } catch (error) {}
    };

    getType();
  }, []);

  return userType == 1 ?  (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={(props) => <TabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: "#fff" }}
    >
      <Tab.Screen name="home" component={Home} />
      <Tab.Screen name="All" component={BookingsProvider} />
      <Tab.Screen name="add homestay" component={Bookmarks} />
      <Tab.Screen name="account" component={Account} />
      <Tab.Screen name="settings" component={Settings} />
    </Tab.Navigator>
  ) : (<Tab.Navigator
  initialRouteName="home"
  tabBar={(props) => <TabBar {...props} />}
  sceneContainerStyle={{ backgroundColor: "#fff" }}
>
  <Tab.Screen name="home" component={Home} />
  <Tab.Screen name="All" component={Location} />
  <Tab.Screen name="account" component={MyBookings} />
  <Tab.Screen name="settings" component={Settings} />
</Tab.Navigator>
);
}

export default () => {
  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(async () => {
    
    const getType = async (e) => {
      try {
        //e.preventDefault();
        const user_token = await AsyncStorage.getItem("token");
        setToken(user_token);
        setIsLoading(false);
      } catch (error) {}
    };

    getType();
    

  }, []);

  return isLoading == true ? null : (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator initialRouteName={token != undefined ? 'main' : 'login'}>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main"
        component={Main}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="booking"
        component={Booking}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editHomestay"
        component={EditHomestay}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);}
