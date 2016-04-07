var email = require("emailjs"),
    Q = require("q");

/** @type {EMail} */
function EMail(_user, _password, _host, _ssl) {

    /** @type {EMail} */
    var result = {};

    function f_send(_text, _from, _to, _cc, _bcc, _subject, _html) {
        _from = _from || result.User;

        var defer = Q.defer(),
            mesaj = f_mesaj(_text, _from, _to, _cc, _bcc, _subject, _html),
            server = f_server();

        server.send(mesaj, function (err, message) {
            if (err) {
                console.log('Mail gönderilemedi! Hata:' + JSON.stringify(err));
                defer.reject(err);
            } else {
                console.log('Mail GÖNDERİLDİ');
                defer.resolve(message);
            }
        });
        return defer.promise;
    }

    function f_mesaj(_text, _from, _to, _cc, _bcc, _subject, _html) {
        if (!_to) {
            console.log("to> boş olamaz.Gönderilecek kişiyi seçiniz.");
            throw ("Gönderilecek kişiyi seçiniz.")
        }
        var message = {
            from: _from,
            to: _to,
            cc: _cc,
            subject: _subject,
            bcc: _bcc
        };

        if (!_html) {
            message.text = _text;
        } else {
            var icerik = "<html>" + result.SABIT.Baslik + _text + result.SABIT.Bitis + result.SABIT.Not + "</html>";
            message.attachment =
                [
                    {data: icerik, alternative: true}
                ];
        }

        return message;
    }

    function f_server() {
        return email.server.connect({
            user: result.User,
            password: result.Password,
            host: result.Host,
            ssl: result.SSL
        });
    }

    result.User = _user ? _user : "noreply.turkey@fmc-ag.com";
    result.Password = _password ? _password : "FRESE001";
    result.Host = _host ? _host : "smtp.fresenius.de";
    result.SSL = _ssl ? _ssl : true;
    result.SABIT = {
        Not: '<br/><br/><i>NOT: Bu e-posta, Fresenius Kuark Sistemi tarafından otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız!</i>',
        Baslik: 'Değerli Kullanıcılarımız,<br/><br/>',
        Bitis: '<br/><br/>İyi çalışmalar dileriz.'
    };

    /** @class EMail */
    result = {
        f_send: f_send
    };

    return result;

}

module.exports = /** @type {EMail} */EMail;