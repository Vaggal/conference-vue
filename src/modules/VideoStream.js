var stream;

let get = function () {
  let getUserMediaPromise = new Promise((resolve, reject) => {
    if (stream) {
      resolve(stream);
    } else {
      navigator.getUserMedia({
        video: true,
        audio: true
      }, function (s) {
        stream = s;
        resolve(stream);
      }, function (e) {
        reject(e);
      });
    }
  });

  return getUserMediaPromise;
}

export default {
  get: get
};
