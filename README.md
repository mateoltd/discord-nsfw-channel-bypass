# Discord Age-Gating

## Research Overview

This repository documents security research into Discord's client-side age-gating mechanism for NSFW content. The analysis examines how Discord's web application validates account age restrictions and identifies the attack surface that existed in older Discord client versions.

> **Note:** This research is for educational purposes and technical portfolio documentation. The vulnerability described no longer affects current Discord versions due to subsequent security improvements.

## Technical Background

Discord restricts access to NSFW-marked channels for accounts registered by users under 18. This research explores the implementation details of this restriction and demonstrates why client-side age validation presents a security weakness.

## Findings

### Vulnerable Architecture

Discord's web client architecture relies on Webpack module bundling, which exposes internal application state through the `window.webpackChunkdiscord_app` global object. User account metadata, including the `nsfwAllowed` flag, is stored in accessible JavaScript objects during runtime.

### Attack Vector

The vulnerability exploits two architectural weaknesses:

1. Module Enumeration: Discord's Webpack configuration allows arbitrary module injection, enabling runtime introspection of bundled modules and their exports.

2. Client-Side State Management: Age-gating flags are stored as mutable properties on user objects in JavaScript memory without server-side validation on channel access.

These can be used to perform a handful of other attacks aswell, such as enabling Discord Staff UI and getting access to experiments that don't require server-side validation.

The proof-of-concept code demonstrates module enumeration via Webpack injection:

```js
var findModule = a => window.webpackChunkdiscord_app.push(
  [[Math.random()], {}, b => {
    for (const c of Object.keys(b.c).map(a => b.c[a].exports).filter(a => a))
      if (c.default && c.default[a] !== void 0) return c.default
  }]
);

findModule("getCurrentUser").getCurrentUser().nsfwAllowed = !0;
```

**How it works:**
1. Injects a Webpack chunk to intercept module enumeration
2. Iterates through bundled modules to locate the user session module
3. Modifies the `nsfwAllowed` flag in the current user object
4. The modification persists in the client's session state

---

*Portfolio Note: This analysis documents security research conducted during my teenage years. It might not be accurate as I didn't have a good understanding of the underlying technology at that moment.
