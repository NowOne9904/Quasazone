import { lookupGpu, lookupCpu, buildTierCards } from "./gpuTiers";
import { YouTubeVideo, CafePost } from "./fetchers/mediaCrawler";
import { RecommendedPC } from "./fetchers/yjmodCrawler";

const COLORS = {
    bg: "#1a1a1a",
    border: "#333",
    textZinc: "#a1a1aa",
    textWhite: "#ffffff",
    indigo: "#818cf8",
    emerald: "#34d399",
    blue: "#60a5fa",
    rose: "#fb7185",
    amber: "#f59e0b",
    kakao: "#FEE500",
};

export interface StaticGeneratorProps {
    quotePrice?: number;
    quoteGpu?: string;
    quoteCpu?: string;
    ytVideo?: YouTubeVideo | null;
    cafePosts?: CafePost[];
    recommendedPcs?: RecommendedPC[];
}

export function generateStaticHtml({ quotePrice, quoteGpu, quoteCpu, ytVideo, cafePosts, recommendedPcs }: StaticGeneratorProps) {
    const gpuResult = quoteGpu ? lookupGpu(quoteGpu) : null;
    const cpuResult = quoteCpu ? lookupCpu(quoteCpu) : null;

    let content = "";

    // 해상도별 성능 지표 우선 노출 (스크린샷 참고)
    if (gpuResult) {
        content += `
            <!-- 해상도별 성능 섹션 -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px;">
                    <span style="color: ${COLORS.indigo}; font-weight: bold; font-size: 14px;">🖥️ 해상도별 게이밍 예상 성능</span>
                    <div style="display: flex; gap: 4px;">
                        ${cpuResult ? `<span style="background-color: rgba(255,255,255,0.1); color: #a1a1aa; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #333;">${cpuResult.label}</span>` : ''}
                        <span style="background-color: rgba(129, 140, 248, 0.1); color: #818cf8; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(129, 140, 248, 0.2);">${gpuResult.config.nvidia?.displayName ?? gpuResult.config.amd?.displayName}</span>
                    </div>
                </div>
                
                <table cellpadding="0" cellspacing="10" style="width: 100%; border-collapse: separate; table-layout: fixed;">
                    <tr>
                        ${["FHD", "QHD", "4K"].map((label, i) => {
            const colors = [COLORS.emerald, COLORS.blue, COLORS.rose];
            const color = colors[i];
            const resMultiplier = [1.0, 0.7, 0.4][i];
            const userTier = gpuResult.tier;
            const performanceMultiplier = 0.7 + (userTier - 1) * 0.15;
            const finalMultiplier = performanceMultiplier * resMultiplier;

            const games = [
                { name: "발로란트", base: 240 },
                { name: "배틀그라운드", base: 144 },
                { name: "GTA V", base: 144 }
            ];

            return `
                                <td style="background-color: rgba(255,255,255,0.03); border: 1px solid #333; border-radius: 12px; vertical-align: top; overflow: hidden;">
                                    <div style="padding: 10px 12px; border-bottom: 1px solid #333; background-color: rgba(255,255,255,0.02);">
                                        <div style="color: ${color}; font-weight: 900; font-size: 14px;">${label} <span style="font-size:8px;font-weight:normal;color:#666;">${["1920x1080", "2560x1440", "3840x2160"][i]}</span></div>
                                    </div>
                                    <div style="padding: 10px 12px;">
                                        ${games.map(g => {
                const fps = Math.round(g.base * finalMultiplier);
                const fpsStr = fps > 240 ? "240+" : `${fps}+`;
                return `
                                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                                    <span style="font-size: 10px; color: #888;">${g.name}</span>
                                                    <span style="font-size: 10px; color: ${color}; font-weight: bold;">${fpsStr}</span>
                                                </div>
                                            `;
            }).join("")}
                                    </div>
                                </td>
                            `;
        }).join("")}
                    </tr>
                </table>
            </div>
        `;
    }

    if (gpuResult) {
        const { upper, same, lower } = buildTierCards(gpuResult, cpuResult);
        const cards = [upper, same, lower];

        content += `
            <!-- 스마트 견적 제안 섹션 -->
            <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px;">
                    <span style="color: ${COLORS.indigo}; font-weight: bold; font-size: 14px;">⚡ 스마트 견적 제안</span>
                    <span style="font-size: 10px; color: #666;">
                        ${gpuResult.config.nvidia?.displayName ?? gpuResult.config.amd?.displayName} 기준
                    </span>
                </div>
                
                <table cellpadding="0" cellspacing="10" style="width: 100%; border-collapse: separate; table-layout: fixed;">
                    <tr>
                        ${cards.map((card, i) => {
            const styles = [
                { color: COLORS.emerald, label: "상위 제안" },
                { color: COLORS.blue, label: "동급 대안" },
                { color: COLORS.rose, label: "가성비 선택" }
            ][i];

            if (!card) {
                return `
                                    <td style="background-color: rgba(255,255,255,0.03); border: 1px dashed #444; border-radius: 12px; padding: 15px; text-align: center; vertical-align: middle;">
                                        <div style="font-size: 9px; color: #666;">제안 없음</div>
                                    </td>
                                `;
            }

            return `
                                <td style="background-color: rgba(255,255,255,0.05); border: 1px solid ${styles.color}44; border-radius: 12px; padding: 12px; vertical-align: top;">
                                    <div style="margin-bottom: 8px;">
                                        <span style="background-color: ${styles.color}22; color: ${styles.color}; font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
                                            ${card.label}
                                        </span>
                                    </div>
                                    <div style="font-size: 9px; color: ${COLORS.textZinc}; margin-bottom: 2px;">${card.cpu}</div>
                                    <div style="font-size: 11px; font-weight: 800; color: ${styles.color}; line-height: 1.2;">+ ${card.gpu.displayName}</div>
                                    <div style="font-size: 10px; color: #666; margin-top: 4px;">${card.tierLabel}</div>
                                    
                                    <div style="margin-top: 12px;">
                                        <a href="${card.searchUrl}" target="_blank" style="display: block; background-color: ${styles.color}22; color: ${styles.color}; text-decoration: none; font-size: 10px; font-weight: bold; text-align: center; padding: 6px; border-radius: 6px; border: 1px solid ${styles.color}33;">
                                            YJMOD 검색
                                        </a>
                                    </div>
                                </td>
                            `;
        }).join("")}
                    </tr>
                </table>
            </div>
        `;
    }

    // 카카오톡 버튼
    content += `
        <div style="margin-bottom: 24px;">
            <a href="https://pf.kakao.com/_sxmjxgT/chat" target="_blank" style="display: block; background-color: ${COLORS.kakao}; color: #371d1e; text-decoration: none; font-size: 14px; font-weight: 800; text-align: center; padding: 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                💬 카카오톡 실시간 견적 상담 문의
            </a>
        </div>
    `;

    // 실시간 조립/출고
    if (cafePosts && cafePosts.length > 0) {
        content += `
            <div style="margin-bottom: 24px; border: 1px solid #333; border-radius: 16px; overflow: hidden; background-color: rgba(255,255,255,0.02);">
                <div style="padding: 12px 16px; border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between;">
                    <span style="color: #ffffff; font-weight: bold; font-size: 12px;">🔔 실시간 조립/출고</span>
                    <span style="font-size: 10px; color: #666;">3h 갱신</span>
                </div>
                <div>
                    ${cafePosts.slice(0, 5).map((post) => `
                        <a href="${post.link}" target="_blank" style="display: block; padding: 12px 16px; border-bottom: 1px solid #222; text-decoration: none;">
                            <div style="font-size: 12px; font-weight: bold; color: #ccc; margin-bottom: 6px; line-height: 1.3;">${post.title}</div>
                            <div style="font-size: 10px; color: #666;">${post.time}</div>
                        </a>
                    `).join('')}
                </div>
                <div style="padding: 12px 16px;">
                    <a href="https://cafe.naver.com/f-e/cafes/31248285/menus/1?viewType=I" target="_blank" style="display: block; text-align: center; padding: 10px; background-color: rgba(255,255,255,0.05); color: #818cf8; font-size: 11px; font-weight: bold; border-radius: 8px; text-decoration: none; border: 1px solid #333;">
                        모든 출고현황 보기
                    </a>
                </div>
            </div>
        `;
    }

    // 유튜브 추천
    if (ytVideo) {
        content += `
            <div style="margin-bottom: 24px; border: 1px solid #333; border-radius: 16px; overflow: hidden; background-color: rgba(255,255,255,0.02);">
                <div style="background-color: rgba(239, 68, 68, 0.1); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                    <span style="color: #f87171; font-weight: bold; font-size: 12px;">▶ 최신 리뷰</span>
                    <span style="font-size: 9px; font-weight: bold; background-color: rgba(239, 68, 68, 0.2); color: #f87171; padding: 2px 6px; border-radius: 12px;">NEW</span>
                </div>
                <div style="padding: 16px;">
                    <a href="${ytVideo.url}" target="_blank" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                        <div style="width: 40px; height: 40px; background-color: rgba(239,68,68,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(239,68,68,0.3);">
                            <span style="color: #ef4444; font-size: 14px; margin-left: 2px;">▶</span>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: #eee; line-height: 1.4; margin-bottom: 4px;">${ytVideo.title}</div>
                            <div style="font-size: 10px; color: #666;">${ytVideo.publishedStr}</div>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }

    // 추천 PC
    if (recommendedPcs && recommendedPcs.length > 0) {
        content += `
            <div style="margin-bottom: 24px;">
                <div style="margin-bottom: 12px; padding: 0 4px;">
                    <span style="color: #ffffff; font-weight: bold; font-size: 12px;">★ 영재컴퓨터 추천 PC</span>
                </div>
                <table cellpadding="0" cellspacing="10" style="width: 100%; border-collapse: separate; table-layout: fixed;">
                    <tr>
                        ${recommendedPcs.slice(0, 2).map(pc => `
                            <td style="background-color: rgba(255,255,255,0.02); border: 1px solid #333; border-radius: 16px; vertical-align: top; width: 50%; padding: 0; overflow: hidden;">
                                <a href="${pc.link}" target="_blank" style="display: block; text-decoration: none;">
                                    <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.4), rgba(49, 46, 129, 0.1)); padding: 14px; text-align: center; border-bottom: 1px solid #333;">
                                        <span style="background-color: rgba(79, 70, 229, 0.9); color: #fff; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 12px; display: inline-block;">${pc.tabName.replace(" MD 추천 PC", " 베스트 모델")}</span>
                                    </div>
                                    <div style="padding: 16px 12px;">
                                        <div style="font-size: 12px; font-weight: bold; color: #eee; margin-bottom: 12px; line-height: 1.4; height: 34px; overflow: hidden;">${pc.name}</div>
                                        <div style="font-size: 16px; font-weight: 900; color: #818cf8; text-align: right;">${pc.price}<span style="font-size: 11px; color: #888; font-weight: normal; margin-left: 2px;">원</span></div>
                                    </div>
                                </a>
                            </td>
                        `).join('')}
                    </tr>
                </table>
            </div>
        `;
    }

    return `
        <!-- 영재컴퓨터 지능형 위젯 (정적 HTML 버전) -->
        <div style="width: 100%; max-width: 647px; margin: 0 auto; background-color: #1a1a1a; padding: 20px; border-radius: 16px; font-family: 'Malgun Gothic', Dotum, sans-serif; box-sizing: border-box; border: 1px solid #333;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 4px; height: 16px; background-color: ${COLORS.indigo}; border-radius: 2px; margin-right: 8px;"></div>
                    <span style="color: white; font-weight: 900; font-size: 18px; letter-spacing: -0.5px;">맞춤형 견적 솔루션</span>
                </div>
                <div style="background-color: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.2); color: #34d399; font-size: 9px; font-weight: bold; padding: 3px 8px; border-radius: 20px;">
                    Static Cached
                </div>
            </div>
            
            ${content}
            
            <div style="margin-top: 20px; text-align: center; font-size: 9px; color: #555;">
                본 정보는 시스템 사양에 따른 예상 성능이며, 실제 환경에 따라 차이가 있을 수 있습니다.
            </div>
        </div>
    `;
}
