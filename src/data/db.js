const MongoClient = require("mongodb").MongoClient;
const config = require("../config.json");
const uri = `mongodb+srv://${config.mongoUser}:${config.mongoPass}@cluster0.awzkqo3.mongodb.net/?retryWrites=true&w=majority`;
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const collection = client.db("elite").collection("warnings");

module.exports.addWarning = ({ userid, guildid, warningid, modid, reason }) => {
  let query = { userid: userid };
  let newData = {
    userid: userid,
    [`guilds.${guildid}.${warningid}`]: {
      mod: modid,
      reason: reason,
      time: Date.now(),
    },
  };
  collection.updateOne(query, { $set: newData }, { upsert: true });
};

module.exports.removeWarning = async ({ userid, guildid, warningid }) => {
  let query = { userid: userid };
  var toRemove = { [`guilds.${guildid}.${warningid}`]: "" };
  var res = await collection.updateMany(query, { $unset: toRemove });
  return res.modifiedCount;
};
module.exports.getWarning = async (userid) => {
  var res = await collection.findOne({ userid: userid });
  return res;
};
