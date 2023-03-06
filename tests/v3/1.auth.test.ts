import { newPesapal } from "./create-instance";

describe("authenticate with API", () => {
  const pesapal = newPesapal();
  test("should perform request successfully", async () => {
    await pesapal["auth"]();
  });
  test("api_credentials 'error' field should be null", () => {
    expect(pesapal["api_credentials"]?.error).toBeNull();
  });
  test("api_credentials 'token' should be provided", () => {
    expect(pesapal["api_credentials"]?.error).not.toBe("");
  });
  test("api_credentials should be valid (can access protected recourses)", async () => {
    await pesapal.getIPNs();
  });
});
