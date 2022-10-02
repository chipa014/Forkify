import { TIMEOUT_SEC } from './config.js';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const handleJSON = async function (request) {
  try {
    const promiseRace = await Promise.race([request, timeout(TIMEOUT_SEC)]);
    const data = await promiseRace.json();
    if (!promiseRace.ok)
      throw new Error(`${data.message} (${promiseRace.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const getJSON = async function (url) {
  try {
    const request = await fetch(url);
    return handleJSON(request);
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const request = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    return handleJSON(request);
  } catch (err) {
    throw err;
  }
};
