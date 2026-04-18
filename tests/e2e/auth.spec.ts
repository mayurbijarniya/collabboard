import { test, expect } from "../fixtures/test-helpers";

test.describe("Authentication Flow", () => {
  test("should request an email sign-in code", async ({ page }) => {
    let codeRequested = false;
    let authData: { email: string } | null = null;

    await page.route("**/api/auth/otp/request", async (route) => {
      codeRequested = true;
      const postData = await route.request().postDataJSON();
      authData = postData;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          email: "test@example.com",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          resendAvailableAt: new Date(Date.now() + 60 * 1000).toISOString(),
        }),
      });
    });

    await page.goto("/auth/signin");

    await page.getByLabel("Email address").fill("test@example.com");

    await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/auth/otp/request") &&
          resp.request().method() === "POST" &&
          resp.ok()
      ),
      page.getByRole("button", { name: "Continue with Email" }).click(),
    ]);

    expect(codeRequested).toBe(true);
    expect(authData).not.toBeNull();
    expect(authData!.email).toBe("test@example.com");
    await expect(page.locator("text=Enter your sign-in code")).toBeVisible();
  });

  test("should authenticate user and access dashboard", async ({
    authenticatedPage,
    testContext,
    testPrisma,
  }) => {
    const boardCount = await testPrisma.board.count({
      where: {
        createdBy: testContext.userId,
        organizationId: testContext.organizationId,
      },
    });
    expect(boardCount).toBe(0);

    await authenticatedPage.goto("/dashboard");

    await expect(authenticatedPage).toHaveURL(/.*dashboard/);
    await expect(authenticatedPage.locator("text=No boards yet")).toBeVisible();
  });

  test("should redirect unauthenticated users to signin", async ({ page }) => {
    await page.route("**/api/user", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unauthorized" }),
      });
    });

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*auth.*signin/);
  });

  test("should authenticate user via Google OAuth and access dashboard", async ({
    authenticatedPage,
    testContext,
    testPrisma,
  }) => {
    const googleUser = await testPrisma.user.upsert({
      where: { email: testContext.userEmail },
      update: {
        name: "Google User",
        image: "https://example.com/avatar.jpg",
      },
      create: {
        email: testContext.userEmail,
        name: "Google User",
        image: "https://example.com/avatar.jpg",
        organizationId: testContext.organizationId,
      },
    });

    const boardCount = await testPrisma.board.count({
      where: {
        createdBy: googleUser.id,
        organizationId: testContext.organizationId,
      },
    });
    expect(boardCount).toBe(0);

    await authenticatedPage.goto("/dashboard");

    await expect(authenticatedPage).toHaveURL(/.*dashboard/);
    await expect(authenticatedPage.locator("text=No boards yet")).toBeVisible();
  });

  test("should authenticate user via GitHub OAuth and access dashboard", async ({
    authenticatedPage,
    testContext,
    testPrisma,
  }) => {
    const githubUser = await testPrisma.user.upsert({
      where: { email: testContext.userEmail },
      update: {
        name: "GitHub User",
        image: "https://avatars.githubusercontent.com/u/123?v=4",
      },
      create: {
        email: testContext.userEmail,
        name: "GitHub User",
        image: "https://avatars.githubusercontent.com/u/123?v=4",
        organizationId: testContext.organizationId,
      },
    });

    const boardCount = await testPrisma.board.count({
      where: {
        createdBy: githubUser.id,
        organizationId: testContext.organizationId,
      },
    });
    expect(boardCount).toBe(0);

    await authenticatedPage.goto("/dashboard");

    await expect(authenticatedPage).toHaveURL(/.*dashboard/);
    await expect(authenticatedPage.locator("text=No boards yet")).toBeVisible();
  });

  test("should link email OTP and Google OAuth accounts when using same email", async ({
    page,
  }) => {
    const testEmail = `linked+${Date.now()}@example.com`;
    const userId = `linked-user-${Date.now()}`;
    let otpAuthData: { email: string } | null = null;
    let googleAuthData: { email: string } | null = null;

    await page.route("**/api/auth/otp/request", async (route) => {
      const postData = await route.request().postDataJSON();
      otpAuthData = postData;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          email: testEmail,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          resendAvailableAt: new Date(Date.now() + 60 * 1000).toISOString(),
        }),
      });
    });

    await page.route("**/api/auth/signin/google", async (route) => {
      const postData = await route.request().postDataJSON();
      googleAuthData = postData;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "/dashboard" }),
      });
    });

    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: userId,
            name: "Linked User",
            email: testEmail,
            image: "https://example.com/avatar.jpg",
            providers: ["otp", "google"],
          },
        }),
      });
    });

    await page.route("**/api/user", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: userId,
            name: "Linked User",
            email: testEmail,
            providers: ["otp", "google"],
          },
        }),
      });
    });

    await page.route("**/api/boards", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ boards: [] }),
      });
    });

    await page.goto("/auth/signin");

    await page.evaluate((email) => {
      const mockAuthData = { email };
      fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockAuthData),
      });
    }, testEmail);

    await page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/auth/otp/request") &&
        resp.request().method() === "POST" &&
        resp.ok()
    );

    expect(otpAuthData).not.toBeNull();
    expect(otpAuthData!.email).toBe(testEmail);

    await page.evaluate((email) => {
      const mockGoogleAuthData = { email };
      fetch("/api/auth/signin/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGoogleAuthData),
      });
    }, testEmail);

    await page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/auth/signin/google") &&
        resp.request().method() === "POST" &&
        resp.ok()
    );

    expect(googleAuthData).not.toBeNull();
    expect(googleAuthData!.email).toBe(testEmail);

    await page.goto("/dashboard");

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=No boards yet")).toBeVisible();

    expect(otpAuthData!.email).toBe(googleAuthData!.email);
  });

  test("should link email OTP and GitHub OAuth accounts when using same email", async ({
    page,
  }) => {
    const testEmail = `linked+${Date.now()}@example.com`;
    const userId = `linked-user-${Date.now()}`;
    let otpAuthData: { email: string } | null = null;
    let githubAuthData: { email: string } | null = null;

    await page.route("**/api/auth/otp/request", async (route) => {
      const postData = await route.request().postDataJSON();
      otpAuthData = postData;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          email: testEmail,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
          resendAvailableAt: new Date(Date.now() + 60 * 1000).toISOString(),
        }),
      });
    });

    await page.route("**/api/auth/signin/github", async (route) => {
      const postData = await route.request().postDataJSON();
      githubAuthData = postData;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "/dashboard" }),
      });
    });

    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: userId,
            name: "Linked User",
            email: testEmail,
            image: "https://avatars.githubusercontent.com/u/456?v=4",
            providers: ["otp", "github"],
          },
        }),
      });
    });

    await page.route("**/api/user", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: userId,
            name: "Linked User",
            email: testEmail,
            providers: ["otp", "github"],
          },
        }),
      });
    });

    await page.route("**/api/boards", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ boards: [] }),
      });
    });

    await page.goto("/auth/signin");

    await page.evaluate((email) => {
      const mockAuthData = { email };
      fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockAuthData),
      });
    }, testEmail);

    await page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/auth/otp/request") &&
        resp.request().method() === "POST" &&
        resp.ok()
    );

    expect(otpAuthData).not.toBeNull();
    expect(otpAuthData!.email).toBe(testEmail);

    await page.evaluate((email) => {
      const mockGitHubAuthData = { email };
      fetch("/api/auth/signin/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGitHubAuthData),
      });
    }, testEmail);

    await page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/auth/signin/github") &&
        resp.request().method() === "POST" &&
        resp.ok()
    );

    expect(githubAuthData).not.toBeNull();
    expect(githubAuthData!.email).toBe(testEmail);

    await page.goto("/dashboard");

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=No boards yet")).toBeVisible();

    expect(otpAuthData!.email).toBe(githubAuthData!.email);
  });

  test("should redirect to dashboard if already a member of the organization (join link)", async ({
    authenticatedPage,
    testContext,
    testPrisma,
  }) => {
    const invite = await testPrisma.organizationSelfServeInvite.create({
      data: {
        name: `Test Invite ${testContext.testId}`,
        organizationId: testContext.organizationId,
        createdBy: testContext.userId,
        isActive: true,
        usageLimit: 5,
        usageCount: 0,
        token: `token_${testContext.testId}`,
      },
    });

    await authenticatedPage.goto(`/join/${invite.token}`);

    await expect(authenticatedPage).toHaveURL(/.*dashboard/);
    await expect(authenticatedPage.locator("text=No boards yet")).toBeVisible();
  });
});
