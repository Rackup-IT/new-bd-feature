const {
  getLocale,
  addLocaleToPath,
  createLocalizedURL,
} = require("./src/middleware");

// Test the locale detection function
function testGetLocale() {
  const mockRequest = {
    cookies: {
      get: () => null,
    },
    headers: {
      get: (header) => {
        if (header === "accept-language") return "en-US,en;q=0.9,bn;q=0.8";
        return null;
      },
    },
  };

  const locale = getLocale(mockRequest);
  console.log("Detected locale:", locale);
  return locale === "en";
}

// Test the path addition function
function testAddLocaleToPath() {
  const result = addLocaleToPath("/test", "en");
  console.log("Path with locale:", result);
  return result === "/en/test";
}

// Test the URL creation function
function testCreateLocalizedURL() {
  const mockRequest = {
    nextUrl: {
      pathname: "/test",
      search: "?param=value",
    },
    url: "http://localhost:3000/test?param=value",
  };

  const url = createLocalizedURL(mockRequest, "bn");
  console.log("Localized URL:", url.href);
  return url.href === "http://localhost:3000/bn/test?param=value";
}

// Run tests
console.log("Running tests...");
const localeTestPassed = testGetLocale();
const pathTestPassed = testAddLocaleToPath();
const urlTestPassed = testCreateLocalizedURL();

console.log("\nTest Results:");
console.log(`- Locale detection: ${localeTestPassed ? "PASSED" : "FAILED"}`);
console.log(`- Path addition: ${pathTestPassed ? "PASSED" : "FAILED"}`);
console.log(`- URL creation: ${urlTestPassed ? "PASSED" : "FAILED"}`);

if (localeTestPassed && pathTestPassed && urlTestPassed) {
  console.log(
    "\nAll tests PASSED! The middleware implementation is working correctly."
  );
} else {
  console.log("\nSome tests FAILED. Please check the implementation.");
}
