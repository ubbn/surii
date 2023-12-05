// Helper methods to access LocalStorage

const getItem = (id: string) => {
  try {
    const menuState = localStorage.getItem(id);
    return menuState ? JSON.parse(menuState) : null;
  } catch (e: any) {
    console.error("Aldaa: ", e);
  }
  return null;
};

const setItem = (id: string, value: any | undefined) => {
  localStorage.setItem(id, value ? JSON.stringify(value) : "");
};

export const getAuth = (): AuthResponse => {
  return getItem("auth");
};

export const setAuth = (token?: AuthResponse) => {
  return setItem("auth", token);
};
