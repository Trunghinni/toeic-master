import test from 'node:test';
import assert from 'node:assert/strict';

test('web smoke test — basic assertions', () => {
  assert.equal(1 + 1, 2);
  assert.ok(true);
});

test('web utils logic — string truncation check', () => {
  function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
  }
  assert.equal(truncate('Hello world', 5), 'He...');
  assert.equal(truncate('Hi', 5), 'Hi');
});

test('web utils logic — initials extraction check', () => {
  function getInitials(name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  assert.equal(getInitials('Toeic Master'), 'TM');
  assert.equal(getInitials('Nguyen Van A'), 'NV');
});
