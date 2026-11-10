MiAuspedagem

Sistema web para reserva e gerenciamento de hospedagens para cães. O projeto conta com uma interface para tutores realizarem solicitações de reserva e um painel exclusivo para o proprietário gerenciar os agendamentos.

Funcionalidades

Área do Cliente

Calendário Interativo: 
Permite ao tutor visualizar os dias disponíveis e selecionar múltiplas datas desejadas.
Busca Automática de Endereço (ViaCEP): 
Ao inserir o CEP, os dados do logradouro, bairro, cidade e estado são preenchidos automaticamente.
Formulário Completo: 
Coleta detalhada dos dados do tutor e especificações do pet (raça, peso, necessidades especiais).
Modal Informativo: 
Instruções claras de funcionamento para o usuário antes do envio da solicitação.

Área do Proprietário 

Painel Administrativo: 
Acesso protegido por senha para gestão dos agendamentos.
Ação Rápida via WhatsApp: 
Integração direta que gera uma mensagem personalizada no WhatsApp do tutor para confirmar os detalhes da reserva.
Status e Gestão de Agendamentos: 
Marque solicitações como pendentes/confirmadas ou exclua cadastros finalizados.
Persistência Local: 
Salva o estado e os dados das solicitações diretamente no navegador via localStorage.

Tecnologias Utilizadas

HTML5: 
Estruturação semântica da aplicação.
CSS3: 
Estilização responsiva personalizada com tipografia integrada.
JavaScript: 
Manipulação de DOM, gerenciamento do calendário, integração com APIs e controle de fluxo do sistema.
API ViaCEP: 
Consulta automatizada de CEP para autopreenchimento de endereço.

Estrutura de Arquivos

index.html    - Estrutura principal da página (cliente e admin).
style.css     - Estilização completa do layout, modal e calendário.
script.js     - Lógica do sistema, calendário e gerenciamento de reservas.
doggy.jpeg    - Imagem principal de interação da tela inicial.


<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# hospedapet
