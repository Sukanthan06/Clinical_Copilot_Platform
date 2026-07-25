// authService.js
// Wraps authentication calls. Currently returns mock data.
// Backend contract: authenticate_user()

const MOCK_DELAY = 500;

export async function authenticateUser({ email, password }) {
  await wait(MOCK_DELAY);

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  // TODO: replace with real call, e.g.
  // const res = await fetch(`${API_BASE_URL}/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) });
  // return res.json();

  return {
    success: true,
    user: {
      id: "user-001",
      name: "Sarah Whitfield",
      email,
      role: "patient",
    },
    token: "mock-jwt-token",
  };
}

export async function logoutUser() {
  await wait(200);
  return { success: true };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
