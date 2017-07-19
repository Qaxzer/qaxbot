//===========================================================================================
//
//                  LOADING & CONFIGURATION
//
//===========================================================================================

  const tmi = require('tmi.js'); // the framework for twitch chat
  const notifier = require('node-notifier'); //use for desktop notification
  const path = require('path');
  const reacts = require('./reacts.js'); /list of reaction
  const mongoose = require('mongoose'); //use for mongodb connection
  mongoose.connect('mongodb://localhost/Qaxbot'); //You have to get a mongodb on your system
  const User = require("./user.js"); //to get our viewer fidelity on the db
  const Stats = require("./stats.js"); // to get the stat about a user on the db
  const Game = require("./game.js"); // to retrieve the game played
  const prefix = "!";
  const tmi_config = {
    options: {
      debug: true
    },
    connection: {
      reconnect: true
    },
    identity: {
      username: "your bot user name on Twitch",
      password: "oauth:of your bot account on twitch"
    },
    channels: ["#myBotChannel","#Mychannel", "#anotherChannel"] //list of channel to connect (list from 0 to n)
  };

//===========================================================================================
//
//                  CONNECTION
//
//===========================================================================================

  let client = new tmi.client(tmi_config);
  client.connect();
  //we use system notification to warn user bot is running
  notifier.notify({
    title: 'Bot Online',
    message: 'Le bot is online on '+ tmi_config.channels+'!',
    icon: path.join(__dirname, 'logo_png.png'),
  });

