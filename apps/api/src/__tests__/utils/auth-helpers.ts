import request from "supertest";
import type { Express } from "express";

let authToken: string | null = null;

export async function getAuthToken(app: Express): Promise<string> {
  if (authToken) {
    return authToken;
  }

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      username: "demo",
      password: "demo123",
    })
    .expect(200);

  const token = response.body.data.token;
  authToken = token;
  return token;
}

export function resetAuthToken() {
  authToken = null;
}

export function createAuthenticatedRequest(
  app: Express,
  method: "get" | "post" | "put" | "delete" | "patch",
  path: string,
  token: string
) {
  return request(app)
    [method](path)
    .set("Authorization", `Bearer ${token}`);
}
