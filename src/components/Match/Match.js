import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { updateExpectation } from "../../store/actions/fixture";

class Match extends Component {

	handleExpectationUpdate = (value, team) => {
		if (parseInt(value) && value >= 0) {
			this.props.onUpdateExpectation(
				this.props.group,
				this.props.match,
				{ [team]: parseInt(value) }
			)
		}
	};

	render() {

		const {
			group,
			match,
			expectations,
			home_team,
			away_team,
			home_result,
			away_result,
			finished,
			date,
		} = this.props;

		const editable = !finished && new Date() < new Date(date);

		return (
			<View style={styles.container}>
				<View style={styles.expectation}>
					<View style={styles.team}>
						<Text style={styles.emojiString}>{home_team.emojiString}</Text>
						<Text>{home_team.fifaCode}</Text>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							keyboardType='numeric'
							editable={editable}
							style={editable ? styles.input : [styles.input, styles.inputDisabled]}
							value={
								expectations[group].matches[match].home_expected_result >= 0 ?
									expectations[group].matches[match].home_expected_result.toString() : ""
							}
							onChangeText={value => this.handleExpectationUpdate(value, "home_expected_result")}
						/>
						<TextInput
							keyboardType='numeric'
							editable={editable}
							style={editable ? styles.input : [styles.input, styles.inputDisabled]}
							value={
								expectations[group].matches[match].away_expected_result >= 0 ?
									expectations[group].matches[match].away_expected_result.toString() : ""
							}
							onChangeText={value => this.handleExpectationUpdate(value, "away_expected_result")}
						/>
					</View>
					<View style={styles.team}>
						<Text>{away_team.fifaCode}</Text>
						<Text style={styles.emojiString}>{away_team.emojiString}</Text>
					</View>
				</View>
				{ finished ?
						<Text style={{textAlign: "center"}}>Finished{"\n"}{home_result}:{away_result}</Text> :
						<Text style={{textAlign: "center"}}>{new Date(date).toLocaleDateString()}{"\n"}{new Date(date).toLocaleTimeString()}</Text>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		margin: 5,
	},
	expectation: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
	},
	team: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	emojiString: {
		fontSize: 40,
	},
	inputContainer: {
		flexDirection: "row",
		justifyContent: "center",
		margin: 10,
	},
	input: {
		margin: 5,
		height: 40,
		width: 40,
		borderColor: "#eee",
		borderWidth: 1,
		alignItems: "center",
		textAlign: "center",
	},
	inputDisabled: {
		backgroundColor: "#eee",
	},
});

const mapStateProps = state => {
	return {
		expectations: state.fixture.expectations,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onUpdateExpectation: (group, match, expectation) => {dispatch(updateExpectation(group, match, expectation))}
	}
};

export default connect(mapStateProps, mapDispatchToProps)(Match);
