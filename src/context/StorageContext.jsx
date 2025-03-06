import React, { createContext, useContext, useState, useEffect } from "react";

export const StorageContext = createContext();

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};

export const StorageProvider = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState({
    theme: "light",
    fontSize: "medium",
    language: "es",
    notifications: true
  });

  const [lastVisitedPages, setLastVisitedPages] = useState([]);

  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedPreferences = localStorage.getItem("userPreferences");
        if (storedPreferences) {
          setUserPreferences(JSON.parse(storedPreferences));
        }

        const storedPages = localStorage.getItem("lastVisitedPages");
        if (storedPages) {
          setLastVisitedPages(JSON.parse(storedPages));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    loadFromLocalStorage();
  }, []);

  const saveUserPreferences = (newPreferences) => {
    try {
      const updatedPreferences = { ...userPreferences, ...newPreferences };
      setUserPreferences(updatedPreferences);
      localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
      return true;
    } catch (error) {
      console.error("Error saving user preferences:", error);
      return false;
    }
  };

  const addVisitedPage = (page) => {
    try {
      const updatedPages = [page, ...lastVisitedPages.filter(p => p !== page)].slice(0, 5);
      setLastVisitedPages(updatedPages);
      localStorage.setItem("lastVisitedPages", JSON.stringify(updatedPages));
      return true;
    } catch (error) {
      console.error("Error saving visited page:", error);
      return false;
    }
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem("userPreferences");
      localStorage.removeItem("lastVisitedPages");
      setUserPreferences({
        theme: "light",
        fontSize: "medium",
        language: "es",
        notifications: true
      });
      setLastVisitedPages([]);
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  };

  return (
    <StorageContext.Provider
      value={{
        userPreferences,
        lastVisitedPages,
        saveUserPreferences,
        addVisitedPage,
        clearStorage
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}; 