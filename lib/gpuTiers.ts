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

// CPU 정보 (티어, 표시명)
const CPU_DATA: Record<string, { tier: number; label: string }> = {
    "7500f": { tier: 3, label: "RYZEN 5 7500F" },
    "7600": { tier: 4, label: "RYZEN 5 7600" },
    "7700": { tier: 5, label: "RYZEN 7 7700" },
    "7700x": { tier: 5, label: "RYZEN 7 7700X" },
    "9700x": { tier: 6, label: "RYZEN 7 9700X" },
    "7800x3d": { tier: 7, label: "RYZEN 7 7800X3D" },
    "9800x3d": { tier: 9, label: "RYZEN 7 9800X3D" },
    "9900x": { tier: 8, label: "RYZEN 9 9900X" },
    "9950x": { tier: 9, label: "RYZEN 9 9950X" },
    "5600": { tier: 1, label: "RYZEN 5 5600" },
    "5600x": { tier: 2, label: "RYZEN 5 5600X" },
    "5700x": { tier: 3, label: "RYZEN 7 5700X" },
    "5800x3d": { tier: 5, label: "RYZEN 7 5800X3D" },
    "12100": { tier: 1, label: "CORE i3-12100" },
    "12400": { tier: 2, label: "CORE i5-12400" },
    "13400": { tier: 3, label: "CORE i5-13400" },
    "14400": { tier: 3, label: "CORE i5-14400" },
    "13600": { tier: 5, label: "CORE i5-13600" },
    "14600": { tier: 5, label: "CORE i5-14600" },
    "13700": { tier: 6, label: "CORE i7-13700" },
    "14700": { tier: 7, label: "CORE i7-14700" },
    "13900": { tier: 8, label: "CORE i9-13900" },
    "14900": { tier: 9, label: "CORE i9-14900" },
    "245k": { tier: 6, label: "CORE ULTRA 5 245K" },
    "265k": { tier: 8, label: "CORE ULTRA 7 265K" },
    "285k": { tier: 9, label: "CORE ULTRA 9 285K" }
};

export interface CpuLookupResult {
    tier: number;
    label: string;
}

export function lookupCpu(cpuParam: string): CpuLookupResult | null {
    if (!cpuParam) return null;
    const cleaned = cpuParam.toLowerCase().replace(/[\s\-_]+/g, "");

    for (const [key, data] of Object.entries(CPU_DATA)) {
        if (cleaned.includes(key)) return data;
    }
    return null;
}

export interface GpuLookupResult {
    tier: number;
    brand: "nvidia" | "amd";
    config: TierConfig;
}

export function lookupGpu(gpuParam: string): GpuLookupResult | null {
    if (!gpuParam) return null;

    // 1. URL 인코딩 해제
    let decoded = gpuParam;
    try {
        decoded = decodeURIComponent(gpuParam);
    } catch (e) { }

    // 2. 정규화: 소문자화 + 한글 브랜드명 및 기호 제거
    // '라데온', '지포스' 등 한글 브랜드명도 제거하여 숫자와 영문 모델명만 남김
    const cleanedInput = decoded.toLowerCase()
        .replace(/rtx|rx|geforce|radeon|라데온|지포스/g, "")
        .replace(/[^a-z0-9]/g, ""); // 영문과 숫자 제외 모두 제거

    // 3. 검색 키워드 정렬 (긴 것 우선 - '4070ti'가 '4070'보다 먼저 걸리게)
    const sortedKeys = Object.keys(GPU_LOOKUP).sort((a, b) => b.length - a.length);

    // 4. 부분 일치 확인
    for (const key of sortedKeys) {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanedInput.includes(normalizedKey)) {
            const found = GPU_LOOKUP[key];
            const config = TIER_CONFIGS.find(t => t.tier === found.tier)!;
            return { tier: found.tier, brand: found.brand, config };
        }
    }

    // 5. [신규 추가] 인식 실패 시 가장 근접한 사양 혹은 기본 표준 사양으로 추천
    // 만약 상품명에 40, 50, 60, 70, 80, 90 등의 숫자가 있다면 해당 계열의 기본 티어로 fallback
    const numbers = cleanedInput.match(/\d{4}/); // 4060, 3070 등 4자리 숫자 추출
    if (numbers) {
        const num = numbers[0];
        if (num.startsWith("50")) return { tier: 6, brand: "nvidia", config: TIER_CONFIGS[5] };
        if (num.startsWith("40")) return { tier: 5, brand: "nvidia", config: TIER_CONFIGS[4] };
        if (num.startsWith("30")) return { tier: 3, brand: "nvidia", config: TIER_CONFIGS[2] };
    }

    // 완전히 알 수 없는 경우 '표준 게이밍(Tier 3)'을 기본값으로 하여 추천 서비스가 끊기지 않게 함
    return { tier: 3, brand: "nvidia", config: TIER_CONFIGS[2], isFallback: true } as any;
}

