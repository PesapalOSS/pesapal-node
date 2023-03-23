import Pesapal from "../../dist/v3";

describe("Authenticate with API", () => {
  const pesapal = new Pesapal({ sandbox: "kenya" });

  test("should perform request successfully", async () => {
    await pesapal["client"]["ensureAuth"]();
  });
  test("api_credentials should not be null", () => {
    expect(pesapal["client"]["api_credentials"]).not.toBeNull();
  });
  test("api_credentials 'token' should be provided", () => {
    expect(pesapal["client"]["api_credentials"]?.token).not.toBe("");
  });
  test("api_credentials should be valid (can access protected recourses)", async () => {
    await pesapal.ipns.list();
  });
});
