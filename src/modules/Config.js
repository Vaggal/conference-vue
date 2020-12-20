let env = process.env.NODE_ENV;
let signalingServerUrl;

if (env === "production") {
  signalingServerUrl = window.location.host;
} else {
  signalingServerUrl = "localhost:5555";
}

let config = {
  SignalingServerUrl: signalingServerUrl,
  RTCConfiguration: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  },
};

export default config;
