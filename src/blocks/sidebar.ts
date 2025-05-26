import sidebarHTML from './sidebar.html';

import { AuthService } from '../components/auth/auth.ts';

export interface ISidebar {
    render(containerId: string): void;
}

export class Sidebar implements ISidebar {
    private authService: AuthService;
    private sidebarHtml: string;

    constructor() {
        this.sidebarHtml = sidebarHTML;
        this.authService = AuthService.getInstance();
    }

    // рендер сайдбара на странице
    public render(): void {
        const container = document.querySelector('#sidebar-placeholder');
        if (container) {
            container.innerHTML = this.sidebarHtml;
            this.setupLogoutButton();
            console.log('Успех!');
        } else {
            console.error(`Контейнер не найден!`);
        }
    }

    // Выход по кнопке Logout в сайдбаре
    private setupLogoutButton(): void {
        const logoutButton = document.querySelector('#logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.authService.logout();
            });
        }
    }
}