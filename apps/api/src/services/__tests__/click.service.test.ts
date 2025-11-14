import { describe, it, expect, beforeEach } from "bun:test";
import { ClickService } from "../click.service";

describe("ClickService", () => {
  let service: ClickService;

  beforeEach(() => {
    service = new ClickService();
  });

  it("should create an instance of ClickService", () => {
    expect(service).toBeInstanceOf(ClickService);
  });
});
