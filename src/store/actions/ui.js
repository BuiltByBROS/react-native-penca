import { DATA_LOADING, DATA_LOADING_COMPLETED } from "./actionTypes";

export const loadingData = () => {
	return {
		type: DATA_LOADING,
	}
};

export const loadingDataCompleted = () => {
	return {
		type: DATA_LOADING_COMPLETED,
	}
};
