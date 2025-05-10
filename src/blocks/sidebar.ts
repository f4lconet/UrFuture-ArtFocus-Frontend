import sidebarHTML from './sidebar.html';

export interface ISidebar {
    render(containerId: string): void;
}

export class Sidebar implements ISidebar {
    private sidebarHtml: string;

    constructor() {
        this.sidebarHtml = sidebarHTML;
    }

    public render(): void {
        const container = document.querySelector('#sidebar-placeholder');
        if (container) {
            container.innerHTML = this.sidebarHtml;
            console.log('Успех!');
        } else {
            console.error(`Контейнер не найден!`);
        }
    }
}