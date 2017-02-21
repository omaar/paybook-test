const paybook = require("paybook");
const async = require("async");

paybook.api.setApiKey("ff1f707a918d892a553159012058aa6e");
paybook.api.setTest(true);

var id_user = null;
var token = null;
var id_site = null;
var id_credential = null;

async.series([
	(callback) => {
		console.log("GET USER");
		paybook.api.getUsers(
			{
				id_external: "omar"
			},
		(err, users) => {
			if (err) return callback(err);
			id_user = users.response[0].id_user
			callback();
		});
	},
	(callback) => {
		console.log("CREATE SESSION FOR USER: ", id_user);
		paybook.api.createSession(
			id_user,
		(err, session) => {
			if (err) return callback(err);
			console.log(session);
			token = session.token;
			callback();
		});
	},
	(callback) => {
		console.log("GET CATALOGES");
		paybook.api.cataloguesSiteOrganizations(
			token,
		(err, cataloges) => {
			if (err) return callback(err);
			// console.log(cataloges);
			id_site = cataloges.response[0].id_site_organization;
			callback();
		});
	},
	(callback) => {
		console.log("GET CREDENTIALS FOR USER: ", id_user);
		paybook.api.getCredentials(
			token,
		(err, credentials) => {
			if (err) return callback(err);
			if (!credentials.response.length) {
				console.log("CREATE CREDENTIALS FOR USER: ", id_user);
				paybook.api.credentials(
					token, id_site, { username: "omar", password: "s3cr3tp4ss" },
				(err, credential) => {
					if (err) return callback(err);
					id_credential = credential.id_credential;
					callback();
				});
			} else {
				callback();
			}
		});
	}/*,
	(callback) => {
		
	}*/
],
(err) => {
	if (err) console.log("Error: ", err);
	console.log("Finish Serie");
});