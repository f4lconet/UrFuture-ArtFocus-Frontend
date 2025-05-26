import '../../styles/registration.css';
import { AuthService } from '../auth/auth.ts';


export interface IRegistrationData {
    email: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    direction: number;
    password: string;
}

export interface IApiResponse {
    success: boolean;
    message?: string;
    tokens?: {
        access: string;
        refresh: string;
    };
    user?: {
        id: string;
        email: string;
    };
}

export interface IFormElements {
    [key: string]: string | number;
}

// Класс для обработки регистрации
class RegistrationForm {
    private form: HTMLFormElement;
    private authService: AuthService;

    constructor(formElement: HTMLFormElement) {
        this.form = formElement;
        this.authService = AuthService.getInstance();
        this.init();
    }

    private init(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private serializeForm(): IRegistrationData {
        const formData = new FormData(this.form);
        
        return {
        email: formData.get('mail') as string,
        first_name: formData.get('first-name') as string,
        last_name: formData.get('last-name') as string,
        patronymic: formData.get('father-name') as string,
        direction: Number(formData.get('direction')),
        password: formData.get('password') as string
        };
    }

    private async handleSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        const formData = this.serializeForm();

        try {
        const response = await this.sendRegistrationData(formData);
        this.handleRegistrationResponse(response);
        } catch (error) {
        this.handleRegistrationError(error as Error);
        }
    }

    private async sendRegistrationData(data: IRegistrationData): Promise<IApiResponse> {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    private handleRegistrationResponse(response: IApiResponse): void {
        if (response.success && response.tokens) {
            localStorage.setItem('access', response.tokens.access);
            localStorage.setItem('refresh', response.tokens.refresh);
            
            // Перенаправляем пользователя
            this.authService.redirectToAccDirection();
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    }

    private handleRegistrationError(error: Error): void {
        console.error('Registration error:', error);
        // Отображение ошибки пользователю
        alert(`Ошибка регистрации: ${error.message}`);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const authService = AuthService.getInstance();
    authService.redirectToAccDirection();

    const form = document.querySelector('.form') as HTMLFormElement;
    if (form) {
        new RegistrationForm(form);
    }
});