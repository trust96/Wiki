@extends('emails.layout')

@section('title', 'Verifica il tuo indirizzo email')

@section('content')
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Ciao {{ $user->name }}, benvenuto su Wiki Dance.
    </p>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Per completare la registrazione, verifica il tuo indirizzo email cliccando sul pulsante qui sotto.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
        <tr>
            <td align="center" bgcolor="#7c3aed" style="background-color:#7c3aed;border-radius:6px;">
                <a href="{{ $verificationUrl }}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">Verifica email</a>
            </td>
        </tr>
    </table>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:14px;line-height:1.6;color:#71717a;">
        Se il pulsante non funziona, copia e incolla questo link nel browser:<br>
        <a href="{{ $verificationUrl }}" target="_blank" rel="noopener noreferrer" style="color:#7c3aed;text-decoration:underline;word-break:break-all;">{{ $verificationUrl }}</a>
    </p>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Se non hai creato un account, ignora pure questa email.
    </p>
    <p style="margin:0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Grazie!
    </p>
@endsection
