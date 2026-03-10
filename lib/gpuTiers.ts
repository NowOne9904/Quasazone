export interface TierConfig {
    tier: number;
    label: string;
    nvidia: { gpu: string; displayName: string } | null;
    amd:   { gpu: string; displayName: string } | null;
}

// 성능 기준 티어 (낮을수록 저렴)
export const TIER_CONFIGS: TierConfig[] = [
    { tier: 1, label: "표준 게이밍",  nvidia: { gpu: "5060",    displayName: "RTX 5060"    }, amd: { gpu: "7600XT",  displayName: "RX 7600 XT"  } },
    { tier: 2, label: "미드레인지",   nvidia: { gpu: "5060Ti",  displayName: "RTX 5060 Ti" }, amd: { gpu: "7700XT",  displayName: "RX 7700 XT"  } },
    { tier: 3, label: "고성능",       nvidia: { gpu: "4070",    displayName: "RTX 4070"    }, amd: { gpu: "7800XT",  displayName: "RX 7800 XT"  } },
    { tier: 4, label: "하이엔드",     nvidia: { gpu: "5070",    displayName: "RTX 5070"    }, amd: { gpu: "9070XT",  displayName: "RX 9070 XT"  } },
    { tier: 5, label: "플래그십",     nvidia: { gpu: "5070Ti",  displayName: "RTX 5070 Ti" }, amd: { gpu: "9080",    displayName: "RX 9080"     } },
    { tier: 6, label: "익스트림",     nvidia: { gpu: "5080",    displayName: "RTX 5080"    }, amd: null },
    { tier: 7, label: "얼티밋",       nvidia: { gpu: "5090",    displayName: "RTX 5090"    }, amd: null },
];

// GPU 문자열 → { tier, brand }
const GPU_LOOKUP: Record<string, { tier: number; brand: "nvidia" | "amd" }> = {
    // NVIDIA 40 series
    "4060":       { tier: 1, brand: "nvidia" },
    "4060ti":     { tier: 2, brand: "nvidia" },
    "4070":       { tier: 3, brand: "nvidia" },
    "4070super":  { tier: 3, brand: "nvidia" },
    "4070ti":     { tier: 4, brand: "nvidia" },
    "4070tis":    { tier: 4, brand: "nvidia" },
    "4070tisuper":{ tier: 4, brand: "nvidia" },
    "4080":       { tier: 5, brand: "nvidia" },
    "4080super":  { tier: 5, brand: "nvidia" },
    "4090":       { tier: 6, brand: "nvidia" },
    // NVIDIA 50 series
    "5060":       { tier: 1, brand: "nvidia" },
    "5060ti":     { tier: 2, brand: "nvidia" },
    "5070":       { tier: 4, brand: "nvidia" },
    "5070ti":     { tier: 5, brand: "nvidia" },
    "5080":       { tier: 6, brand: "nvidia" },
    "5090":       { tier: 7, brand: "nvidia" },
    // AMD RX 7000
    "7600":       { tier: 1, brand: "amd" },
    "7600xt":     { tier: 1, brand: "amd" },
    "7700":       { tier: 2, brand: "amd" },
    "7700xt":     { tier: 2, brand: "amd" },
    "7800xt":     { tier: 3, brand: "amd" },
    "7900gre":    { tier: 4, brand: "amd" },
    "7900xt":     { tier: 5, brand: "amd" },
    "7900xtx":    { tier: 6, brand: "amd" },
    // AMD RX 9000
    "9060xt":     { tier: 2, brand: "amd" },
    "9070":       { tier: 4, brand: "amd" },
    "9070xt":     { tier: 4, brand: "amd" },
    "9080":       { tier: 5, brand: "amd" },
};

/** URL 파라미터로 넘어온 GPU 문자열을 정규화 (RTX/RX/공백 제거, 소문자) */
function normalize(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace("rtx", "")
        .replace("geforce", "")
        .replace("radeon", "")
        .replace(/^rx/, "");
}

export interface GpuLookupResult {
    tier: number;
    brand: "nvidia" | "amd";
    config: TierConfig;
}

export function lookupGpu(gpuParam: string): GpuLookupResult | null {
    const key = normalize(gpuParam);
    const found = GPU_LOOKUP[key];
    if (!found) return null;
    const config = TIER_CONFIGS.find(t => t.tier === found.tier)!;
    return { tier: found.tier, brand: found.brand, config };
}

export function buildSearchUrl(gpuKeyword: string): string {
    return `https://www.youngjaecomputer.com/shop/search.php?search_text=${encodeURIComponent(gpuKeyword)}`;
}

/** GPU 결과로부터 상위/동급(브랜드변경)/하위 카드 데이터 생성 */
export function buildTierCards(result: GpuLookupResult) {
    const { tier, brand, config } = result;
    const maxTier = TIER_CONFIGS.length;

    const upperConfig = tier < maxTier ? TIER_CONFIGS.find(t => t.tier === tier + 1) : null;
    const lowerConfig = tier > 1       ? TIER_CONFIGS.find(t => t.tier === tier - 1) : null;

    // 동급은 반대 브랜드
    const altBrand = brand === "nvidia" ? "amd" : "nvidia";
    const altGpu = config[altBrand];

    return {
        upper: upperConfig ? {
            label: "상위 제안",
            tierLabel: upperConfig.label,
            gpu: (upperConfig.nvidia ?? upperConfig.amd)!,
            searchUrl: buildSearchUrl((upperConfig.nvidia ?? upperConfig.amd)!.gpu),
        } : null,
        same: altGpu ? {
            label: "동급 대안",
            tierLabel: `${config.label} (브랜드 변경)`,
            gpu: altGpu,
            searchUrl: buildSearchUrl(altGpu.gpu),
        } : null,
        lower: lowerConfig ? {
            label: "가성비 선택",
            tierLabel: lowerConfig.label,
            gpu: (lowerConfig.nvidia ?? lowerConfig.amd)!,
            searchUrl: buildSearchUrl((lowerConfig.nvidia ?? lowerConfig.amd)!.gpu),
        } : null,
    };
}
