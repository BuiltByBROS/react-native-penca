import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/Auth';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import DashboardScreen from './src/screens/Dashboard/Dashboard';
import RankingScreen from './src/screens/Ranking/Ranking';

import configureStore from './src/store/configureStore';
import Icon from "react-native-vector-icons/Ionicons";
import {Platform} from "react-native";

const store = configureStore();

// Register Screens

Navigation.registerComponent("react-native-penca.SideDrawer", () => SideDrawer, store, Provider);
Navigation.registerComponent("react-native-penca.DashboardScreen", () => DashboardScreen, store, Provider);
Navigation.registerComponent("react-native-penca.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("react-native-penca.RankingScreen", () => RankingScreen, store, Provider);

// Start a App

Navigation.startSingleScreenApp({
	screen: {
		screen: "react-native-penca.AuthScreen",
		title: "Login"
	},
});

// const openDashboard = () => {
// 	Icon.getImageSource(Platform.OS === "android" ? "md-menu" : "ios-menu", 30)
// 		.then((icon) => {
// 			Navigation.startSingleScreenApp({
// 				screen: {
// 					screen: "react-native-penca.DashboardScreen",
// 					title: "Dashboard",
// 					navigatorButtons: {
// 						leftButtons: [
// 							{
// 								icon: icon,
// 								title: "Menu",
// 								id: "sideDrawerToggle"
// 							}
// 						]
// 					}
// 				},
// 				drawer: {
// 					left: {
// 						screen: "react-native-penca.SideDrawer"
// 					}
// 				}
// 			});
// 		});
// };

export const openDashboard = () => {
	Promise.all([
			Icon.getImageSource(Platform.OS === "android" ? "md-menu" : "ios-menu", 30),
			Icon.getImageSource(Platform.OS === "android" ? "md-football" : "ios-football", 30),
			Icon.getImageSource(Platform.OS === "android" ? "md-podium" : "ios-podium", 30),
	])
		.then(icons => {
			Navigation.startTabBasedApp({
				tabs: [
					{
						screen: 'react-native-penca.DashboardScreen', // unique ID registered with Navigation.registerScreen
						icon: icons[1], // local image asset for the tab icon unselected state (optional on iOS)
						title: 'Expectations', // title of the screen as appears in the nav bar (optional)
						navigatorButtons: {
							leftButtons: [
								{
									icon: icons[0],
									title: "Menu",
									id: "sideDrawerToggle"
								}
							]
						},
					},
					{
						screen: 'react-native-penca.RankingScreen', // unique ID registered with Navigation.registerScreen
						icon: icons[2], // local image asset for the tab icon unselected state (optional on iOS)
						title: 'Expectations', // title of the screen as appears in the nav bar (optional)
						navigatorButtons: {
							leftButtons: [
								{
									icon: icons[0],
									title: "Menu",
									id: "sideDrawerToggle"
								}
							]
						},
					},
				],
				drawer: {
					left: {
						screen: "react-native-penca.SideDrawer"
					}
				},
				animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
			});
		})
};


export default openDashboard;
