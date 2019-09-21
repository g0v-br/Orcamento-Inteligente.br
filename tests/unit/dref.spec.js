import { dref } from "@/models/bgo.js";

describe('Derf function', () => {
    const namespace = "http://localhost/";
    const rules = [
        { "regexp": ".*", "targets": [`${namespace}app.ttl`] },
        { "regexp": ".*/account/(.+)", "targets": [`${namespace}account/$1.ttl`], "isLast": true },
        { "regexp": ".*/partition/(.+)", "targets": [`${namespace}accounts.ttl`, `${namespace}partition/$1.ttl`], "isLast": true },
        { "regexp": ".*/(credits|terms)$", "targets": [`${namespace}$1.ttl`], "isLast": true },
    ];

    it('deref "http:/qualsiasicosa/partition/pippo"', () => {
        expect(dref("http:/qualsiasicosa/partition/pippo", rules)).toEqual([
            "http://localhost/app.ttl",
            "http://localhost/accounts.ttl",
            "http://localhost/partition/pippo.ttl"
        ])
    })

    it('deref "/partition/overview"', () => {
        expect(dref("/partition/overview", rules)).toEqual([
            "http://localhost/app.ttl",
            "http://localhost/accounts.ttl",
            "http://localhost/partition/overview.ttl"
        ])
    })

    it('deref "/account/id"', () => {
        expect(dref("/account/id", rules)).toEqual([
            "http://localhost/app.ttl",
            "http://localhost/account/id.ttl"
        ])
    })

    it('deref "/nonesiste"', () => {
        expect(dref("/nonesiste", rules)).toEqual([
            "http://localhost/app.ttl",
            "/nonesiste",
        ])
    })
})
