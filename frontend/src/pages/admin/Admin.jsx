import { useEffect, useState } from "react";
import AdminDashboard from "../../components/admin/AdminDashboard/AdminDashboard";
import "./Admin.css";

function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Could not check session");
        }

        const data = await response.json();
        setAuthenticated(data.authenticated);
      } catch {
        setError("Could not connect to the server");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setAuthenticated(true);
      setPassword("");
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setAuthenticated(false);
    } catch {
      window.alert("Could not log out. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="admin-page">
        <p>Checking login...</p>
      </main>
    );
  }

  if (authenticated) {
    return (
      <main className="admin-page">
        <AdminDashboard onLogout={handleLogout} />
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-login">
        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-password">Password</label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Admin;