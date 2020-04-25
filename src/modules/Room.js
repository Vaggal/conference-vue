/** @module modules/Room */
import Io from "@/modules/Io";
import Config from "@/modules/Config";
import EventEmitter from "wolfy87-eventemitter";

var peerConnections = {};
var currentId;
// TODO: roomId is not used and it may cause problems
// eslint-disable-next-line no-unused-vars
var roomId;
var localStream;
var connected = false;

function getPeerConnection(id) {
  if (peerConnections[id]) {
    return peerConnections[id];
  } else {
    return createNewPeerConnection(id);
  }
}

function createNewPeerConnection(id) {
  var peerConnection = new RTCPeerConnection(Config.RTCConfiguration);
  peerConnections[id] = peerConnection;

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.onicecandidate = function(event) {
    socket.emit("msg", {
      by: currentId,
      to: id,
      ice: event.candidate,
      type: "ice"
    });
  };

  peerConnection.ontrack = function(rtcTrackEvent) {
    api.trigger("peer.track", [
      {
        id: id,
        track: rtcTrackEvent.track
      }
    ]);
  };

  return peerConnection;
}

function makeOffer(id) {
  var peerConnection = getPeerConnection(id);

  // Native WebRTC method: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
  peerConnection
    .createOffer({
      mandatory: {
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      }
    })
    .then(sdp => {
      peerConnection.setLocalDescription(sdp);
      console.log("Creating an offer for", id);

      socket.emit("msg", {
        by: currentId,
        to: id,
        sdp: sdp,
        type: "sdp-offer"
      });
    })
    .catch(e => {
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
    case "sdp-offer":
      rtcSessionDescription = new RTCSessionDescription(data.sdp);

      peerConnection
        .setRemoteDescription(rtcSessionDescription)
        .then(() => {
          console.log("Setting remote description by offer");

          peerConnection
            .createAnswer()
            .then(sdp => {
              peerConnection.setLocalDescription(sdp);

              socket.emit("msg", {
                by: currentId,
                to: data.by,
                sdp: sdp,
                type: "sdp-answer"
              });
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e);
        });

      break;
    case "sdp-answer":
      rtcSessionDescription = new RTCSessionDescription(data.sdp);

      peerConnection
        .setRemoteDescription(rtcSessionDescription)
        .then(() => {
          console.log("Setting remote description by answer");
        })
        .catch(e => {
          console.error(e);
        });

      break;
    case "ice":
      if (data.ice) {
        console.log("Adding ice candidates");

        let rtcIceCandidate = new RTCIceCandidate(data.ice);
        peerConnection.addIceCandidate(rtcIceCandidate);
      }
      break;
  }
}

var socket = Io.connect(Config.SignalingServerUrl);

socket.on("peer.connected", function(peer) {
  makeOffer(peer.id);
});

socket.on("peer.disconnected", function(peer) {
  api.trigger("peer.disconnected", [peer]);
});

socket.on("msg", function(data) {
  handleSocketMessage(data);
});

socket.on("votes.update", function(votes) {
  api.trigger("votes.update", [votes]);
});

socket.on("conversation.type.set", function(conversation) {
  api.trigger("conversation.type.set", [conversation]);
});

socket.on("active.peer", function(peerId) {
  api.trigger("active.peer", [peerId]);
});

socket.on("time.left", function(secondsLeft) {
  api.trigger("time.left", [secondsLeft]);
});

/*
  The api variable is a way for Room.vue and Room.js to communicate.
  Room.js is the only place that we have access to the socket.
  In this way when we need to make a change in the view based on an event from a socket we can trigger in Room.js an event
  that Room.vue will listen to and apply the change to the view
*/
var api = {
  joinRoom: function(room) {
    let initPromise = new Promise((resolve, reject) => {
      if (!connected) {
        socket.emit(
          "init",
          {
            room: room
          },
          function(roomid, id) {
            resolve();
            currentId = id;
            roomId = roomid;
          }
        );
        connected = true;
      } else {
        reject();
      }
    });

    return initPromise;
  },
  createRoom: function() {
    let initPromise = new Promise(resolve => {
      socket.emit("init", null, function(roomid, id, conversation) {
        api.trigger("conversation.type.set", [conversation]);
        resolve(roomid);
        roomId = roomid;
        currentId = id;
        connected = true;
      });
    });

    return initPromise;
  },
  init: function(stream) {
    localStream = stream;
  },
  getSelfId: function() {
    return currentId;
  }
};

var eventEmitter = new EventEmitter();
Object.setPrototypeOf(api, Object.getPrototypeOf(eventEmitter));

api.on("votes.increment", function(peerId) {
  socket.emit("votes.increment", {
    id: peerId
  });
});

api.on("conversation.type.selected", function(type) {
  // We trigger the api again so we update the current user also. NOTE: We should not do that as the server must set this when all users have selected
  // api.trigger("conversation.type.set", [
  //   {
  //     type: type
  //   }
  // ]);
  socket.emit("conversation.type.selected", {
    type: type
  });
});

export default api;
