import assert from "node:assert/strict";
import test from "node:test";

import { isActiveSiteLink, siteLinks } from "./site-links.ts";

test("site links are in the expected route order", () => {
  assert.deepEqual(
    siteLinks.map((link) => [link.label, link.href]),
    [
      ["Home", "/"],
      ["Gatherings", "/gatherings"],
      ["About Us", "/about"],
      ["Let's Connect", "/connect"],
    ],
  );
});

test("active route matching treats home as exact only", () => {
  assert.equal(isActiveSiteLink("/", "/"), true);
  assert.equal(isActiveSiteLink("/gatherings", "/"), false);
});

test("active route matching includes nested section paths", () => {
  assert.equal(isActiveSiteLink("/gatherings", "/gatherings"), true);
  assert.equal(isActiveSiteLink("/gatherings/sunday", "/gatherings"), true);
  assert.equal(isActiveSiteLink("/about", "/gatherings"), false);
});
