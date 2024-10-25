"use client";

import { useState, useEffect } from "react";

// Custom hook to get user data from localStorage
export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser); // Parse JSON string to object
      setUser(userData?.data?.user); // Set the user data (adjust based on your data structure)
    }
  }, []);

  return user;
}
