import '../../styles/account-direction.css';

import { Sidebar } from '../../blocks/sidebar.ts';

import { AuthService } from '../auth/auth.ts';

const sidebar = new Sidebar();
sidebar.render();


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const authService = AuthService.getInstance();
    authService.initializeAuth();
});