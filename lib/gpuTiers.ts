export interface TierConfig {
    tier: number;
    label: string;
    cpu: string; // 대표 CPU (검색용)
    cpuDisplayName: string; // UI 표시용
    nvidia: { gpu: string; displayName: string } | null;
    amd: { gpu: string; displayName: string } | null;
}

// 성능 기준 티어 (낮을수록 저렴/구형)
export const TIER_CONFIGS: TierConfig[] = [
    { tier: 1, label: "엔트리/레거시", cpu: "5600", cpuDisplayName: "Ryzen 5 5600", nvidia: { gpu: "1660s", displayName: "GTX 1660 Super" }, amd: { gpu: "6600", displayName: "RX 6600" } },
    { tier: 2, label: "스타터 게이밍", cpu: "7500F", cpuDisplayName: "Ryzen 5 7500F", nvidia: { gpu: "4060", displayName: "RTX 4060" }, amd: { gpu: "7600", displayName: "RX 7600" } },
    { tier: 3, label: "표준 게이밍", cpu: "7500F", cpuDisplayName: "Ryzen 5 7500F", nvidia: { gpu: "5060", displayName: "RTX 5060" }, amd: { gpu: "7600XT", displayName: "RX 7600 XT" } },
    { tier: 4, label: "미드레인지", cpu: "7600", cpuDisplayName: "Ryzen 5 7600", nvidia: { gpu: "5060Ti", displayName: "RTX 5060 Ti" }, amd: { gpu: "7700XT", displayName: "RX 7700 XT" } },
    { tier: 5, label: "고성능", cpu: "7700X", cpuDisplayName: "Ryzen 7 7700X", nvidia: { gpu: "4070", displayName: "RTX 4070" }, amd: { gpu: "7800XT", displayName: "RX 7800 XT" } },
    { tier: 6, label: "하이엔드", cpu: "9700X", cpuDisplayName: "Ryzen 7 9700X", nvidia: { gpu: "5070", displayName: "RTX 5070" }, amd: { gpu: "9070XT", displayName: "RX 9070 XT" } },
    { tier: 7, label: "플래그십", cpu: "9800X3D", cpuDisplayName: "Ryzen 7 9800X3D", nvidia: { gpu: "5070Ti", displayName: "RTX 5070 Ti" }, amd: { gpu: "9080", displayName: "RX 9080" } },
    { tier: 8, label: "익스트림", cpu: "9900X", cpuDisplayName: "Ryzen 9 9900X", nvidia: { gpu: "5080", displayName: "RTX 5080" }, amd: null },
    { tier: 9, label: "얼티밋", cpu: "9950X", cpuDisplayName: "Ryzen 9 9950X", nvidia: { gpu: "5090", displayName: "RTX 5090" }, amd: null },
];

