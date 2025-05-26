import '../../styles/authorization.css';
import { AuthService } from '../auth/auth.ts';

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface IAuthFormData {
  email: string;
  password: string;
}

export interface IAuthError extends Error {
  statusCode?: number;
  responseData?: any;
}

// Класс для обработки авторизации
class AuthPage {
    private form: HTMLFormElement;
    private authService: AuthService;

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        this.authService = AuthService.getInstance();
        this.init();
    }

    private validateForm(data: IAuthFormData): { isValid: boolean; errors: Record<string, string> } {
        const errors: Record<string, string> = {};

        // Простая валидация email (только базовый формат)
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Введите корректный email';
        }

        // Валидация пароля (минимум 8 символов)
        if (!data.password || data.password.length < 8) {
            errors.password = 'Пароль должен содержать минимум 8 символов';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    private displayErrors(errors: Record<string, string>): void {
        // Сбрасываем все предыдущие ошибки
        this.form.querySelectorAll('.error-message').forEach(el => {
            (el as HTMLElement).textContent = '';
        });

        // Показываем новые ошибки
        for (const [field, message] of Object.entries(errors)) {
            const errorElement = this.form.querySelector(`.${field}-error`);
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }

    private init(): void {
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    private serializeForm(): IAuthFormData {
        const formData = new FormData(this.form);
        
        return {
            email: formData.get('mail') as string,
            password: formData.get('password') as string
        };
    }

    private async handleFormSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        const formData = this.serializeForm();
        const validation = this.validateForm(formData);

        if (!validation.isValid) {
            this.displayErrors(validation.errors);
            return;
        }

        try {
            await this.authenticateUser(formData);
            this.redirectToAccount();
        } catch (error) {
            this.handleAuthError(error as IAuthError);
        }
    }

    private async authenticateUser(data: IAuthFormData): Promise<void> {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error: IAuthError = new Error('Ошибка авторизации');
            error.statusCode = response.status;
        try {
            error.responseData = await response.json();
        } catch (e) {
            error.responseData = await response.text();
        }
        throw error;
        }

        const responseData: IAuthResponse = await response.json();
        this.storeTokens(responseData);
    }

    private storeTokens(tokens: IAuthResponse): void {
        localStorage.setItem('access', tokens.access_token);
        localStorage.setItem('refresh', tokens.refresh_token);
    }

    private redirectToAccount(): void {
        window.location.href = '/account-direction.html';
    }

    private handleAuthError(error: IAuthError): void {
        console.error('Authentication error:', error);
        
        // отображение ошибки пользователю
        const errorElement = document.getElementById('auth-error');
        if (errorElement) {
            errorElement.textContent = this.getErrorMessage(error);
            errorElement.style.display = 'block';
        }
    }

    private getErrorMessage(error: IAuthError): string {
        if (error.responseData?.detail) {
            return error.responseData.detail;
        }
        
        switch (error.statusCode) {
        case 401:
            return 'Неверный email или пароль';
        case 400:
            return 'Некорректные данные';
        case 500:
            return 'Ошибка сервера';
        default:
            return 'Произошла ошибка при авторизации';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const authService = AuthService.getInstance();
    authService.redirectToAccDirection();
    
    const form = document.querySelector('.form') as HTMLFormElement;
    if (form) {
        new AuthPage(form);
    }
});