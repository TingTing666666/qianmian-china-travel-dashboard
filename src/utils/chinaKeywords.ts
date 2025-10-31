// China travel keyword generator

export const BASE_KEYWORDS = [
  'china travel',
  'china tourism',
  'china trip',
  'travel to china',
  'travel in china',
  'china vacation',
  'china sightseeing',
  'china backpacking',
  'china itinerary',
  'china travel guide',
  'china tour',
  'china vlog',
  'chinese travel',
  'chinese tourism',
  'asia travel china',
  'china adventure',
  'china culture travel',
  'china food travel',
  'china street food',
  'china budget travel',
  'china solo travel',
  'china family travel',
  'china road trip',
  'china must visit',
  'china best places',
  'china attractions'
]

export const PROVINCES_EN = [
  'Beijing', 'Shanghai', 'Tianjin', 'Chongqing',
  'Guangdong', 'Zhejiang', 'Jiangsu', 'Fujian', 'Hainan', 'Shandong', 'Henan', 'Hebei',
  'Shanxi', 'Shaanxi', 'Sichuan', 'Yunnan', 'Guizhou', 'Hubei', 'Hunan', 'Anhui', 'Jiangxi',
  'Liaoning', 'Jilin', 'Heilongjiang', 'Inner Mongolia', 'Guangxi', 'Ningxia', 'Xinjiang',
  'Tibet', 'Qinghai', 'Gansu', 'Taiwan', 'Hong Kong', 'Macau'
]

export const REGION_VARIANTS: Record<string, string[]> = {
  'Inner Mongolia': ['Inner Mongolia', 'Inner Mongol'],
  'Guangxi': ['Guangxi', "Guangxi Zhuang"],
  'Xinjiang': ['Xinjiang', 'Xinjiang Uyghur'],
  'Tibet': ['Tibet', 'Tibetan'],
  'Hong Kong': ['Hong Kong', 'HK'],
  'Macau': ['Macau', 'Macao']
}

export const PROVINCE_SUFFIXES = [
  'travel', 'tourism', 'trip', 'tour', 'vlog', 'guide', 'itinerary', 'attractions', 'places to visit'
]

function dedupe(items: string[]): string[] {
  const set = new Set<string>()
  items.forEach((i) => set.add(i.toLowerCase()))
  // Return original casing of first occurrence
  const seen = new Set<string>()
  const result: string[] = []
  for (const i of items) {
    const low = i.toLowerCase()
    if (!seen.has(low)) {
      seen.add(low)
      result.push(i)
    }
  }
  return result
}

export function generateChinaTravelKeywords(options?: {
  includeBase?: boolean
  includeProvinceCombos?: boolean
}): string[] {
  const includeBase = options?.includeBase ?? true
  const includeProvinceCombos = options?.includeProvinceCombos ?? true
  const out: string[] = []

  if (includeBase) {
    out.push(...BASE_KEYWORDS)
  }

  if (includeProvinceCombos) {
    for (const prov of PROVINCES_EN) {
      const variants = REGION_VARIANTS[prov] || [prov]
      for (const v of variants) {
        for (const suf of PROVINCE_SUFFIXES) {
          out.push(`${v} ${suf}`)
        }
        // Also add "travel ${prov}" forms
        out.push(`travel ${v}`)
        out.push(`${v} China travel`)
      }
    }
  }

  return dedupe(out)
}