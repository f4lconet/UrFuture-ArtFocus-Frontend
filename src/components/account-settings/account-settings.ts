import '../../styles/account-settings.css';

import { Sidebar } from '../../blocks/sidebar.ts';

const sidebar = new Sidebar();
sidebar.render();

import { AuthService } from '../auth/auth.ts';
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const authService = AuthService.getInstance();
    authService.initializeAuth();
});