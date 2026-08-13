"use client";

import { getMediaAsset, isPublishableAsset } from "@/content/media";
import { withBasePath } from "@/lib/basePath";
import type { Credit } from "@/content/schema";
import { useReducedMotion } from "@/lib/useReducedMotion";

type MediaSlotProps = {
  /** `src/content/media.ts` 의 슬롯 ID. */
  slotId: string;
  /**
   * 크기·여백 클래스만 넘긴다.
   *
   * ⚠ **위치 지정 클래스(`absolute`·`fixed`)를 넘기지 말 것.** 이 컴포넌트는 출처 표기를
   * 우하단에 고정하기 위해 `relative` 를 쓰며, Tailwind 는 클래스 나열 순서가 아니라
   * 스타일시트 순서로 승자가 정해지므로 `absolute` 가 무시된다.
   * 배경으로 깔려면 절대배치 래퍼로 감싸고 여기엔 `h-full w-full` 만 넘긴다.
   */
  className?: string;
};

/**
 * 미디어 슬롯 — 영상 → 포스터 → 플레이스홀더 3단 폴백을 이 한 지점에서 처리한다.
 *
 * 자산이 준비되지 않았거나 공개 근거가 확인되지 않은 경우에도 레이아웃이 무너지지 않으며,
 * 자산 교체는 `media.ts` 수정만으로 끝난다 (ADR-0005).
 *
 * 폴백 규칙:
 * - 공개 근거 미확인(`clearance: "pending"`) → 게시하지 않고 플레이스홀더로 대체
 * - 모션 축소 설정 → 영상 대신 포스터 이미지
 * - 모바일에서도 포스터를 우선한다 (디자인 컨셉 §15, 데이터 · 디코딩 부하 회피)
 */
export function MediaSlot({ slotId, className = "" }: MediaSlotProps) {
  const asset = getMediaAsset(slotId);
  const prefersReducedMotion = useReducedMotion();

  const frameClass = `relative isolate overflow-hidden bg-surface ${className}`;

  // `kind` 를 앞에 두어 이 분기를 지나면 타입이 image | video 로 좁혀지게 한다.
  if (asset.kind === "placeholder" || !isPublishableAsset(asset)) {
    const intent = asset.kind === "placeholder" ? asset.intent : "공개 근거 미확인 자산";
    return (
      <div className={`${frameClass} placeholder-grid`} role="img" aria-label={intent}>
        <div className="absolute inset-0 flex items-end p-6">
          <p className="font-mono text-[0.6875rem] tracking-widest text-faint uppercase">
            media pending — {intent}
          </p>
        </div>
      </div>
    );
  }

  const credit = asset.credit ? <MediaCredit credit={asset.credit} /> : null;

  // 정적 export 라 next/image 런타임 최적화가 없다. 자산은 사전 최적화된 상태로 등록한다 (ADR-0002).
  if (asset.kind === "image") {
    return (
      <div className={frameClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath(asset.src)} alt={asset.alt} className="h-full w-full object-cover" />
        {credit}
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <div className={frameClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath(asset.poster)}
          alt={asset.alt}
          className="h-full w-full object-cover"
        />
        {credit}
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <video
        className="h-full w-full object-cover"
        poster={withBasePath(asset.poster)}
        aria-label={asset.alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        {asset.sources.map((source) => (
          <source key={source.src} src={withBasePath(source.src)} type={source.type} />
        ))}
      </video>
      {credit}
    </div>
  );
}

/**
 * 제3자 자산의 출처 표기. 자체 제작 자산에는 표시되지 않는다.
 *
 * CC BY / CC BY-SA 는 저작자 표시 · 라이선스 표시 · **변경 사실 표시**를 요구한다.
 * 세 가지를 모두 이 한 줄에 담고, 원본 페이지로 링크한다.
 */
function MediaCredit({ credit }: { credit: Credit }) {
  return (
    <a
      href={credit.sourceUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="absolute right-0 bottom-0 bg-bg/70 px-3 py-2 font-mono text-[0.625rem] tracking-widest text-muted uppercase transition-colors hover:text-fg"
    >
      {credit.holder} · {credit.license}
      {credit.isModified ? " · 편집됨" : null}
    </a>
  );
}
