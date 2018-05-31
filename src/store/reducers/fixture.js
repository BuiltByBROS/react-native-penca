import { SET_FIXTURE, SET_EXPECTATIONS, UPDATE_EXPECTATION } from "../actions/actionTypes";

const initialState = {
	fixture: null,
	expectations: null,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_FIXTURE:
			return {
					...state,
					fixture: action.fixture,
				};
		case SET_EXPECTATIONS:
			return {
					...state,
					expectations: action.expectations,
				};
		case UPDATE_EXPECTATION:
			return {
				...state,
				expectations: {
					...state.expectations,
					[action.group]: {
						...state.expectations[action.group],
						matches: state.expectations[action.group].matches
						.map((value, index) =>  {
							const started =  new Date() > new Date(state.fixture[action.group].matches[action.match].date);
							if (index === action.match && !started) {
								if (action.expectation.hasOwnProperty("home_expected_result"))
									value.home_expected_result = action.expectation.home_expected_result;
								if (action.expectation.hasOwnProperty("away_expected_result"))
									value.away_expected_result = action.expectation.away_expected_result;

								value.home_expected_result !== null && value.away_expected_result !== null ?
									value.isSet = true:
									value.isSet = false;

							} else if (started) {
								value.started = true;
							}
							return value
						})
					}
				}
			};
		default:
			return state;
	}
};

export default reducer;
