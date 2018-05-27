import { AsyncStorage, Platform } from "react-native";
import { Navigation } from "react-native-navigation";

import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";
import { loadingData, loadingDataCompleted } from "./ui";
import openDashboard from "../../../App";

const API_KEY = "AIzaSyDb3QBqFJ9laRl_mAD-O4WarTWPC6AGEf4";

export const tryAuth = (authData, authMode) => {
	return dispatch => {
		dispatch(loadingData());
		let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + API_KEY;
		if (authMode === "signup") {
			url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + API_KEY;
		}

		fetch(url, {
			method: "POST",
			body: JSON.stringify({
				email: authData.email,
				password: authData.password,
				returnSecureToken: true
			}),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.catch(err => {
				console.log(err);
				alert("Authentication failed, please try again!");
				dispatch(loadingDataCompleted());
			})
			.then(res => res.json())
			.then(parsedRes => {
				console.log("USER TOKEN INFO!!!", parsedRes);
				dispatch(loadingDataCompleted());
				if (!parsedRes.idToken) {
					alert("Authentication failed, please try again!");
				} else {
					dispatch(authStoreToken(
						parsedRes.idToken,
						parsedRes.expiresIn,
						parsedRes.refreshToken,
						parsedRes.localId,
						parsedRes.email
					));
					openDashboard();
				}
			});
	};
};

export const authStoreToken = (
	token,
	expiresIn,
	refreshToken,
	userId,
	userEmail
) => {
	return dispatch => {
		const now = new Date();
		const expiryDate = now.getTime() + expiresIn * 1000;
		dispatch(authSetToken(
			token,
			expiryDate,
			userId,
			userEmail
		));
		AsyncStorage.setItem("ap:auth:token", token);
		AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
		AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
		AsyncStorage.setItem("ap:auth:userId", userId);
		AsyncStorage.setItem("ap:auth:userEmail", userEmail);
	}
};

export const authSetToken = (
	token,
	expiryDate,
	userId,
	userEmail,
) => {
	return {
		type: AUTH_SET_TOKEN,
		token: token,
		expiryDate: expiryDate,
		userId: userId,
		userEmail: userEmail,
	}
};

export const authGetToken = () => {
	return (dispatch, getState) => {
		const promise = new Promise((resolve, reject) => {
			const token = getState().auth.token;
			const expiryDate = getState().auth.expiryDate;
			if (!token || new Date(expiryDate) <= new Date()) {
				let fetchedToken;
				let parsedExpiryDate;
				let parsedUserId;
				AsyncStorage.getItem("ap:auth:token")
					.catch(err => reject(err))
					.then(tokenFromStorage => {
						fetchedToken = tokenFromStorage;
						if (!tokenFromStorage) {
							reject();
							return;
						}
						return AsyncStorage.getItem("ap:auth:expiryDate")
					})
					.then(expiryDate => {
						parsedExpiryDate = new Date(parseInt(expiryDate));
						const now = new Date();
						if (parsedExpiryDate < now) {
							return AsyncStorage.getItem("ap:auth:userId")
						} else {
							reject();
						}
					})
					.then((userId) => {
						parsedUserId = userId;
						return AsyncStorage.getItem("ap:auth:userEmail")
					})
					.then((userEmail) => {
						dispatch(authSetToken(
							fetchedToken,
							parsedExpiryDate,
							parsedUserId,
							userEmail
						));
						resolve(fetchedToken);
					})
					.catch(err => reject(err))
			} else {
				resolve(token);
			}
		});
		return promise.catch(err => {
			let fetchedToken;
			return AsyncStorage.getItem("ap:auth:refreshToken")
				.then(refreshToken => {
					return fetch("https://securetoken.googleapis.com/v1/token?key=" + API_KEY, {
						method: "POST",
						body: "grant_type=refresh_token&refresh_token=" + refreshToken,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						}
					})
				})
				.then(res => res.json())
				.then(parsedRes => {
					if (parsedRes.id_token) {
						fetchedToken = parsedRes;
						return AsyncStorage.getItem("ap:auth:userEmail")
					} else {
						dispatch(authClearStorage());
					}
				})
				.then(userEmail => {
					dispatch(authStoreToken(
						fetchedToken.id_token,
						fetchedToken.expires_in,
						fetchedToken.refresh_token,
						fetchedToken.user_id,
						userEmail,
					));
					return fetchedToken.id_token;
				})
		})
			.then(token => {
				if (!token) {
					throw new Error();
				} else {
					return token;
				}
			})
	};
};

export const authAutoSignIn = () => {
	return dispatch => {
		dispatch(authGetToken())
			.then(token => {
				openDashboard();
			})
			.catch(err => console.log("Failed to get the token", err))
	};
};

export const authClearStorage = () => {
	return dispatch => {
		AsyncStorage.removeItem("ap:auth:userId");
		AsyncStorage.removeItem("ap:auth:userEmail");
		AsyncStorage.removeItem("ap:auth:token");
		AsyncStorage.removeItem("ap:auth:expiryDate");
		return AsyncStorage.removeItem("ap:auth:refreshToken");
	};
};

export const authLogout = () => {
	return dispatch => {
		dispatch(authClearStorage())
			.then(() => {
				Navigation.startSingleScreenApp({
					screen: {
						screen: "react-native-penca.AuthScreen",
						title: "Login"
					}
				});
			});
		dispatch(authRemoveToken());
	};
};

export const authRemoveToken = () => {
	return {
		type: AUTH_REMOVE_TOKEN,
	}
};
