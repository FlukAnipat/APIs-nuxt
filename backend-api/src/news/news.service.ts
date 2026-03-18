import { Injectable } from '@nestjs/common';

const RSS_SOURCES = [
  'http://news.thaipbs.or.th/rss/local.xml',
  'https://news.thaipbs.or.th/rss/local.xml',
];

@Injectable()
export class NewsService {
  async getFloodNews() {
    const results = await Promise.allSettled(
      RSS_SOURCES.map(url => this.fetchRSS(url))
    );

    const all: any[] = [];
    results.forEach(r => {
      if (r.status === 'fulfilled') all.push(...r.value);
    });

    // กรองซ้ำ
    const seen   = new Set<string>();
    const unique = all.filter(item => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    });

    // เรียงล่าสุดก่อน
    unique.sort((a, b) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return { total: unique.length, items: unique };
  }

  private async fetchRSS(url: string) {
    const res = await fetch(url);
    const xml = await res.text();
    return this.parseRSS(xml);
  }

  private parseRSS(xml: string) {
    const items: any[] = [];
    const blocks = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const block of blocks) {
      const get = (tag: string): string => {
        const m = block.match(
          new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
        );
        return m ? (m[1] || m[2] || '').trim() : '';
      };

      const enclosureUrl = block.match(/enclosure[^>]*url="([^"]+)"/)?.[1] || '';
      const mediaUrl     = block.match(/media:content[^>]*url="([^"]+)"/)?.[1] || '';
      const mediaThumbs  = block.match(/media:thumbnail[^>]*url="([^"]+)"/)?.[1] || '';
      const imgInDesc    = get('description').match(/<img[^>]+src="([^"]+)"/)?.[1] || '';
      const image        = enclosureUrl || mediaUrl || mediaThumbs || imgInDesc || '';
      const rawDesc      = get('description').replace(/<[^>]+>/g, '').trim();

      items.push({
        title:       get('title'),
        link:        get('link') || get('guid'),
        pubDate:     get('pubDate'),
        description: rawDesc.slice(0, 200),
        image,
        source:      'Thai PBS',
      });
    }
    return items;
  }
}