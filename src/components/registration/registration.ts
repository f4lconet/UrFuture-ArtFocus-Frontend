import '../../styles/registration.css';

import { RegistrationFormData, RegistrationResponse } from '../../types/registration';
import { RegistrationPageElements } from '../../types/dom';

class RegistrationForm {
  private elements: RegistrationPageElements;
  
  constructor() {
    this.elements = this.getPageElements();
    this.initEventListeners();
  }

  private getPageElements(): RegistrationPageElements {
    return {
      form: document.querySelector('.form') as HTMLFormElement,
      lastNameInput: document.getElementById('last-name') as HTMLInputElement,
      firstNameInput: document.getElementById('first-name') as HTMLInputElement,
      fatherNameInput: document.getElementById('father-name') as HTMLInputElement,
      emailInput: document.getElementById('mail') as HTMLInputElement,
      passwordInput: document.getElementById('password') as HTMLInputElement,
      repeatPasswordInput: document.getElementById('repeat-password') as HTMLInputElement,
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
      const response = await this.sendRegistrationRequest(formData);
      this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.elements.submitButton.disabled = false;
    }
  }

  private getFormData(): RegistrationFormData {
    return {
      lastName: this.elements.lastNameInput.value.trim(),
      firstName: this.elements.firstNameInput.value.trim(),
      fatherName: this.elements.fatherNameInput.value.trim() || undefined,
      email: this.elements.emailInput.value.trim(),
      password: this.elements.passwordInput.value,
      repeatPassword: this.elements.repeatPasswordInput.value,
    };
  }

  private validateForm(data: RegistrationFormData): {
    isValid: boolean;
    errors: { field: keyof RegistrationFormData; message: string }[];
  } {
    const errors: { field: keyof RegistrationFormData; message: string }[] = [];
    
    // Проверка обязательных полей
    if (!data.lastName) errors.push({ field: 'lastName', message: 'Фамилия обязательна' });
    if (!data.firstName) errors.push({ field: 'firstName', message: 'Имя обязательно' });
    if (!data.email) errors.push({ field: 'email', message: 'Email обязателен' });
    if (!data.password) errors.push({ field: 'password', message: 'Пароль обязателен' });
    
    // Валидация email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Введите корректный email' });
    }
    
    // Проверка совпадения паролей
    if (data.password && data.repeatPassword && data.password !== data.repeatPassword) {
      errors.push({ field: 'repeatPassword', message: 'Пароли не совпадают' });
    }
    
    // Проверка сложности пароля
    if (data.password && data.password.length < 8) {
      errors.push({ field: 'password', message: 'Пароль должен содержать минимум 8 символов' });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private async sendRegistrationRequest(
    data: Omit<RegistrationFormData, 'repeatPassword'>
  ): Promise<RegistrationResponse> {
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
  }

  private showErrors(errors: { field: keyof RegistrationFormData; message: string }[]): void {
    // Очистка предыдущих ошибок
    this.clearErrors();
    
    // Создаем контейнер для ошибок, если его нет
    if (!this.elements.errorContainer) {
      this.elements.errorContainer = document.createElement('div');
      this.elements.errorContainer.className = 'form__error-container';
      this.elements.form.insertBefore(
        this.elements.errorContainer,
        this.elements.form.querySelector('.form__handlers')
      );
    }
    
    // Добавляем ошибки в контейнер
    errors.forEach((error) => {
      const errorElement = document.createElement('p');
      errorElement.className = 'form__error-message';
      errorElement.textContent = error.message;
      this.elements.errorContainer?.appendChild(errorElement);
    });
  }

  private clearErrors(): void {
    if (this.elements.errorContainer) {
      this.elements.errorContainer.innerHTML = '';
    }
  }

  private handleResponse(response: RegistrationResponse): void {
    if (response.success) {
      // Перенаправление при успешной регистрации
      window.location.href = '/profile.html';
    } else if (response.errors) {
      this.showErrors(response.errors);
    } else {
      this.showErrors([{ field: 'email', message: response.message || 'Произошла ошибка' }]);
    }
  }

  private handleError(error: unknown): void {
    console.error('Registration error:', error);
    this.showErrors([{ 
      field: 'email', 
      message: error instanceof Error ? error.message : 'Произошла неизвестная ошибка' 
    }]);
  }
}

// Инициализация формы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new RegistrationForm();
});