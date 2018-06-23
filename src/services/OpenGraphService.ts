import * as ogs from 'open-graph-scraper';

export class OpenGraphService
{
    options = {
        url: '',
        timeout: 40000,
        blacklist: [],
        encoding: 'utf8'
    };

    static async scrapeSite(url: string, callback: Function) {
        var opt = { 'url': url };

        return ogs(opt, callback);
    }
}

export interface OpenGraphResult
{
    ogTitle: string;
    ogImage: Object[] | Object;
    ogSiteName: string;
    ogUrl: string;
    ogLocale: string;
    ogDescription: string;
}

interface OpenGraphRaw
{
    data: OpenGraphResult
}