//===========================================================================================
//
//                  CHANNEL INTERACTION
//
//===========================================================================================


  client.on('chat', (channel, user, message, isSelf) => {

    // Interaction with bot own channel  (act as a Demo )
    if (channel == tmi_config.channels[0]) {
      if (isSelf) return;
      let smallCommand = commandParser(message);
      if (smallCommand) {
        let command = smallCommand[1];
        let param = smallCommand[2];
        param = param.substr(1);
        let cleanParam = param.split(" ");
        switch (command) {
          case "info":
            client.say(channel, "Hey " + user['display-name'] + " , i'm QaxBot, a twitch tchat bot , yes another tchat bot for twitch Keepo . But good news i'm actualy useless Kappa . In short this is a demo channel here are the availble commande !game help , !death , !lmgtfy. For death and lmgtfy you can also call them with help parameter. Oh and i can handle whisper even if i will only anwser you that i'm a bot SeemsGood  ");
            break;
          case "game":
            if (cleanParam[0] == "help") {
              client.say(channel, "I can animate your chat with some mini game , with each game having his own commands.");
              client.say(channel, "You can try here !game plant , !game love or !game russian");
            } else if (cleanParam[0] == "plant") {
              client.say(channel, " \" " + user['display-name'] +" just plant the bomb, type !cut red , blue or green to disarm it \" ");
              client.say(channel, " This game is self explainatory SeemsGood")
            } else if (cleanParam[0] == "russian") {
              client.say(channel, "the bot generate a number from 1 to 6 , and each new call generate an number if the user generated number is equals to the bot one, he is timeout  ");
            } else if (cleanParam[0] == "love") {
              client.say(channel, "Generated love percentage between user and z parameter");
            } else {
              client.say(channel, " This command require a parameter DansGame");
            }
            break;
          case "death":
            if (cleanParam[0] == "help") {
              client.say(channel, "This command is used to track death counter in each game using twitch api and mongodb. Moderator can use it to increased the counter with the param + while other can juste get the current number of death with no parameter.");
              client.say(channel, "Please note that for the demo, i'm not currently counting the death it's a flat number right now FailFish");
            } else if (cleanParam[0] == "+") {
              client.say(channel, " you just increased the death counter SeemsGood");
            } else {
              client.say(channel, " 75 death has been counted so far BibleThump ");
            }
            break;
          case "lmgtfy":
            if (cleanParam[0] == "help") {
              client.say(channel, "If your viewer ask stupide question you can send them a let me google that for you link with this command");
              client.say(channel, "You can specify the search engine with -a (Ask) -b(Bing) -d (duckduckgo) and -g(google). whitout parameter it's google by default");
            } else if (cleanParam[0] == "-a") {
              client.say(channel, "GivePLZ http://lmgtfy.com/?s=k&q=" + cleanParam[1] + " ");
            } else if (cleanParam[0] == "-b") {
              client.say(channel, "GivePLZ http://lmgtfy.com/?s=b&q=" + cleanParam[1] + " ");
            } else if (cleanParam[0] == "-d") {
              client.say(channel, "GivePLZ http://lmgtfy.com/?s=d&q=" + cleanParam[1] + " ");
            } else if (cleanParam[0] == "-g") {
              client.say(channel, "GivePLZ http://lmgtfy.com/?q=" + cleanParam[1] + " ");
            } else {
              client.say(channel, "GivePLZ http://lmgtfy.com/?q=" + cleanParam[0] + " ");
            }
            break;
          default:
            client.say(channel, "Command '!" + command + "' is not reconized. Type " + prefix + "info for the list of commands available on this channel.");
        }
      }
    }

    // Interaction for the main channel
    else if (channel == tmi_config.channels[1]) {
      if (isSelf) return;
      let fullCommand = commandParser(message);
      if (fullCommand) {
        let command = fullCommand[1];
        let param = fullCommand[2];
        param = param.substr(1);
        let cleanParam = param.split(" ");
        switch (command) {
          case "bonjour":
            if (isModerator(user)) {
              client.say(channel, "Hi " + user['display-name'] + ", i'm here to help you moderate that channel!");
            } else if (isBroadcaster(user)) {
              client.say(channel, "Hi " + user['display-name'] + ", i'm glad you got me here!");
            } else if (isSubscriber(user)) {
              client.say(channel, "Hi " + user['display-name'] + ", your a rocking viewer !");
            } else if (isFollower(user)) {
              client.say(channel, "Hi " + user['display-name'] + ", welcome back!");
            } else {
              client.say(channel, "Hey " + user['display-name'] + ", welcome on this channel!");
            }
            break;
          case 'lmgtfy':
            client.say(channel, "http://lmgtfy.com/?q=" + cleanParam[1] + " :)");
            break;
          case "rank":
            getUserLevel(user['display-name'], (userDoc) => {
              client.action(channel, " I have " + user['display-name'] + " with " + userDoc.level + " and : " + userDoc.experience + "/" + getMaximumExpByLevel(userDoc.level) +" experiences");
            });
            break;
          case "game":
              getCurrentGame(channel.substr(1).toLowerCase(), (streamsList) => {
                client.say(channel, " The current game is " + streamsList.game + " HumbleLife");
              });
            break;
          case "mort":
            if (isModerator(user) || isBroadcaster(user)) {
              if (param == "+") {
                updateGameDeath(channel);
              } else {
                getGameDeath(channel.substr(1).toLowerCase(), (streamsList) => {
                  client.say(channel, "The death count is " + streamsList.death + " on " + streamsList.game + " BibleThump BibleThump !!");
                });
              }
            } else {
              client.say(channel, "The death count is " + streamsList.death + " on " + streamsList.game + " BibleThump BibleThump !!");
            }
            break;
          case "loto":
            if (isModerator(user) || isBroadcaster(user)) {
              getChatters(channel.substr(1).toLowerCase(), (chattersList) => {
                var randomUserIndex = Math.floor(Math.random() * (chattersList.chatters.moderators.length));
                client.say(channel, "GivePLZ " + chattersList.chatters.moderators[randomUserIndex] + " win the raffle !! GG !! TakeNRG");
              });
            }
            break;
          case "help":
            if (isModerator(user) || isBroadcaster(user)) {
              client.say(channel, "/w " + user['display-name'] + " your moderator commande are : !cmd5 !cmd6 ...... ");
              //or client.say(channel, "The available command for mods are : !cmd !cmd2 .... ");
            } else if (isSubscriber(user)) {
              client.say(channel, "The available command for subs are : !cmd !cmd2 .... ");
            } else {
              client.say(channel, "The available command are: !cmd , !cmd2 , !cmd3 ...");
            }
            break;
          case "love":
            let userl = user['display-name'].length;
            let fullParam = commandParser(param);
            if (fullParam) {
              let param1 = fullParam[1];
              let param2 = fullParam[2];
              let paraml = param1.length;
              if ((userl + 1) == paraml) {
                client.say(channel, "There is " + getRandom(50, 100) + " % of love between " + user['display-name'] + " and " + param + " !");
              } else if (userl < (paraml - 5) || userl > (paraml + 5) || userl > (paraml + 5) || userl < (paraml - 5)) {
                client.say(channel, "There is " + getRandom(0, 50) + " % of love between " + user['display-name'] + " and " + param + " !");
              } else {
                client.say(channel, "There is " + getRandom(0, 100) + " % of love between " + user['display-name'] + " and " + param + " !");
              }
            } else {
              let paraml = param.length;
              if ((userl + 1) == paraml) {
                client.say(channel, "There is " + getRandom(50, 100) + " % of love between " + user['display-name'] + " and " + param + " !");
              } else if (userl < (paraml - 5) || userl > (paraml + 5) || userl > (paraml + 5) || userl < (paraml - 5)) {
                client.say(channel, "There is " + getRandom(0, 50) + " % of love between " + user['display-name'] + " and " + param + " !");
              } else {
                client.say(channel, "There is " + getRandom(0, 100) + " % of love between " + user['display-name'] + " and " + param + " !");
              }
            }
            break;
          default:
            client.say(channel, "Commande '!" + command + "' not reconized.  use " + prefix + "help for a list of available commands");
        }
      } else {
        //search for react word on every message
        let words = message.toLowerCase().split(" ");
        for (let word of words) {
          let react = reacts[word];
          if (react) {
            client.say(channel, react);
          }
        }
      }
      //updating user experience after each message
      updateExperience(user['display-name'], channel);
    } else {
      // Default interaction for all the other channel. Here it's a just a desktop notification every time your username is said (spy them all :D)
      if (message.indexOf("youUserName") >= 0){
      notifier.notify({
        'title': 'Wake Up',
        'message': 'Your name was mention on channel '+ channel +' !'
      });
      }
    }
  });

