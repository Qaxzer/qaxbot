# QaxBot

 This project is a twitch chat bot made with **nodejs** , **mongodb** and using the nodeJS module **mongoose** and **TMI.js**

## Little speech

  I'm still asking myself why i chose to do a bot. In his current state the bot is working but isn't complete , i still want to add him some functionality like discord compatibility , and user interface but it take times. so this is just a small part of the total project.
  
  As it still **work in progress** i don't recommend you to try it or even use it as your chat moderation bot. The code is here just for the curious one or the technical one who know what they are doing. If you have any comment or advise on my coding, don't hesitate i will read you , try to answer in reasonable times you and most important if you note some mistake i will do my best to correct them.

## Installation

**Warning** : This project has currently being tested only on linux and require a mongoDb to work. it should work on windows but i can't guaranted it

After downloading the bot you'll have some configuration to make, the first one is  and the begin of **mybot.js** _( line 17 -> 29)_

```javascript
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
    channels: ["#myBotChannel","#Mychannel", "#anotherChannel"]
  };
```
You'll also have to configure the access for the twitch api toward the end of the file _(line 363 -> 368)_

```javascript
      //You have to set up access for your bot to twitch api
      headers: {
        "Accept": "application/vnd.twitchtv.v5+json",
        "Authorization": "your Authorization",
        "Client-ID": "your client id"
      }
```
Before running the bot you may want to customize him a little as this is just a template one, i tried to made the code as readable as possible. I haven't comment a lot so my be difficult for a novice, but most of the code is simple and self explanatory.

Once it's done open up a terminal and just type `node mybot.js`, if everything works as intended you should see something like that.
![Screen of Terminal](http://www.kirikoo.net/images/14Anonyme-20170719-181538.png)


