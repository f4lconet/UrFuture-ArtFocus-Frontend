declare module "*.html" {
    const content: string;
    export default content;
  }
  
// тот файл говорит TypeScript, что все файлы с расширением .html должны импортироваться как строки