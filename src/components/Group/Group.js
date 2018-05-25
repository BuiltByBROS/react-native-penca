import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet} from "react-native";

import Match from "../Match/Match";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";

class Group extends Component {

	render() {
		const {
			fixture,
			group,
			groupName,
		} = this.props;

		const renderMatches = [];

		fixture[group].matches
			.forEach((match, index) => {
			renderMatches.push(
				<Match
					key={index}
					group={group}
					match={index}
					{...match}
				/>
			)
		});

		return (
			<View style={styles.container}>
				<MainText>
					<HeadingText>
						{groupName}
					</HeadingText>
				</MainText>
				{renderMatches}
			</View>
		);
	};
}

const mapStateProps = state => {
	return {
		fixture: state.fixture.fixture,
		expectations: state.fixture.expectations,
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: "auto",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default connect(mapStateProps, null)(Group);
