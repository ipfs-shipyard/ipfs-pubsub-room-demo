# IPFS pubsub

Hi, welcome!

In this video I’ll show you how to build an application that uses pub-sub over IPFS.

IPFS stands for Interplanetary File System, and is much more than a file system. It’s an entire network stack for the decentralised and peer-to-peer web, allowing you to build truly serverless web applications.

If you want to find out more about IPFS you can head out to IPFS’s website, ipfs.io.

In this screencast we’ll be using js-ipfs, which is a Javascript implementation of IPFS that works in Node.js and in a modern browser.

## Our goal

Out goal is to create an open chat room where different clients can talk to each other and know of each others’ presence.

## Repo

The product of this demo is located in this GitHub repo. Feel free to download it, install it and poke around. It’s simple, and instructions are in the README.

If you’re curious, I’ll next show you the steps you need to take to create this application.

## The recipe

Your’re going to need some things to make this happen:

* Node.js
* js-IPFS
* Ipfs-pubsub-room
* Browserify
* http-server

Also, you will need to know a bit of basic javascript to be able to understand this video.

Next, I’ll show you the steps you need to take to install them.

## Node.js

If you don’t have Node.js installed, you can head out to nodejs.org and following the installations instructions there.

## Create dir and project

After that, you can create the project dir.
And run `npm init` to initialise our application package.json manifest.

## Serve some static files

Next you’ll need to install the http-server so that we can serve some static files.

`npm install http-server --save`

We can now create a start script in out package.json that starts our HTTP server.

## Create a static page

Now we need to create a directory that is going to be served by our HTTP server. We’ll name it “public”.

Now we need to create a really simple static webpage that the only thing it does is include this javascript file containing our room app.

```html
<!DOCTYPE html>
<html>
  <body>
    <script src="js/app.js"></script>
  </body>
</html>
```

We can now start our web server and try to load our webpage.

Add the following entry to `package.json` section name `script`.
`"start": "http-server -c-1 -p 12345 public",`

It says the javascript file was not found. Let’s take care of that now.

## Create an app bundle with browserify

To create our application we’ll need to create a single packaged javascript file containing the entirety of our app. For that we’re going to use Browserify, which you should install using npm:

`$ npm install browserify —save`

Now we can create an npm “compile” script that we can run from the command line.

```
$ browserify src/app.js -o public/js/app.js -d"
```

Let’s create an application that just outputs “Hello World” for now in
`src/app.js`:


```js
console.log('Hello World!')
```

Compile it and try it out.

## Create IPFS node

Now we need to download and install js-IPFS using npm:

```
$ npm install ipfs —save
```

In the app, we now need to create an IPFS node:

```js
const IPFS = require('ipfs')
const ipfs = new IPFS({
  repo: repo(),
  EXPERIMENTAL: {
    pubsub: true
  }
})

ipfs.once(`ready`, () => ipfs.id((err, peerInfo) => {
  if (err) { throw err }
  console.log(`IPFS node started and has ID ` + peerInfo.id)
}))

function repo () {
  return 'ipfs/pubsub-demo/' + Math.random()
}
```

## Create pubsub room

Now, we’re going to create a pub sub room.

To do that, we need to install the `ipfs-pubsub-room` package:

```
$ npm install ipfs-pubsub-room —save
```

Now, we’re going to create that room:

```js
const Room = require('ipfs-pubsub-room')

// (...)

const room = Room(ipfs, 'ipfs-pubsub-demo')
```

## Listen for membership events

Now, we are going to listen for interesting events that happen in the room, namely when other peers join and leave the room.

```js
room.on(‘peer joined’, (peer) => console.log(‘peer ‘ + peer + ‘ joined’))
room.on(‘peer left’, (peer) => console.log(‘peer ‘ + peer + ‘ left’))
```

Let’s test this.

## Send and receive messages

Now that we have a room we can send messages to a specific node.

```js
room.on(‘peer joined’, (peer) => room.sendTo(peer, 'Welcome ' + peer + '!')
```

In order for a node to receive these messages, we need to listen to the `message` event.

```js
room.on(‘message’, (message) => console.log('message from ' + message.from + ': ' + message.data.toString())
```

Let’s see this in action.

## Broadcast messages

Besides sending messages to specific peers, a node can also send messages to all peers. Let’s simulate a chat room by sending a messages to all connected peers every 2 seconds:

```js
setInterval(() => room.broadcast(‘hey everyone!’), 2000)
```

Let’s see this in action.

## Summary

In this episode we saw how you can start creating a pub-sub web application based on IPFS. We setup our project, installed some dependencies and created a room, where we were able to listen to room membership changes, as well as receive and send messages.

If you’re interested, as an exercise that we leave to you, you can create a chat web application based on these primitives.

That’s all for now.

Hope you enjoyed watching this video. See you soon!
