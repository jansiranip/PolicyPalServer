var config = {
	name:'POLICY_PAL_TRANSACTIONS',
	version:'0.0.1',
	expressPort: process.env.PORT||3000,
	mongodb: {
			defaultDatabase: "POLICYPAL",
			defaultCollection: "transactions",
			defaultUri: "mongodb://localhost:27017/POLICYPAL"
		}
	
};

module.exports = config;



