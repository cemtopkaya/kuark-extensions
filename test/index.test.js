var index = require('../src/index'),
    chai = require('chai'),
    expect = require('chai').expect;

describe('Uzantıların testi', function () {
    it('Türkçe karakterleri büyük harfe çevir', function () {
        expect('istisnai'.turkishToUpper()).to.equal('İSTİSNAİ');
    });

    it('SSG ile başarılı mesajı göstermek', function () {
        index.ssg = [{"deneme": {i:1}}];
        return true;
    });

    it('SSR ile başarılı mesajı göstermek', function () {
        index.ssr = [{"deneme": {i:1}}];
        return true;
    });

    it('Bugüne 1 gün ekleme', function () {
        var bugun = new Date(),
            eklenecekGun = 1,
            yarin = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate() + eklenecekGun),
            testYarin = bugun.f_addDays(1),
            sTestYarin = testYarin.toDateString(),
            sBugun = bugun.toDateString(),
            sYarin = yarin.toDateString();

        console.log("Bugun: ", sBugun, " Yarın:", sYarin, "Test Yarın:", sTestYarin);
        expect(sTestYarin).to.equal(sYarin);
    });
});
