const IPFS = require('ipfs')
const Room = require('ipfs-pubsub-room')
const ipfs = new IPFS({
  repo: repo(),
  config: {
    Addresses: {
      Swarm: [
        '/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss'
      ]
    },
    Discovery: {
      webRTCStar: {
        Enabled: true
      }
    }
  },
  EXPERIMENTAL: {
    pubsub: true
  }
})

ipfs.once('ready', () => ipfs.id((err, peerInfo) => {
  if (err) { throw err }
  console.log('IPFS ready with address ' + peerInfo.id)
}))

const room = Room(ipfs, 'ipfs-pubsub-demo')

room.on('peer joined', (peer) => console.log('peer ' + peer + ' joined'))
room.on('peer left', (peer) => console.log('peer ' + peer + ' left'))

// send and receive messages

room.on('peer joined', (peer) => room.sendTo(peer, 'welcome ' + peer + '!') )
room.on('message', (message) =>
  console.log('got message from ' + message.from + ': ' + message.data.toString()))

// broadcast message every 2 seconds

setInterval(() => room.broadcast('hey everyone!'), 2000)

function repo() {
  return 'ipfs/pubsub-demo/' + Math.random()
}