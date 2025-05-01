// Типы для данных формы регистрации
export type RegistrationFormData = {
    lastName: string;
    firstName: string;
    fatherName?: string; // Опциональное поле
    email: string;
    password: string;
    repeatPassword: string;
  };
  
  // Тип для ответа сервера
  export type RegistrationResponse = {
    success: boolean;
    message?: string;
    errors?: {
      field: keyof RegistrationFormData;
      message: string;
    }[];
    userId?: string;
  };