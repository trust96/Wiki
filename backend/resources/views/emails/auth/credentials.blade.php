@extends('emails.layout')

@section('title', 'Benvenuto su Wiki Dance')

@section('content')
    <h1 style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:22px;line-height:1.3;font-weight:700;color:#18181b;">
        Benvenuto su Wiki Dance
    </h1>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
        Ciao {{ $user->name }}, il tuo account è stato creato. Da questo momento puoi accedere con l'indirizzo email:
    </p>
    <p style="margin:0 0 16px 0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;font-weight:600;color:#18181b;">
        {{ $user->email }}
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;">
        <tr>
            <td align="center" bgcolor="#7c3aed" style="background-color:#7c3aed;border-radius:6px;">
                <a href="{{ $loginUrl }}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">Accedi</a>
            </td>
        </tr>
    </table>
    <p style="margin:0;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:14px;line-height:1.6;color:#71717a;">
        Se il pulsante non funziona, copia e incolla questo link nel browser:<br>
        <a href="{{ $loginUrl }}" target="_blank" rel="noopener noreferrer" style="color:#7c3aed;text-decoration:underline;word-break:break-all;">{{ $loginUrl }}</a>
    </p>
@endsection
