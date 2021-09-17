import Io from "@/modules/Io";
import Config from "@/modules/Config";
import EventEmitter from "eventemitter3";

var peerConnections = {};
var currentId;
var selfUsername;
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

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.onicecandidate = function (event) {
    socket.emit("msg", {
      by: currentId,
      username: selfUsername,
      to: id,
      ice: event.candidate,
      type: "ice",
    });
  };

  peerConnection.ontrack = function (rtcTrackEvent) {
    api.emit("peer.track", {
      id: id,
      track: rtcTrackEvent.track,
    });
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
        offerToReceiveAudio: true,
      },
    })
    .then((sdp) => {
      peerConnection.setLocalDescription(sdp);
      console.log("Creating an offer for", id);

      socket.emit("msg", {
        by: currentId,
        username: selfUsername,
        to: id,
        sdp: sdp,
        type: "sdp-offer",
      });
    })
    .catch((error) => {
      console.log("Error making offer: ", error);
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
            .then((sdp) => {
              peerConnection.setLocalDescription(sdp);

              socket.emit("msg", {
                by: currentId,
                username: selfUsername,
                to: data.by,
                sdp: sdp,
                type: "sdp-answer",
              });
            })
            .catch((error) => {
              console.log("Error creating answer: ", error);
            });
        })
        .catch((error) => {
          console.log("Error setting remote description: ", error);
        });

      api.emit("add.peer", {
        id: data.by,
        username: data.username,
      });

      break;
    case "sdp-answer":
      rtcSessionDescription = new RTCSessionDescription(data.sdp);

      api.emit("add.peer", {
        id: data.by,
        username: data.username,
      });

      peerConnection
        .setRemoteDescription(rtcSessionDescription)
        .then(() => {
          console.log("Set the remote description by answer");
        })
        .catch((error) => {
          console.log("Error setting remote description: ", error);
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

var socket = Io(Config.SignalingServerUrl);

socket.on("peer.connected", function (peer) {
  makeOffer(peer.id);
});

socket.on("peer.disconnected", function (peer) {
  api.emit("peer.disconnected", peer);
});

socket.on("msg", function (data) {
  handleSocketMessage(data);
});
socket.on("comment", function (comment) {
  api.emit("comment", comment);
});

socket.on("votes.update", function (votes) {
  api.emit("votes.update", votes);
});

socket.on("conversation.type.set", function (conversation) {
  api.emit("conversation.type.set", conversation);
});

socket.on("active.peer", function (peerId) {
  api.emit("active.peer", peerId);
});

socket.on("time.left", function (secondsLeft) {
  api.emit("time.left", secondsLeft);
});

/*
  The api variable is a way for Room.vue and Room.js to communicate.
  Room.js is the only place that we have access to the socket.
  In this way when we need to make a change in the view based on an event from a socket we can trigger in Room.js an event
  that Room.vue will listen to and apply the change to the view
*/
let api = new EventEmitter();

api.joinRoom = (room) => {
  let initPromise = new Promise((resolve, reject) => {
    if (!connected) {
      socket.emit(
        "init",
        {
          room: room,
          username: selfUsername,
        },
        function (roomid, id) {
          resolve();
          currentId = id;
        }
      );
      connected = true;
    } else {
      reject();
    }
  });

  return initPromise;
};
api.createRoom = () => {
  let initPromise = new Promise((resolve) => {
    socket.emit(
      "init",
      {
        username: selfUsername,
      },
      function (roomid, id, conversation) {
        api.emit("conversation.type.set", conversation);
        resolve(roomid);
        currentId = id;
        connected = true;
      }
    );
  });

  return initPromise;
};
api.init = (stream) => {
  localStream = stream;
};
api.getSelfId = () => {
  return currentId;
};
api.setSelfUsername = (username) => {
  selfUsername = username;
};

// var eventEmitter = new EventEmitter();
// Object.setPrototypeOf(api, Object.getPrototypeOf(eventEmitter));

api.on("votes.increment", function (peerId) {
  socket.emit("votes.increment", {
    id: peerId,
  });
});

api.on("conversation.type.selected", function (id, type) {
  socket.emit("conversation.type.selected", {
    by: id,
    conversation: {
      type: type,
    },
  });
});
api.on("new-comment", function (message, id, username) {
  socket.emit("new-comment", {
    message: message,
    id: id,
    username: username,
  });
});

export default api;
