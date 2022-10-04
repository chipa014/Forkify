import { TIMEOUT_SEC } from './config.js';

//API documentation: https://forkify-api.herokuapp.com/v2

/**
 * Returns a rejected promise after s seconds
 * @param {Number} s
 * @returns A rejected promise
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * A helper function that handles different requests to the API
 * @param {string} url
 * @param {Object} options
 * @returns
 */
const handleJSON = async function (url, options = undefined) {
  try {
    // 1. Form a request to the API
    const request = options ? fetch(url, options) : fetch(url);

    // 2. Have it race against the clock. If it takes too long, gut it.
    const promiseRace = await Promise.race([request, timeout(TIMEOUT_SEC)]);

    // 3. Get the JSON and return it
    const data = await promiseRace.json();
    if (!promiseRace.ok)
      throw new Error(`😀${data.message} (${promiseRace.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * GET method from the API
 * @param {*} url
 * @returns
 */
export const getJSON = async function (url) {
  try {
    return handleJSON(url);
  } catch (err) {
    throw err;
  }
};

/**
 * POST method from the API
 * @param {String} url
 * @param {Object} uploadData
 * @returns
 */
export const sendJSON = async function (url, uploadData) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    };
    return handleJSON(url, options);
  } catch (err) {
    throw err;
  }
};

/**
 * DELETE method from the API
 * @param {string} url
 * @returns
 */
export const deleteJSON = async function (url) {
  try {
    const options = {
      method: 'DELETE',
    };
    return handleJSON(url, options);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
