import '../../styles/registration.css';

import { AuthService } from '../auth/auth.ts';

// перенаправление на страницу "Мое направление", если пользователь авторизован
document.addEventListener('DOMContentLoaded', () => {
    const authService = AuthService.getInstance();
    authService.redirectToAccDirection();
});

const form = document.querySelector('.form') as HTMLFormElement;

type TFormType = number | string ;

const serializeForm = (formNode: HTMLFormElement) => {
    const formData = new FormData(formNode);
    const elements: Record<string, TFormType> = {};

    elements['email'] = formData.get('mail') as string;
    elements['first_name'] = formData.get('first-name') as string;
    elements['last_name'] = formData.get('last-name') as string;
    elements['patronymic'] = formData.get('father-name') as string;
    elements['direction'] = Number(formData.get('direction'));
    elements['password'] = formData.get('password') as string;

    return elements;
}

const handleFormSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const serializedForm = serializeForm(form);
    sendData(serializedForm);
}

if (form) {
    form.addEventListener('submit', handleFormSubmit);
}

async function sendData(data: Record<string, TFormType>): Promise<void> {
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const error = new Error('Ошибка регистрации');
        throw error;
    }

    window.alert('Регистрация произошла успешно!');
    window.location.href = '/authorization.html';

}