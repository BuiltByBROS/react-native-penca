const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

const { calculateRanking }  = require(`${__dirname}/helpers/helpers.js`);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp({
	databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
	credential: admin.credential.cert(require("./react-native-penca.json")),
});

exports.helloWorld = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		response.send("Hello from Firebase!");
	});
});

exports.calculateRangking = functions.https.onRequest((request, response) => {
	cors(request, response, () => {

		const promise = new Promise((resolve, reject) => {
			// Get a database reference to our posts
			const users = admin.database().ref("users");
			const fixture = admin.database().ref("fixture");
			const ranking = admin.database().ref("ranking");

			// Attach an asynchronous callback to read the data at our posts reference
			users.on("value", usersSnapshot => {
				fixture.on("value", fixtureSnapshot => {
					try {
						const newRanking = calculateRanking(usersSnapshot.val(), fixtureSnapshot.val());

						// set RANKING table on DB.
						newRanking ?
							ranking.set(newRanking)
								.then(() => {
									return response.send("Ranking updated!");
								})
								.catch(e => {
									reject(e);
								})
							: null;
					} catch (e) {
						reject(e)
					}
				}, errorObject => {
					reject(errorObject);
				})
			}, errorObject => {
				reject(errorObject);
			});
		});

		return promise.catch(e => {
			response.status(500).send({message: e.message});
		})
	});
});
