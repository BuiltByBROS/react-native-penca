import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, TextInput, StyleSheet } from "react-native";

import NumericInput, { calcSize } from 'react-native-numeric-input';
import { updateExpectation } from "../../store/actions/fixture";

class Match extends Component {

	render() {

		const {
			fixture,
			expectations,
			group,
			match,
			home_team,
			away_team,
			onUpdateExpectation,
		} = this.props;

		const editable = !fixture[group].matches[match].finished &&
											new Date() < new Date(fixture[group].matches[match].date);

		return (
			<View style={styles.match}>
				<View style={styles.team}>
					<Text>{home_team.emojiString}</Text>
					<Text>{home_team.fifaCode}</Text>
				</View>
				<View style={styles.inputContainer}>

					{/*<TextInput*/}
					{/*style={styles.input}*/}
					{/*keyboardType='numeric'*/}
					{/*value={expectations[group].matches[match].home_expected_result.toString() || ""}*/}
					{/*onChange={(value) => onUpdateExpectation(*/}
					{/*group,*/}
					{/*match,*/}
					{/*{ home_expected_result: value }*/}
					{/*)}*/}
					{/*editable={false}*/}
					{/*/>*/}

					{/*<TextInput*/}
					{/*style={styles.input}*/}
					{/*keyboardType='numeric'*/}
					{/*value={expectations[group].matches[match].away_expected_result.toString() || ""}*/}
					{/*onChange={(value) => onUpdateExpectation(*/}
					{/*group,*/}
					{/*match,*/}
					{/*{ away_expected_result: value }*/}
					{/*)}*/}
					{/*editable={false}*/}
					{/*/>*/}

					<NumericInput
						editable={editable}
						value={expectations[group].matches[match].home_expected_result}
						onChange={(value) => onUpdateExpectation(
							group,
							match,
							{ home_expected_result: value }
						)}
						containerStyle={{margin: 5}}
						valueType='integer'
						initValue={-1}
						minValue={-1}
						totalWidth={calcSize(150)}
						totalHeight={calcSize(100)}
						iconSize={calcSize(25)}
						rounded
						textColor='black'
						iconStyle={{ color: 'white' }}
						rightButtonBackgroundColor='#eee'
						leftButtonBackgroundColor='#eee'
					/>
					<NumericInput
						editable={editable}
						value={expectations[group].matches[match].away_expected_result}
						onChange={(value) => onUpdateExpectation(
							group,
							match,
							{ away_expected_result: value }
						)}
						containerStyle={{margin: 5}}
						valueType='integer'
						initValue={-1}
						minValue={-1}
						totalWidth={calcSize(150)}
						totalHeight={calcSize(100)}
						iconSize={calcSize(25)}
						rounded
						textColor='black'
						iconStyle={{ color: 'white' }}
						rightButtonBackgroundColor='#eee'
						leftButtonBackgroundColor='#eee'
					/>
				</View>
				<View style={styles.team}>
					<Text>{away_team.fifaCode}</Text>
					<Text>{away_team.emojiString}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	match: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	team: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		flex: 1,
	},
	inputContainer: {
		width: 150,
		flexDirection: "row",
		justifyContent: "center",
		margin: 10,
	},
	input: {
		margin: 5,
		// width: 40,
		// borderColor: "#eee",
		// borderWidth: 1,
	}
});


const mapStateProps = state => {
	return {
		fixture: state.fixture.fixture,
		expectations: state.fixture.expectations,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onUpdateExpectation: (group, match, expectation) => {dispatch(updateExpectation(group, match, expectation))}
	}
};

export default connect(mapStateProps, mapDispatchToProps)(Match);
