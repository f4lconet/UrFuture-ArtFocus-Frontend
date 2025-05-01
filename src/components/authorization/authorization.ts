import '../../styles/authorization.css';

import { LoginFormData, AuthResponse, AuthPageElements } from '../../types/authorization';

class AuthForm {
  private elements: AuthPageElements;

  constructor() {
    this.elements = this.getPageElements();
    this.initEventListeners();
  }

  private getPageElements(): AuthPageElements {
    return {
      form: document.querySelector('.form') as HTMLFormElement,
      emailInput: document.getElementById('mail') as HTMLInputElement,
      passwordInput: document.getElementById('password') as HTMLInputElement,
      submitButton: document.querySelector('.form__submit-button') as HTMLButtonElement,
      errorContainer: document.querySelector('.form__error-container'),
    };
  }

  private initEventListeners(): void {
    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const formData = this.getFormData();
    const validationResult = this.validateForm(formData);
    
    if (!validationResult.isValid) {
      this.showErrors(validationResult.errors);
      return;
    }

    try {
      this.elements.submitButton.disabled = true;
      const response = await this.sendAuthRequest(formData);
      this.handleAuthResponse(response);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.elements.submitButton.disabled = false;
    }
  }

  private getFormData(): LoginFormData {
    return {
      email: this.elements.emailInput.value.trim(),
      password: this.elements.passwordInput.value,
    };
  }

  private validateForm(data: LoginFormData): {
    isValid: boolean;
    errors: { field: keyof LoginFormData; message: string }[];
  } {
    const errors: { field: keyof LoginFormData; message: string }[] = [];
    
    if (!data.email) {
      errors.push({ field: 'email', message: 'Email обязателен' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Введите корректный email' });
    }
    
    if (!data.password) {
      errors.push({ field: 'password', message: 'Пароль обязателен' });
    } else if (data.password.length < 6) {
      errors.push({ field: 'password', message: 'Пароль должен содержать минимум 6 символов' });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private async sendAuthRequest(data: LoginFormData): Promise<AuthResponse> {
    const response = await fetch('https://your-api-url.com/auth/login', {
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
  }

  private showErrors(errors: { field: keyof LoginFormData; message: string }[]): void {
    this.clearErrors();
    
    if (!this.elements.errorContainer) {
      this.elements.errorContainer = document.createElement('div');
      this.elements.errorContainer.className = 'form__error-container';
      this.elements.form.insertBefore(
        this.elements.errorContainer,
        this.elements.form.querySelector('.form__handlers')
      );
    }
    
    errors.forEach((error) => {
      const errorElement = document.createElement('p');
      errorElement.className = 'form__error-message';
      errorElement.textContent = error.message;
      this.elements.errorContainer?.appendChild(errorElement);
      
      // Подсветка проблемного поля
      const inputField = error.field === 'email' 
        ? this.elements.emailInput 
        : this.elements.passwordInput;
      inputField.classList.add('form__item_error');
    });
  }

  private clearErrors(): void {
    if (this.elements.errorContainer) {
      this.elements.errorContainer.innerHTML = '';
    }
    this.elements.emailInput.classList.remove('form__item_error');
    this.elements.passwordInput.classList.remove('form__item_error');
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.success && response.token) {
      // Сохраняем токен и данные пользователя
      localStorage.setItem('authToken', response.token);
      if (response.user) {
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      // Перенаправляем на защищенную страницу
      window.location.href = '/profile.html';
    } else {
      this.showErrors(
        response.errors || [{ field: 'email', message: response.message || 'Ошибка авторизации' }]
      );
    }
  }

  private handleError(error: unknown): void {
    console.error('Auth error:', error);
    this.showErrors([{
      field: 'email',
      message: error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
    }]);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new AuthForm();
});



export const authAPI = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await fetch('https://your-api-url.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    return response.json();
  },

  async checkAuth(token: string): Promise<AuthResponse> {
    const response = await fetch('https://your-api-url.com/auth/check', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Auth check failed with status ${response.status}`);
    }

    return response.json();
  }
};