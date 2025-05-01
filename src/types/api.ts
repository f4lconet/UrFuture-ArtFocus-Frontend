import { RegistrationFormData, RegistrationResponse } from "./registration";

export interface ApiClient {
    register: (data: RegistrationFormData) => Promise<RegistrationResponse>;
    // Другие методы API...
  }
  
  export const apiClient: ApiClient = {
    async register(data) {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    // Реализация других методов...
  };