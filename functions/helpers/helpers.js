const calculateRanking = (users, fixture) => {

	let ranking = [];

	Object.keys(users).forEach(userIndex => {

		let score = 0;
		const expectations = users[userIndex].expectations;

		Object.keys(expectations).forEach(groupIndex => {

			const group = users[userIndex].expectations[groupIndex];

			group.matches.forEach((match, matchIndex) => {

				/**
				 * if match.home_expected_result === fixture.groups[groupIndex].matches[matchIndex].home_result
				 *  && match.away_expected_result === fixture.groups[groupIndex].matches[matchIndex].away_result
				 *  score += 4
				 *  else if match.home_expected_result === fixture.groups[groupIndex].matches[matchIndex].home_result
				 *    score += 2
				 *  else if match.away_expected_result === fixture.groups[groupIndex].matches[matchIndex].away_result
				 *    score += 2
				 *  if match.home_expected_result >= match.away_expected_result
				 *    && fixture.groups[groupIndex].matches[matchIndex].home_result >= fixture.groups[groupIndex].matches[matchIndex].away_result
				 *    || match.home_expected_result < match.away_expected_result
				 *    && fixture.groups[groupIndex].matches[matchIndex].home_result < fixture.groups[groupIndex].matches[matchIndex].away_result
				 *      score += 4
				 */

				if (!fixture.groups[groupIndex].matches[matchIndex].finished
					|| !match.isSet
				) return null;

				if (match.home_expected_result === fixture.groups[groupIndex].matches[matchIndex].home_result
					&& match.away_expected_result === fixture.groups[groupIndex].matches[matchIndex].away_result
				) {
					score += 4
				} else if (match.home_expected_result === fixture.groups[groupIndex].matches[matchIndex].home_result) {
					score += 2
				} else if (match.away_expected_result === fixture.groups[groupIndex].matches[matchIndex].away_result) {
					score += 2
				}

				if (match.home_expected_result === match.away_expected_result
					&& fixture.groups[groupIndex].matches[matchIndex].home_result === fixture.groups[groupIndex].matches[matchIndex].away_result
					|| match.home_expected_result > match.away_expected_result
					&& fixture.groups[groupIndex].matches[matchIndex].home_result > fixture.groups[groupIndex].matches[matchIndex].away_result
					|| match.home_expected_result < match.away_expected_result
					&& fixture.groups[groupIndex].matches[matchIndex].home_result < fixture.groups[groupIndex].matches[matchIndex].away_result
				) {
					score += 4
				}
			});
		});

		ranking.push({
			email: users[userIndex].email,
			score: score
		});
	});

	return ranking;
};

module.exports = {
	calculateRanking,
};
