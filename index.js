/**
 * Discord NSFW Channel Access - Webpack Module Enumeration PoC
 * 
 * This code demonstrates how Discord's Webpack module architecture
 * exposes user session state for runtime modification.
 * 
 * VULNERABILITY ANALYSIS:
 * The following code exploits the ability to inject custom Webpack chunks
 * to enumerate bundled modules and access unexported application state.
 */

var findModule = a => window.webpackChunkdiscord_app.push(
  [[Math.random()], {}, b => {
    for (const c of Object.keys(b.c).map(a => b.c[a].exports).filter(a => a))
      if (c.default && c.default[a] !== void 0) return c.default
  }]
);

/**
 * ATTACK FLOW:
 * 1. findModule("getCurrentUser") - Locates the user session module by name
 * 2. .getCurrentUser() - Retrieves the current user object
 * 3. .nsfwAllowed = !0 - Sets nsfwAllowed flag to true (truthy value)
 * 
 * This modifies the in-memory user object without server validation,
 * allowing the client to access NSFW-restricted channels.
 * 
 */

// Original minified one-liner (no longer functional):
// findModule("getCurrentUser").getCurrentUser().nsfwAllowed=!0;
