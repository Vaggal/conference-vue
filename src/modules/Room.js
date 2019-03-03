/** @module modules/Room */
import Io from '@/modules/Io';
import Config from '@/modules/Config';
import EventEmitter from 'wolfy87-eventemitter';

var iceConfig = {
  iceServers: [{
    url: 'stun:stun.l.google.com:19302'
  }]
};

var peerConnections = {};
var currentId;
var roomId;
var localStream;

function getPeerConnection(id) {
  if (peerConnections[id]) {
    return peerConnections[id];
  } else {
    return createNewPeerConnection(id);
  }
}

function createNewPeerConnection(id) {
  var peerConnection = new RTCPeerConnection(iceConfig);
  peerConnections[id] = peerConnection;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.onicecandidate = function (event) {
    socket.emit('msg', {
      by: currentId,
      to: id,
      ice: event.candidate,
      type: 'ice'
    });
  };

  peerConnection.ontrack = function (rtcTrackEvent) {
    api.trigger('peer.track', [{
      id: id,
      track: rtcTrackEvent.track
    }]);
  }

  return peerConnection;
}

function makeOffer(id) {
  var peerConnection = getPeerConnection(id);

  // Native WebRTC method: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
  peerConnection.createOffer({
    mandatory: {
      offerToReceiveVideo: true,
      offerToReceiveAudio: true
    }
  }).then((sdp) => {
    peerConnection.setLocalDescription(sdp);
    console.log('Creating an offer for', id);

    socket.emit('msg', {
      by: currentId,
      to: id,
      sdp: sdp,
      type: 'sdp-offer'
    });
  }).catch((e) => {
    console.log(e);
  });
}

/**
 * Handles messages related to SDP and ICE
 * @param {String} data
 */
function handleSocketMessage(data) {
  var peerConnection = getPeerConnection(data.by);
  var rtcSessionDescription;

  switch (data.type) {
    case 'sdp-offer':
      rtcSessionDescription = new RTCSessionDescription(data.sdp);

      peerConnection.setRemoteDescription(rtcSessionDescription).then(() => {
        console.log('Setting remote description by offer');

        peerConnection.createAnswer().then((sdp) => {
          peerConnection.setLocalDescription(sdp);

          socket.emit('msg', {
            by: currentId,
            to: data.by,
            sdp: sdp,
            type: 'sdp-answer'
          });
        }).catch((e) => {
          console.log(e);
        });
      }).catch((e) => {
        console.log(e);
      });

      break;
    case 'sdp-answer':
      rtcSessionDescription = new RTCSessionDescription(data.sdp);

      peerConnection.setRemoteDescription(rtcSessionDescription).then(() => {
        console.log('Setting remote description by answer');
      }).catch((e) => {
        console.error(e);
      });

      break;
    case 'ice':
      if (data.ice) {
        console.log('Adding ice candidates');

        let rtcIceCandidate = new RTCIceCandidate(data.ice);
        peerConnection.addIceCandidate(rtcIceCandidate);
      }
      break;
  }
}

var socket = Io.connect(Config.SIGNALIG_SERVER_URL);
var connected = false;

function addSocketHandlers(socket) {
  socket.on('peer.connected', function (peer) {
    makeOffer(peer.id);
  });

  socket.on('peer.disconnected', function (peer) {
    api.trigger('peer.disconnected', [peer]);
  });

  socket.on('msg', function (data) {
    handleSocketMessage(data);
  });

  socket.on('votes.update', function (votes) {
    console.log("Votes update");
    api.trigger('votes.update', [votes]);
  });

  socket.on('conversation.type', function (conversation) {
    console.log("Conversation Type: " + conversation.type);
    api.trigger('conversation.type', [conversation]);
  });

  socket.on('active.peer', function (peer) {
    api.trigger('active.peer', [peer]);
  });
}

function addApiHandlers(api) {
  api.on('votes.increment', function (peerId) {
    socket.emit('votes.increment', {
      id: peerId
    });
  });

  api.on('conversation.type.select', function (type) {
    console.log("Conversation Type Select: " + type);
    socket.emit('conversation.type.select', {
      type: type
    })
  })
}

var api = {
  joinRoom: function (r) {
    let initPromise = new Promise((resolve, reject) => {
      if (!connected) {
        socket.emit('init', {
          room: r
        }, function (roomid, id) {
          resolve();
          currentId = id;
          roomId = roomid;
        });
        connected = true;
      } else {
        reject();
      }
    });

    return initPromise;
  },
  createRoom: function () {
    let initPromise = new Promise((resolve, reject) => {
      socket.emit('init', null, function (roomid, id) {
        resolve(roomid);
        roomId = roomid;
        currentId = id;
        connected = true;
      });
    });

    return initPromise;
  },
  init: function (stream) {
    localStream = stream;
  },
  getSelfId: function () {
    return currentId;
  }
};

var eventEmitter = new EventEmitter();
Object.setPrototypeOf(api, Object.getPrototypeOf(eventEmitter))

addSocketHandlers(socket);
addApiHandlers(api);

export default api;
