import React, { Component } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { connect } from "react-redux";

import Match from "../../components/Match/Match";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";

import { loadData, submitExpectations } from "../../store/actions/fixture";

class DashboardScreen extends Component {

	constructor(props) {
		super();
		props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	};


	onNavigatorEvent = event => {
		if (event.type === "NavBarButtonPress") {
			if (event.id === "sideDrawerToggle") {
				this.props.navigator.toggleDrawer({
					side: "left",
				});
			}
		}
	};

	componentDidMount() {
		this.props.onLoadData();
	};

	submitExpectationsHandler = () => {
		alert("Submitting expectations");
		this.props.onSubmitExpectations();
	};

	render() {
		let content = <ActivityIndicator />;
		let submitResultButton = null;

		if (!this.props.ui.isLoading
				&& this.props.fixture
				&& this.props.expectations) {

			content = [];
			Object.keys(this.props.fixture).forEach((groupIndex) => {

				let matches = [];
				this.props.fixture[groupIndex].matches.forEach((match, matchIndex) => {

					matches.push(
						<Match
							key={matchIndex}
							group={groupIndex}
							match={matchIndex}
							{...match}
						/>
					);
				});

				content.push(
					<View
						key={groupIndex}
						style={styles.groupContainer}>
						<MainText>
							<HeadingText>
								{this.props.fixture[groupIndex].name}
							</HeadingText>
						</MainText>
						{matches}
					</View>
				)

			});

			submitResultButton = (
				<ButtonWithBackground
					color="#29aaf4"
					onPress={this.submitExpectationsHandler}
				>Submit Expectations
				</ButtonWithBackground>
			)
		}

		return (
			<ScrollView contentContainerStyle={styles.container}>
				{content}
				{submitResultButton}
			</ScrollView>
		);
	}
}

const mapStateProps = state => {
	return {
		fixture: state.fixture.fixture,
		expectations: state.fixture.expectations,
		ui: state.ui,
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onLoadData: () => {dispatch(loadData())},
		onSubmitExpectations: () => {dispatch(submitExpectations())},
	}
};

const styles = StyleSheet.create({
	container: {
		minHeight: "100%",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	groupContainer: {
		flex: 1,
		height: "auto",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default connect(mapStateProps, mapDispatchToProps)(DashboardScreen);