// GPU 문자열 → { tier, brand }
const GPU_LOOKUP: Record<string, { tier: number; brand: "nvidia" | "amd" }> = {
    // Legacy / Entry
    "1660": { tier: 1, brand: "nvidia" },
    "1660s": { tier: 1, brand: "nvidia" },
    "1660super": { tier: 1, brand: "nvidia" },
    "1660ti": { tier: 1, brand: "nvidia" },
    "2060": { tier: 1, brand: "nvidia" },
    "3060": { tier: 2, brand: "nvidia" },
    "3060ti": { tier: 3, brand: "nvidia" },

    // NVIDIA 40 series
    "4060": { tier: 2, brand: "nvidia" },
    "4060ti": { tier: 3, brand: "nvidia" },
    "4070": { tier: 5, brand: "nvidia" },
    "4070super": { tier: 5, brand: "nvidia" },
    "4070ti": { tier: 6, brand: "nvidia" },
    "4070tis": { tier: 6, brand: "nvidia" },
    "4070tisuper": { tier: 6, brand: "nvidia" },
    "4080": { tier: 7, brand: "nvidia" },
    "4080super": { tier: 7, brand: "nvidia" },
    "4090": { tier: 8, brand: "nvidia" },

    // NVIDIA 50 series
    "5060": { tier: 3, brand: "nvidia" },
    "5060ti": { tier: 4, brand: "nvidia" },
    "5070": { tier: 6, brand: "nvidia" },
    "5070ti": { tier: 7, brand: "nvidia" },
    "5080": { tier: 8, brand: "nvidia" },
    "5090": { tier: 9, brand: "nvidia" },

    // AMD
    "6600": { tier: 1, brand: "amd" },
    "6600xt": { tier: 2, brand: "amd" },
    "7600": { tier: 2, brand: "amd" },
    "7600xt": { tier: 3, brand: "amd" },
    "7700xt": { tier: 4, brand: "amd" },
    "7800xt": { tier: 5, brand: "amd" },
    "7900gre": { tier: 6, brand: "amd" },
    "7900xt": { tier: 7, brand: "amd" },
    "7900xtx": { tier: 8, brand: "amd" },
    "9070xt": { tier: 6, brand: "amd" },
    "9080": { tier: 7, brand: "amd" },
    "9060xt": { tier: 5, brand: "amd" }, // 테스트용 추가
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

// CPU 문자열 → Tier
const CPU_LOOKUP: Record<string, number> = {
    // AMD
    "7500f": 3, "7600": 4, "7700": 5, "7700x": 5, "9700x": 6, "7800x3d": 7, "9800x3d": 9, "9900x": 8, "9950x": 9,
    "5600": 1, "5600x": 2, "5700x": 3, "5800x3d": 5,
    // Intel
    "12100": 1, "12400": 2, "13400": 3, "14400": 3, "13600": 5, "14600": 5, "13700": 6, "14700": 7, "13900": 8, "14900": 9,
    "245k": 6, "265k": 8, "285k": 9
};

export function lookupCpu(cpuParam: string): number {
    if (!cpuParam) return 0;
    const cleaned = cpuParam.toLowerCase().replace(/[\s\-_]+/g, "");

    // 키워드 매칭 (예: "i5-14400F" -> "14400" 매칭)
    for (const [key, tier] of Object.entries(CPU_LOOKUP)) {
        if (cleaned.includes(key)) return tier;
    }
    return 0;
}

export interface GpuLookupResult {
    tier: number;
    brand: "nvidia" | "amd";
    config: TierConfig;
}

export function lookupGpu(gpuParam: string): GpuLookupResult | null {
    if (!gpuParam) return null;

    // 1. URL 인코딩 해제 및 정규화
    let decoded = gpuParam;
    try {
        decoded = decodeURIComponent(gpuParam);
    } catch (e) { }

    // 소문자 변환 및 공백, 특수문자, 브랜드명 제거하여 순수 모델명 추출 시도
    const cleanedInput = decoded.toLowerCase()
        .replace(/rtx|rx|geforce|radeon/g, "") // 브랜드명 제거
        .replace(/[\s\-_%20]+/g, "");         // 공백, 특수문자, %20 등 제거

    // 2. 검색 키워드 정렬 (긴 것 우선)
    const sortedKeys = Object.keys(GPU_LOOKUP).sort((a, b) => b.length - a.length);

    // 3. 부분 일치 확인
    for (const key of sortedKeys) {
        if (cleanedInput.includes(key.toLowerCase())) {
            const found = GPU_LOOKUP[key];
            const config = TIER_CONFIGS.find(t => t.tier === found.tier)!;
            return { tier: found.tier, brand: found.brand, config };
        }
    }

    return null;
}

export function buildSearchUrl(cpu: string, gpu: string): string {
    return `https://www.youngjaecomputer.com/shop/search.php?search_text=${encodeURIComponent(`${cpu}+${gpu}`)}`;
}

/** GPU 결과로부터 상위/동급(브랜드변경)/하위 카드 데이터 생성 */
export function buildTierCards(result: GpuLookupResult) {
    const { tier, brand, config } = result;
    const maxTier = TIER_CONFIGS.length;

    const upperConfig = tier < maxTier ? TIER_CONFIGS.find(t => t.tier === tier + 1) : null;
    const lowerConfig = tier > 1 ? TIER_CONFIGS.find(t => t.tier === tier - 1) : null;

    // 동급은 반대 브랜드
    const altBrand = brand === "nvidia" ? "amd" : "nvidia";
    const altGpu = config[altBrand];

    return {
        upper: upperConfig ? {
            label: "상위 제안",
            tierLabel: upperConfig.label,
            gpu: (upperConfig.nvidia ?? upperConfig.amd)!,
            cpu: upperConfig.cpuDisplayName,
            searchUrl: buildSearchUrl(upperConfig.cpu, (upperConfig.nvidia ?? upperConfig.amd)!.gpu),
        } : null,
        same: altGpu ? {
            label: "동급 대안",
            tierLabel: `${config.label} (브랜드 변경)`,
            gpu: altGpu,
            cpu: config.cpuDisplayName,
            searchUrl: buildSearchUrl(config.cpu, altGpu.gpu),
        } : null,
        lower: lowerConfig ? {
            label: "가성비 선택",
            tierLabel: lowerConfig.label,
            gpu: (lowerConfig.nvidia ?? lowerConfig.amd)!,
            cpu: lowerConfig.cpuDisplayName,
            searchUrl: buildSearchUrl(lowerConfig.cpu, (lowerConfig.nvidia ?? lowerConfig.amd)!.gpu),
        } : null,
    };
}
