<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', 'Wiki Dance')</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'IBM Plex Sans', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f4f5" style="background-color:#f4f4f5;font-family:'IBM Plex Sans', Arial, sans-serif;">
        <tr>
            <td align="center" style="padding:24px 16px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
                    <tr>
                        <td align="left" style="padding:24px 32px;border-bottom:3px solid #7c3aed;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:20px;font-weight:700;color:#7c3aed;">
                            Wiki Dance
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding:32px;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:16px;line-height:1.6;color:#3f3f46;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding:20px 32px;border-top:1px solid #e4e4e7;background-color:#fafafa;font-family:'IBM Plex Sans', Arial, sans-serif;font-size:12px;line-height:1.5;color:#71717a;">
                            {{ config('app.name') }}<br>
                            <a href="mailto:{{ config('mail.from.address') }}" style="color:#7c3aed;text-decoration:none;">{{ config('mail.from.address') }}</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
