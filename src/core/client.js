const { Client, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const path = require("node:path");
const { readdirSync } = require("node:fs");
const { register } = require("./register");
const { logger } = require("./logger");
const { cwd } = require("node:process");

class BotClient extends Client {
  constructor(options) {
    super(options);

    //#region Options and  collections

    // paths
    this.GatewayIntentBits = options.intents;
    this.eventPath = options.paths.eventPath;
    this.commandsPath = options.paths.commandsPath;
    this.buttonsPath = options.paths.buttonsPath;
    this.selectMenusPath = options.paths.selectMenusPath;
    this.ModalsPath = options.paths.ModalsPath;

    // logger
    this.logPath = options.loggerInfo.logPath;
    this.logColor = options.loggerInfo.logColor;
    this.logTime = options.loggerInfo.logTime;

    // collections
    this.commands = new Collection();
    this.buttons = new Collection();
    this.selectMenus = new Collection();
    this.Modals = new Collection();

    //check if things were provided
    if (!this.commandsPath) throw new Error("No commands path provided");
    if (!this.eventPath) throw new Error("No event path provided");
    if (!this.buttonsPath) throw new Error("No buttons path provided");
    if (!this.GatewayIntentBits) throw new Error("No intents provided");
    if (!this.logPath) throw new Error("No logger path provided");
    if (!this.logColor) throw new Error("Log color has not been set to true or false");
    if (!this.logTime) throw new Error("Log time has not been set to true or false");

    //#endregion

    //#region Event Handler

    const eventFiles = readdirSync(path.resolve(cwd(), this.eventPath)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of eventFiles) {
      const event = require(path.resolve(cwd(), this.eventPath, file));
      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args, this));
      } else {
        this.on(event.name, (...args) => event.execute(...args, this));
      }
    }

    //#endregion

    //#region puting stuff in collections

    const commandFiles = readdirSync(path.resolve(cwd(), this.commandsPath)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of commandFiles) {
      const command = require(path.resolve(this.commandsPath, file));
      this.commands.set(command.data.name, command);
    }

    // this is for the button files
    const buttonFiles = readdirSync(path.resolve(cwd(), this.buttonsPath)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of buttonFiles) {
      const button = require(path.resolve(this.buttonsPath, file));
      this.buttons.set(button.data.customId, button);
    }

    // this is for the select menu files
    const selectMenuFiles = readdirSync(path.resolve(cwd(), this.selectMenusPath)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of selectMenuFiles) {
      const selectMenu = require(path.resolve(this.selectMenusPath, file));
      this.selectMenus.set(selectMenu.data.customId, selectMenu);
    }

    // this is for the modal files
    const modalFiles = readdirSync(path.resolve(cwd(), this.ModalsPath)).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of modalFiles) {
      const modal = require(path.resolve(this.ModalsPath, file));
      this.Modals.set(modal.data.customId, modal);
    }

    //#endregion
  }

  build(token, guildID, appID) {
    this.Logger = new logger({
      logPath: this.logPath,
      logColor: this.logColor,
      logTime: this.logTime,
    });
    register(token, guildID, appID, this.commandsPath, this.Logger);
    this.login(token);
    return this;
  }
}

module.exports = BotClient;
