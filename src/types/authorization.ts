// Типы для данных формы авторизации
export type LoginFormData = {
    email: string;
    password: string;
  };
  
  // Тип для ответа сервера
  export type AuthResponse = {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
    errors?: {
      field: keyof LoginFormData;
      message: string;
    }[];
  };
  
  // Тип для элементов DOM
  export type AuthPageElements = {
    form: HTMLFormElement;
    emailInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    errorContainer: HTMLElement | null;
  };