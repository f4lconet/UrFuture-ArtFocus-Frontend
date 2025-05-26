export interface User {
    id: string;
    name: string;
    email: string;
}
  
export interface Tokens {
    access_token: string;
    refresh_token: string;
}

export interface ApiError extends Error {
    status?: number;    
}

export class AuthService { // используется паттерн Singleton для единственного экземпляра класса
    private static instance: AuthService; // хранит этот единственный экземпляр класса

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // Проверка авторизации при загрузке страницы
    public async initializeAuth(): Promise<void> {
        const access_token = this.getAccessToken();

        if (!access_token) {
            this.redirectToLogin();
            return;
        }

        try {
            // const userData = await this.fetchUserData(access_token);
            // this.displayUserData(userData);
        } catch (error) {
            await this.handleAuthError(error as ApiError);
        }
    }

    // Получение данных пользователя
    // private async fetchUserData(token: string): Promise<User> {
    //     const response = await fetch('http://127.0.0.1:8000/api/login/', {
    //         headers: {
    //                 'Authorization': `Bearer ${token}`
    //         }
    //     })

    //     if (!response.ok) {
    //         const error: ApiError = new Error('Failed to fetch user data');
    //         error.status = response.status;
    //         throw error;
    //     }

    //     return await response.json() as User;
    // }

    // Обновление токенов
    private async refreshTokens(): Promise<Tokens> {
        const refresh_token = this.getRefreshToken();
        if (!refresh_token) throw new Error('No refresh token');

        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token })
        });

        if (!response.ok) {
        throw new Error('Refresh token failed');
        }

        const tokens = await response.json() as Tokens;
        this.storeTokens(tokens);
        return tokens;
    }

    // Обработка ошибок авторизации
    private async handleAuthError(error: ApiError): Promise<void> {
        console.error('Auth error:', error);

        if (error.status === 401) {
            try {
                const tokens = await this.refreshTokens();
                // const userData = await this.fetchUserData(tokens.access_token);
                // this.displayUserData(userData); // отображение на странице данных пользователя 
                return;
            } catch (refreshError) {
                console.error('Refresh failed:', refreshError);
            }
        }

        this.logout();
    }

    // Отображение данных пользователя
    // private displayUserData(user: User): void {
    //     const usernameElement = document.getElementById('username');
    //     const emailElement = document.getElementById('user-email');
        
    //     if (usernameElement) usernameElement.textContent = user.name;
    //     if (emailElement) emailElement.textContent = user.email;
    // }

    // Выход из системы
    public logout(): void {
        this.clearTokens();
        this.redirectToLogin();
    }

    // Работа с токенами
    private storeTokens(tokens: Tokens): void {
        localStorage.setItem('access', tokens.access_token);
        localStorage.setItem('refresh', tokens.refresh_token);
    }

    private getAccessToken(): string | null {
        return localStorage.getItem('access');
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem('refresh');
    }

    private clearTokens(): void {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    }

    private redirectToLogin(): void {
        window.location.href = '/authorization.html';
    }

    public redirectToAccDirection(): void {
        const access_token = this.getAccessToken();

        if (access_token) {
            window.location.href = '/account-direction.html';
        }
    }
}

// // Инициализация при загрузке страницы
// document.addEventListener('DOMContentLoaded', () => {
//     const authService = AuthService.getInstance();
//     authService.initializeAuth();
// });

// Экспорт для использования в других модулях
export const authService = AuthService.getInstance(); // Экспорт для использования в других модулях