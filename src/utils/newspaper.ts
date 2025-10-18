/**
 * peopleDailyPages
 * 使用今日年月日构造人民日报布局页链接，
 * 通过 window.$fetch 获取 HTML，并解析页面编号（如 01-08），返回编号数组。
 */
export async function peopleDailyPages(codeInput: string | number = '01'): Promise<Array<{ code: string; title: string; href: string; url: string; pdf?: string }>> {
  // 计算今日年月与日
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const ym = `${year}${month}`

  // 规范化 code（两位补零）
  const code = typeof codeInput === 'number' ? String(codeInput).padStart(2, '0') : String(codeInput).padStart(2, '0')

  const base = `https://paper.people.com.cn/rmrb/pc/layout/${ym}/${day}/`
  const url = `${base}node_${code}.html`

  const res = await window.$fetch(url)
  if ('error' in res) {
    console.error('PeopleDailyPages: 请求失败', res)
    return []
  }

  const html = res.data
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // 解析 PDF 链接（paper-bot 区域）
  let pdfUrl = ''
  const pdfAnchor = doc.querySelector('.paper-bot a[href*="attachement"]') as HTMLAnchorElement | null
  if (pdfAnchor) {
    const hrefRel = pdfAnchor.getAttribute('href') || ''
    try {
      // 以当前页面 URL 为基准解析相对路径 ../../../attachement/...
      pdfUrl = new URL(hrefRel, url).toString()
    } catch {}
  }

  // 解析 .swiper-container 内每个 .swiper-slide 中的 a[id="pageLink"]
  const anchors = Array.from(
    doc.querySelectorAll('.swiper-container .swiper-slide a[id="pageLink"]')
  )

  const infos = anchors
    .map((a) => {
      const href = a.getAttribute('href') || ''
      const text = (a.textContent || '').trim()

      // 提取页码（01-08）
      let pageCode = ''
      const mHref = href.match(/node_(\d{2})\.html/)
      if (mHref) {
        pageCode = mHref[1]
      } else {
        const mTextCode = text.match(/(\d{2})版/)
        if (mTextCode) pageCode = mTextCode[1]
      }

      // 提取标题（“02版：要闻” -> “要闻”）
      let title = ''
      const mTitle = text.match(/\d{2}版：?(.*)/)
      if (mTitle) title = mTitle[1].trim()
      if (!title) title = text

      const absUrl = new URL(href, base).toString()
      const item: { code: string; title: string; href: string; url: string; pdf?: string } = { code: pageCode, title, href, url: absUrl }
      // 仅为当前 code 的对象附加 pdf 链接
      if (item.code === code && pdfUrl) item.pdf = pdfUrl
      return item
    })
    // 仅保留 01-08
    .filter((x) => !!x.code && Number(x.code) >= 1 && Number(x.code) <= 8)

  // 去重并保持原顺序（按 code 去重）
  const seen = new Set<string>()
  const result: Array<{ code: string; title: string; href: string; url: string; pdf?: string }> = []
  for (const info of infos) {
    if (!seen.has(info.code)) {
      seen.add(info.code)
      result.push(info)
    }
  }

  return result
}