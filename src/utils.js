/* eslint-disable */
// Original code from : https://gist.github.com/mikelehen/3596a30bd69384624c11

/**
 * Fancy ID generator that creates 20-character string identifiers with the following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
 * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
 *    latter ones will sort after the former ones.  We do this by using the previous random bits
 *    but "incrementing" them by 1 (only in the case of a timestamp collision).
 */

// Modeled after base64 web-safe chars, but ordered by ASCII.
var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

// Timestamp of last push, used to prevent local collisions if you push twice in one ms.
var lastPushTime = 0;

// We generate 72-bits of randomness which get turned into 12 characters and appended to the
// timestamp to prevent collisions with other clients.  We store the last characters we
// generated because in the event of a collision, we'll use those same characters except
// "incremented" by one.
var lastRandChars = [];

function pushid() {
  var now = new Date().getTime();
  var duplicateTime = (now === lastPushTime);
  lastPushTime = now;

  var timeStampChars = new Array(8);
  for (var i = 7; i >= 0; i--) {
    timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
    // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
    now = Math.floor(now / 64);
  }

  if (now !== 0) {
    throw new Error('We should have converted the entire timestamp.');
  }

  var id = timeStampChars.join('');

  if ( duplicateTime ) {
    // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
    for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
      lastRandChars[i] = 0;
    }
    lastRandChars[i]++;
  }
  else {
    for (i = 0; i < 12; i++) {
      lastRandChars[i] = Math.floor(Math.random() * 64);
    }
  }

  for (i = 0; i < 12; i++) {
    id += PUSH_CHARS.charAt(lastRandChars[i]);
  }

  if ( id.length != 20 ) {
    throw new Error('Length should be 20.');
  }

  return id;
};

module.exports = {
  pushid
}
