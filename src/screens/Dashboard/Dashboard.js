import React, { Component } from "react";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { connect } from "react-redux";

import Group  from "../../components/Group/Group";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";

import { loadData, submitExpectations, updateExpectation } from "../../store/actions/fixture";

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

	handleExpectationChange = (group, match, expectation) => {
		this.props.onUpdateExpectation(group, match, expectation);
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
			Object.keys(this.props.fixture).forEach((group) => {
				content.push(
					<Group
						key={group}
						group={group}
						groupName={this.props.fixture[group].name}
						// matches={this.props.fixture[group].matches}
						// expectations={this.props.expectations[group]}
						// handleExpectationChange={this.handleExpectationChange}
					/>
				);
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
		onUpdateExpectation: (group, match, expectation) => {dispatch(updateExpectation(group, match, expectation))}
	}
};

const styles = StyleSheet.create({
	container: {
		minHeight: "100%",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default connect(mapStateProps, mapDispatchToProps)(DashboardScreen);
