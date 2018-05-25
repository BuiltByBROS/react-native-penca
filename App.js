import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/Auth';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import DashboardScreen from './src/screens/Dashboard/Dashboard';

import configureStore from './src/store/configureStore';
import Icon from "react-native-vector-icons/Ionicons";
import {Platform} from "react-native";

const store = configureStore();

// Register Screens

Navigation.registerComponent("react-native-penca.SideDrawer", () => SideDrawer, store, Provider);
Navigation.registerComponent("react-native-penca.DashboardScreen", () => DashboardScreen, store, Provider);
Navigation.registerComponent("react-native-penca.AuthScreen", () => AuthScreen, store, Provider);

// Start a App

Navigation.startSingleScreenApp({
	screen: {
		screen: "react-native-penca.AuthScreen",
		title: "Login"
	},
});

const openDashboard = () => {
	Icon.getImageSource(Platform.OS === "android" ? "md-menu" : "ios-menu", 30)
		.then((icon) => {
			Navigation.startSingleScreenApp({
				screen: {
					screen: "react-native-penca.DashboardScreen",
					title: "Dashboard",
					navigatorButtons: {
						leftButtons: [
							{
								icon: icon,
								title: "Menu",
								id: "sideDrawerToggle"
							}
						]
					}
				},
				drawer: {
					left: {
						screen: "react-native-penca.SideDrawer"
					}
				}
			});
		});
};


export default openDashboard;
