import test from 'node:test';
import assert from 'node:assert/strict';
import { PANDALS } from '../js/data.js';

test('the original directory still contains all 179 pandals', () => {
  assert.equal(PANDALS.length, 179);
});

test('pandal IDs are unique and every record has usable map coordinates', () => {
  const ids = PANDALS.map((pandal) => pandal.id);
  assert.equal(new Set(ids).size, PANDALS.length);
  for (const pandal of PANDALS) {
    assert.ok(pandal.id && pandal.name && pandal.area && pandal.address);
    assert.ok(Number.isFinite(pandal.lat) && pandal.lat >= -90 && pandal.lat <= 90);
    assert.ok(Number.isFinite(pandal.lng) && pandal.lng >= -180 && pandal.lng <= 180);
  }
});

test('the existing Chandannagar and Bhadreswar split is preserved', () => {
  const counts = PANDALS.reduce((result, pandal) => {
    result[pandal.area] = (result[pandal.area] || 0) + 1;
    return result;
  }, {});
  assert.equal(counts.Chandannagar, 132);
  assert.equal(counts.Bhadreswar, 47);
});
