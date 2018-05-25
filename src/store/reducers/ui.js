import { DATA_LOADING, DATA_LOADING_COMPLETED  } from "../actions/actionTypes";

const initialState = {
	isLoading: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case DATA_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case DATA_LOADING_COMPLETED:
			return {
				...state,
				isLoading: false,
			};
		default:
			return state;
	}
};

export default reducer;
