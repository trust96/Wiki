@extends('emails.layout')

@section('title', 'Reimposta la tua password')

@section('content')
    <h1 style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:22px;line-height:1.3;font-weight:700;color:#18181b;">
        Password dimenticata
    </h1>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Ciao {{ $user->name }}, abbiamo ricevuto una richiesta di reimpostazione della password per il tuo account Wiki Dance. Clicca sul pulsante qui sotto per sceglierne una nuova.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
        <tr>
            <td align="center" bgcolor="#7c3aed" style="background-color:#7c3aed;border-radius:6px;">
                <a href="{{ $resetUrl }}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">Reimposta password</a>
            </td>
        </tr>
    </table>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:14px;line-height:1.6;color:#71717a;">
        Se il pulsante non funziona, copia e incolla questo link nel browser:<br>
        <a href="{{ $resetUrl }}" target="_blank" rel="noopener noreferrer" style="color:#7c3aed;text-decoration:underline;word-break:break-all;">{{ $resetUrl }}</a>
    </p>
    <p style="margin:0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Se non hai richiesto tu questa operazione, ignora pure questa email.
    </p>
@endsection
