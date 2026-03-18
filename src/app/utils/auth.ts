const ADMIN_KEY = "mlakehouse_admin";
const SESSION_KEY = "mlakehouse_session";

export interface Admin {
  username: string;
  password: string;
}

export const registerAdmin = (username: string, password: string): boolean => {
  try {
    const existingAdmin = localStorage.getItem(ADMIN_KEY);
    if (existingAdmin) {
      return false; // Admin already exists
    }

    const admin: Admin = { username, password };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    return true;
  } catch (error) {
    console.error("Error registering admin:", error);
    return false;
  }
};

export const loginAdmin = (username: string, password: string): boolean => {
  try {
    const adminData = localStorage.getItem(ADMIN_KEY);
    if (!adminData) {
      return false;
    }

    const admin: Admin = JSON.parse(adminData);
    if (admin.username === username && admin.password === password) {
      localStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error logging in:", error);
    return false;
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(SESSION_KEY) === "true";
};

export const hasAdminAccount = (): boolean => {
  return localStorage.getItem(ADMIN_KEY) !== null;
};
