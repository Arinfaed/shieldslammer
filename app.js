/**
 * Super basic Discord-Bot based on the bot from
 * 
 * https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3
 */

const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setGame(`Final Fantasy 6`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`Final Fantasy 6`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`Final Fantasy 6`);
});


client.on("message", async message => {

  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  if(!Object.keys(config.observe).includes(message.guild.id)) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    
  if(command === "shieldslam") {

    if(!message.member.roles.some(r=>config.observe[message.guild.id].includes(r.id)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    // filter out the pinned messages, those are probably somehow important, arent they?
    const nonPinned = fetched.filter((value, key, collection) => {
      return !value.pinned;
    });
    const reply = message.reply(`Deleting ${nonPinned.array().length} Messages`);
    //message.channel.bulkDelete(nonPinned)
    //  .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    nonPinned.forEach((value) => {
        value.delete().catch(console.error);
    });

    reply.then((message) => { message.delete(); });
  }
});

client.login(config.token);
           