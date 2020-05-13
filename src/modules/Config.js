let config = {
  SignalingServerUrl: "communicate.local:5555",
  RTCConfiguration: {
    iceServers: [
      {
        url: "stun:stun.l.google.com:19302",
      },
    ],
  },
};

export default config;
