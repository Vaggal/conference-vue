import Io from '@/modules/Io';
import Config from '@/modules/Config';
import EventEmitter from 'wolfy87-eventemitter';

var iceConfig = {
    'iceServers': [{
      'url': 'stun:stun.l.google.com:19302'
    }]
  },
  peerConnections = {},
  currentId, roomId,
  stream;

function getPeerConnection(id) {
  if (peerConnections[id]) {
    return peerConnections[id];
  }
  var peerConnection = new RTCPeerConnection(iceConfig);
  peerConnections[id] = peerConnection;
  peerConnection.addStream(stream);
  peerConnection.onicecandidate = function (event) {
    socket.emit('msg', {
      by: currentId,
      to: id,
      ice: event.candidate,
      type: 'ice'
    });
  };

  // TODO: replace with 'ontrack'
  peerConnection.onaddstream = function (event) {
    console.log('Received new stream');
    api.trigger('peer.stream', [{
      id: id,
      stream: event.stream
    }]);
  };
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

function handleMessage(data) {
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

var socket = Io.connect(Config.SIGNALIG_SERVER_URL),
  connected = false;

function addHandlers(socket) {
  socket.on('peer.connected', function (params) {
    makeOffer(params.id);
  });

  socket.on('peer.disconnected', function (data) {
    api.trigger('peer.disconnected', [data]);
  });

  socket.on('msg', function (data) {
    handleMessage(data);
  });
}

var api = {
  joinRoom: function (r) {
    if (!connected) {
      socket.emit('init', {
        room: r
      }, function (roomid, id) {
        currentId = id;
        roomId = roomid;
      });
      connected = true;
    }
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
  init: function (s) {
    stream = s;
  }
};

let eventEmitter = new EventEmitter();
Object.setPrototypeOf(api, Object.getPrototypeOf(eventEmitter))

addHandlers(socket);

export default api;
