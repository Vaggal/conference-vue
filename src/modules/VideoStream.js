var stream;

let get = function () {
  let getUserMediaPromise = new Promise((resolve, reject) => {
    // The if clause should be useful but i have not figured out yet for what :P
    if (stream) {
      resolve(stream);
    } else {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((mediaStream) => {
        stream = mediaStream;
        resolve(stream);
      }).catch((error) => {
        reject(error);
      });
    }
  });

  return getUserMediaPromise;
}

export default {
  get: get
};
