<?php

use App\Mail\Auth\CredentialsMail;
use App\Mail\Auth\ForgottenPasswordMail;
use App\Mail\Auth\VerificationMail;
use App\Models\User;

beforeEach(function () {
    config([
        'app.name' => 'Wiki Dance',
        'app.frontend_url' => 'http://localhost:3000',
        'mail.from.address' => 'hello@wikidance.test',
    ]);

    $this->user = new User([
        'name' => 'Mario Rossi',
        'email' => 'mario@example.com',
        'password' => 'super-secret-password-xyz',
    ]);
});

test('verification mail builds with the expected subject url and italian copy', function () {
    $code = 'verify-code-123';
    $mailable = new VerificationMail($this->user, $code);

    expect($mailable->render())->not->toBeEmpty();

    $mailable->assertHasSubject('Verifica il tuo indirizzo email');
    $mailable->assertSeeInHtml('http://localhost:3000/auth/email_verification/verify-code-123');
    $mailable->assertSeeInHtml($code);
    $mailable->assertSeeInOrderInHtml([
        'Ciao Mario Rossi, benvenuto su Wiki Dance.',
        'verifica il tuo indirizzo email',
        'Verifica email',
        'Se non hai creato un account, ignora pure questa email.',
        'Grazie!',
    ]);
});

test('forgotten password mail builds with the expected subject url and italian copy', function () {
    $code = 'reset-code-456';
    $mailable = new ForgottenPasswordMail($this->user, $code);

    expect($mailable->render())->not->toBeEmpty();

    $mailable->assertHasSubject('Reimposta la tua password');
    $mailable->assertSeeInHtml('http://localhost:3000/auth/new_password/reset-code-456');
    $mailable->assertSeeInHtml($code);
    $mailable->assertSeeInOrderInHtml([
        'Password dimenticata',
        'richiesta di reimpostazione della password',
        'Reimposta password',
        'Se non hai richiesto tu questa operazione, ignora pure questa email.',
    ]);
});

test('credentials mail builds with the expected subject login url and italian copy without a password', function () {
    $mailable = new CredentialsMail($this->user);

    expect($mailable->render())->not->toBeEmpty();

    $mailable->assertHasSubject('Benvenuto su Wiki Dance');
    $mailable->assertSeeInHtml('http://localhost:3000/auth/login');
    $mailable->assertSeeInOrderInHtml([
        'Benvenuto su Wiki Dance',
        'il tuo account è stato creato',
        'mario@example.com',
        'Accedi',
    ]);
    $mailable->assertDontSeeInHtml('super-secret-password-xyz');
    $mailable->assertDontSeeInHtml($this->user->password);
});
