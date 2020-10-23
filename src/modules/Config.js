let config = {
  SignalingServerUrl: window.location.host, // For dev environment communicate.local:5555
  RTCConfiguration: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  },
};

export default config;
