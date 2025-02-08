import { expect } from "chai";
import request from "supertest";

// Set the API base URL
const API_URL = "http://localhost:3000/api/user";

describe("GET /api/user", function () {
  // 🧪 1. Test when no user is logged in
  it("should return 401 if no user is logged in", async function () {
    const res = await request(API_URL).get("/");

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal("No user is logged in");
  });

  // 🧪 2. Test when user is logged in but does not exist in DB
  it("should return 404 if user does not exist", async function () {
    // Simulate a logged-in user with a fake Supabase session
    const fakeUser = {
      user: { id: "fake-user-id" },
    };

    // Mock Supabase & Prisma responses
    const res = await request(API_URL)
      .get("/")
      .set("Authorization", `Bearer fake_token`)
      .send({ authUser: fakeUser });

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal("User not found");
  });

  // 🧪 3. Test when user is found and returned successfully
  it("should return user details if user exists", async function () {
    // Simulate an existing user
    const existingUser = {
      user_id: "real-user-id",
      full_name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      phone: "1234567890",
      gender: "Male",
    };

    // Mock Prisma response
    const res = await request(API_URL)
      .get("/")
      .set("Authorization", `Bearer valid_token`)
      .send({ authUser: existingUser });

    expect(res.status).to.equal(200);
    expect(res.body).to.include({
      full_name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
    });
  });

  // 🧪 4. Test Prisma or Supabase failure
  it("should return 500 if there is a server error", async function () {
    // Simulate a Prisma error
    const res = await request(API_URL).get("/").send({ throwError: true });

    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal("Server Error");
  });
});
