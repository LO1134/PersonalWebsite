const { buildSchema } = require("graphql");

module.exports = buildSchema(`

		type Sonoff {
			id: ID!
			title: String!
			description: String!
			MQTTcommand: String!
			MQTTtopic: String!
			MQTTcommandAAN: String!
			MQTTcommandUIT: String!
			date: String!
			status: String!
			deviceName: String!						
		}

		type RootQuery {
			sonoffs: [String]
		}
		
		schema {
			query: RootQuery
		}					
	`);
