const { buildSchema } = require("graphql");

module.exports = buildSchema => {
  return {
    sonoffSchema: buildSchema(`
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
			type Query {
				sonoffs: [Sonoff!]!
			}
			`),
    sonoffQuery: `
			{
			  sonoffs {
				title
			   description
			   MQTTtopic
			   status
			   MQTTcommandAAN
			   MQTTcommandUIT
			}
		  }`,
  };
};