export function buildSearchUrl(cpu: string, gpu: string): string {
    return `https://www.youngjaecomputer.com/shop/search.php?search_text=${encodeURIComponent(`${cpu}+${gpu}`)}`;
}

/** CPU와 GPU 결과를 종합하여 상위/동급(밸런스)/하위 카드 데이터 생성 */
export function buildTierCards(gpuResult: GpuLookupResult, cpuResult: CpuLookupResult | null) {
    const { tier: gTier, brand, config: gConfig } = gpuResult;
    const cTier = cpuResult?.tier ?? 0;
    const maxTier = TIER_CONFIGS.length;

    // 1. 상위 제안: 기본적으로 한 단계 위 밸런스 셋트 제안
    const upperConfig = gTier < maxTier ? TIER_CONFIGS.find(t => t.tier === gTier + 1) : null;

    // 2. 동급 대안 / 밸런스 교정
    let sameCard = null;
    const altBrand = brand === "nvidia" ? "amd" : "nvidia";
    const altGpu = gConfig[altBrand];

    // 병목이 심한 경우 (CPU 티어가 GPU보다 2단계 이상 낮을 때) 밸런스 교정 제안을 우선함
    if (gTier > 0 && cTier > 0 && gTier - cTier >= 2) {
        const balancedConfig = TIER_CONFIGS.find(t => t.tier === gTier)!;
        sameCard = {
            label: "밸런스 교정",
            tierLabel: "CPU 성능 보강 제안",
            gpu: (balancedConfig.nvidia ?? balancedConfig.amd)!,
            cpu: balancedConfig.cpuDisplayName,
            searchUrl: buildSearchUrl(balancedConfig.cpu, (balancedConfig.nvidia ?? balancedConfig.amd)!.gpu),
            isCorrection: true
        };
    } else if (altGpu) {
        sameCard = {
            label: "동급 대안",
            tierLabel: `${gConfig.label} (브랜드 변경)`,
            gpu: altGpu,
            cpu: gConfig.cpuDisplayName,
            searchUrl: buildSearchUrl(gConfig.cpu, altGpu.gpu),
            isCorrection: false
        };
    }

    // 3. 가성비 선택: 한 단계 아래 밸런스 셋트 제안
    const lowerConfig = gTier > 1 ? TIER_CONFIGS.find(t => t.tier === gTier - 1) : null;

    return {
        upper: upperConfig ? {
            label: "상위 제안",
            tierLabel: upperConfig.label,
            gpu: (upperConfig.nvidia ?? upperConfig.amd)!,
            cpu: upperConfig.cpuDisplayName,
            searchUrl: buildSearchUrl(upperConfig.cpu, (upperConfig.nvidia ?? upperConfig.amd)!.gpu),
            isCorrection: false
        } : null,
        same: sameCard,
        lower: lowerConfig ? {
            label: "가성비 선택",
            tierLabel: lowerConfig.label,
            gpu: (lowerConfig.nvidia ?? lowerConfig.amd)!,
            cpu: lowerConfig.cpuDisplayName,
            searchUrl: buildSearchUrl(lowerConfig.cpu, (lowerConfig.nvidia ?? lowerConfig.amd)!.gpu),
            isCorrection: false
        } : null,
    };
}
