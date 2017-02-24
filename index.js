const paybook = require("paybook");
const async = require("async");

var globals = {
	sync_api_key: "ff1f707a918d892a553159012058aa6e",
	sync_username: "omar",
	sync_id_user: null,
	sync_token: null,
	sync_id_test_site: null,
	sync_id_credential: null,
	sync_site_credentials: null,
};

paybook.api.setApiKey(globals.sync_api_key);
paybook.api.setTest(true);

async.series([
	(callback) => {
		console.log("GET USER");
		paybook.api.getUsers(
			{ id_external: globals.sync_username },
		(err, users) => {
			if (err) return callback(err);
			globals.sync_id_user = users.response[0].id_user
			callback();
		});
	},
	(callback) => {
		console.log("CREATE SESSION FOR USER: ", globals.sync_id_user);
		paybook.api.createSession(
			globals.sync_id_user,
		(err, session) => {
			if (err) return callback(err);
			console.log(session);
			globals.sync_token = session.token;
			callback();
		});
	},
	(callback) => {
		console.log("GET CATALOGES");
		paybook.api.cataloguesSites(
			globals.sync_token,
		(err, cataloges) => {
			if (err) return callback(err);
			// console.log(cataloges);
			globals.sync_id_test_site = cataloges.response[0].id_site_organization;
			globals.sync_site_credentials = cataloges.response.filter((inst, i) => {
				return inst.name === "Token";
			})
			callback();
		});
	},
	(callback) => {
		console.log("GET CREDENTIALS FOR USER: ", globals.sync_id_user);
		paybook.api.getCredentials(
			globals.sync_token,
		(err, credentials) => {
			if (err) return callback(err);
			if (!credentials.response.length) {
				console.log("CREATE CREDENTIALS FOR USER: ", globals.sync_id_user, "\nID_SITE: ", globals.sync_id_test_site);
				paybook.api.credentials(
					globals.sync_token, globals.sync_id_test_site, globals.sync_site_credentials,
				(err, credential) => {
					if (err) return callback(err);
					console.log("CREDENTIAL: ", credential)
					globals.sync_id_credential = credential.id_credential;
					callback();
				});
			} else {
				callback();
			}
		});
	}/*,
	(callback) => {
		paybook.api.getAccounts(
			globals.sync_token,
			{  },
		(err, response) => {});
	}*/
],
(err) => {
	if (err) console.log("Error: ", err);
	console.log("Finish Serie");
});