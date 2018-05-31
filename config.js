var config = {
	name:'POLICY_PAL_TRANSACTIONS',
	version:'0.0.1',
	expressPort: process.env.PORT||5000,
	mongodb: {
			defaultDatabase: "POLICYPAL",
			defaultCollection: "transactions",
			defaultUri: process.env.MONGODB_URI
		}
	
};

module.exports = config;



