var config = {
	name:'POLICY_PAL_TRANSACTIONS',
	version:'0.0.1',
	expressPort: process.env.PORT||3000,
	mongodb: {
			defaultDatabase: "POLICYPAL",
			defaultCollection: "transactions",
			defaultUri: process.env.MONGOLAB_URI
		}
	
};

module.exports = config;



