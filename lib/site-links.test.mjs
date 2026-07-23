import assert from "node:assert/strict";
import test from "node:test";

import { isActiveSiteLink, siteLinks } from "./site-links.ts";

test("site links are in the expected route order", () => {
  assert.deepEqual(
    siteLinks.map((link) => [link.label, link.href]),
    [
      ["Home", "/"],
      ["Sunday Church", "/sunday-church"],
      ["Weekly Activities", "/weekly-activities"],
      ["Calendar", "/calendar"],
      ["Contacts", "/contacts"],
      ["Links", "/links"],
    ],
  );
});

test("active route matching treats home as exact only", () => {
  assert.equal(isActiveSiteLink("/", "/"), true);
  assert.equal(isActiveSiteLink("/sunday-church", "/"), false);
});

test("active route matching includes nested section paths", () => {
  assert.equal(isActiveSiteLink("/sunday-church", "/sunday-church"), true);
  assert.equal(isActiveSiteLink("/sunday-church/schedule", "/sunday-church"), true);
  assert.equal(isActiveSiteLink("/contacts", "/sunday-church"), false);
});