//===========================================================================================
//
//                  WHISPER
//
//===========================================================================================

  client.on('whisper', function(channel, user, message, self) {
    if (self) return;
    //here we're limiting to one user
    if (user['display-name'] == "authorizedUser") {
      let fullCommand = commandParser(message);
      if (fullCommand) {
        let command = fullCommand[1];
        let param = fullCommand[2];
        param = param.substr(1);
        let cleanParam = param.split(" ");
        switch (command) {
          case "whispCommand1":
            client.whisper(user['display-name'], "my command return");
            break;
          case "whispCommand2":
            client.whisper(user['display-name'], "my command return");
            break;
          case "whispCommand3":
            client.whisper(user['display-name'], "my command return");
            break;
          case "whispCommand4":
            client.whisper(user['display-name'], "my command return");
            break;
          default:
            client.whisper(user['display-name'], "This is not a valid command");
            break;
        }
      }
    } else {
    //whisper response for every un-authorized users
      client.whisper(user['display-name'], "Hi, I'm a bot and can't say anything else :( .");
    }
  });

//===========================================================================================
//
//                  FUNCTION
//
//===========================================================================================

  function isFollower(user) {
    console.log(user.follower);
    return user.follower;
  }

  function isSubscriber(user) {
    return user.subscriber;
  }

  function isModerator(user) {
    return user.mod;
  }

  function isBroadcaster(user) {
    return user.badges.broadcaster == '1'
  }

  function commandParser(message) {
    let regex = new RegExp("^!([a-zA-Z]+)\s?(.*)");
    return regex.exec(message);
  }

  function getChatters(channel, callback) {
    client.api({
      url: "http://tmi.twitch.tv/group/user/" + channel + "/chatters",
      method: "GET"
    }, function(err, res, body) {
      callback(body);
    });
  }

  function getMaximumExpByLevel(level) {
    return level * 100;
  }

  function getUserLevel(user, callback) {
    let query = {
      'name': user
    };
    User.findOne(query, function(err, userDoc) {
      if (err) console.log("Err while finding user experience : ", err);
      if (userDoc) {
        callback(userDoc)
      }
    });
  }

  function updateExperience(user, channel) {
    let query = {
      'name': user
    };
    User.findOneAndUpdate(query, {
      $inc: {
        experience: 1
      }
    }, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    }, function(err, userDoc) {
      if (err) console.log("Err while updating experience : ", err);
      if (userDoc.experience >= getMaximumExpByLevel(userDoc.level)) {
        userDoc.experience = 0;
        userDoc.level++;
        userDoc.save((errLevel) => {
          if (errLevel) console.log("Err while updating level : ", errLevel);
          if (!errLevel) {
            client.say(channel, "CurseLit " + userDoc.name + " just level up to level " + userDoc.level + " !");
          }
        });
      }
    });
  }

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getCurrentGame(channel, callback) {
    client.api({
      url: "https://api.twitch.tv/kraken/channel?channel=" + channel,
      method: "GET",
      //You have to set up access for your bot to twitch api
      headers: {
        "Accept": "application/vnd.twitchtv.v5+json",
        "Authorization": "your Authorization",
        "Client-ID": "your client id"
      }
    }, function(err, res, body) {
      callback(body);
    });

  }

  function getGameDeath(channel, callback) {
    getCurrentGame(channel, callback);
    let currentGame = callback.game;
    let query = {
      'game': currentGame
    };
    Game.findOne(query, function(err, gameDoc) {
      if (err) console.log("Err while finding game deaths : ", err);
      if (gameDoc) {
        callback(gameDoc)
      }
    });
  }

  function updateGameDeath(channel) {
    getCurrentGame(channel, (streamsList) => {
      let currentGame = streamsList.game;
      let query = {
        'game': currentGame
      };
      Game.findOneAndUpdate(query, {
        $inc: {
          death: 1
        }
      }, {
        upsert: true,
        setDefaultsOnInsert: true,
        new: true
      }, function(err, gameDoc) {
        if (err) console.log("Err while updating death counter : ", err);
        if (!err) client.say(channel, "ItsBoshyTime An other death added : (" + gameDoc.death + ") sur " + gameDoc.game + " !");
      });
    });
  }
