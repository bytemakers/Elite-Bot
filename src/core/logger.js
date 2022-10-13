const fs = require("fs");
const path = require("path");
const { cwd } = require("process");

class logger {
  constructor(options) {
    this.logColor = options.logColor;
    this.timestampBool = options.logTime;
    this.logPath = options.logPath;

    let startTime = getTimestamp();
    // REPLACE ALL / AND : WITH - TO AVOID ERRORS
    startTime = startTime.replace(/\//g, "-");
    startTime = startTime.replace(/:/g, "-");

    this.file = fs.createWriteStream(path.join(cwd(), this.logPath, `${startTime}.log`), {
      flags: "a+",
    });

    this.info("Logger initialized");
  }

  //#region public methods
  log(message) {
    if (this.timestampBool) {
      if (this.logColor) {
        this.file.write(`[${getTimestamp()}] ${message} \n`);
        console.log(`\x1b[37m [${getTimestamp()}] ${message} \x1b[0m`);
      } else {
        this.file.write(`[${getTimestamp()}] ${message} \n`);
        console.log(`[${getTimestamp()}] ${message}`);
      }
    } else {
      if (this.logColor) {
        this.file.write(`${message} \n`);
        console.log(`\x1b[37m ${message} \x1b[0m`);
      } else {
        this.file.write(`${message} \n`);
        console.log(`${message}`);
      }
    }
  }

  error(message) {
    if (this.timestampBool) {
      if (this.logColor) {
        this.file.write(`[${getTimestamp()}] [error] ${message} \n`);
        console.log(`\x1b[31m [${getTimestamp()}] [error] ${message} \x1b[0m`);
      } else {
        this.file.write(`[${getTimestamp()}] [error] ${message} \n`);
        console.log(`[${getTimestamp()}] [error] ${message}`);
      }
    } else {
      if (this.logColor) {
        this.file.write(`[error] ${message} \n`);
        console.log(`\x1b[31m [error] ${message} \x1b[0m`);
      } else {
        this.file.write(`[error] ${message} \n`);
        console.log(`[error] ${message}`);
      }
    }
  }

  warn(message) {
    if (this.timestampBool) {
      if (this.logColor) {
        this.file.write(`[${getTimestamp()}] [warning] ${message} \n`);
        console.log(`\x1b[33m [${getTimestamp()}] [warning] ${message} \x1b[0m`);
      } else {
        this.file.write(`[${getTimestamp()}] [warning] ${message} \n`);
        console.log(`[${getTimestamp()}] [warning] ${message}`);
      }
    } else {
      if (this.logColor) {
        this.file.write(`[warning] ${message} \n`);
        console.log(`\x1b[33m [warning] ${message} \x1b[0m`);
      } else {
        this.file.write(`[warning] ${message} \n`);
        console.log(`[warning] ${message}`);
      }
    }
  }

  success(message) {
    if (this.timestampBool) {
      if (this.logColor) {
        this.file.write(`[${getTimestamp()}] [success] ${message} \n`);
        console.log(`\x1b[32m [${getTimestamp()}] [success] ${message} \x1b[0m`);
      } else {
        this.file.write(`[${getTimestamp()}] [success] ${message} \n`);
        console.log(`[${getTimestamp()}] [success] ${message}`);
      }
    } else {
      if (this.logColor) {
        this.file.write(`[success] ${message} \n`);
        console.log(`\x1b[32m [success] ${message} \x1b[0m`);
      } else {
        this.file.write(`[success] ${message} \n`);
        console.log(`[success] ${message}`);
      }
    }
  }

  info(message) {
    if (this.timestampBool) {
      if (this.logColor) {
        this.file.write(`[${getTimestamp()}] [info] ${message} \n`);
        console.log(`\x1b[34m [${getTimestamp()}] [info] ${message} \x1b[0m`);
      } else {
        this.file.write(`[${getTimestamp()}] [info] ${message} \n`);
        console.log(`[${getTimestamp()}] [info] ${message}`);
      }
    } else {
      if (this.logColor) {
        this.file.write(`[info] ${message} \n`);
        console.log(`\x1b[34m [info] ${message} \x1b[0m`);
      } else {
        this.file.write(`[info] ${message} \n`);
        console.log(`[info] ${message}`);
      }
    }
  }

  //#endregion
}

//#region private methods

function getTimestamp() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let getHours = fixDate(date.getHours());
  let getMinutes = fixDate(date.getMinutes());
  let getSeconds = fixDate(date.getSeconds());

  return `${year}/${month}/${day} ${getHours}:${getMinutes}:${getSeconds}`;
}

function fixDate(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return number;
  }
}

// #endregion
module.exports = { logger };
