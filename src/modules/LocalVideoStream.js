var stream;

var mediaConstraints = {
  audio: true,
  video: true,
};

let get = function () {
  let getUserMediaPromise = new Promise((resolve, reject) => {
    // The if clause should be useful but I have not figured out yet for what :P
    if (stream) {
      resolve(stream);
    } else {
      navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then((mediaStream) => {
          mediaStream.onremovetrack = (event) => {
            console.log("Removed track: ", event);
          };
          stream = mediaStream;
          resolve(stream);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });

  return getUserMediaPromise;
};

export default {
  get: get,
};
