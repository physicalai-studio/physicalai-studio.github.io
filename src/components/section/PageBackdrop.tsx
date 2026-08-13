import { MediaSlot } from "@/components/media/MediaSlot";

type PageBackdropProps = {
  /** `src/content/media.ts` 의 슬롯 ID. */
  slotId: string;
};

/**
 * 페이지 전체에 깔리는 배경.
 *
 * 히어로처럼 한 섹션을 채우는 것이 아니라 **페이지 상단부터 아래로 번지다 사라진다.**
 * 여백이 주인공이므로 자산 자체가 이미 어둡고 한쪽으로 치우쳐 있어야 한다
 * (docs/비주얼_컨셉_파동과_간섭.md §5 — 밝은 화소 20% 이하).
 *
 * 구현 주의:
 * - `MediaSlot` 은 내부에서 `relative` 를 쓰므로 **절대배치 래퍼로 감싼다.**
 *   호출부에서 `absolute` 를 넘기면 Tailwind 순서 때문에 무시된다.
 * - 음수 z-index 를 쓰지 않는다. 이 컴포넌트를 콘텐츠보다 **앞에** 두고,
 *   콘텐츠에 `relative` 를 줘서 자연스럽게 위로 쌓이게 한다.
 */
export function PageBackdrop({ slotId }: PageBackdropProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[150svh] overflow-hidden"
    >
      <MediaSlot slotId={slotId} className="h-full w-full" />
      {/* 전체 스크림 — 배경이 본문 대비를 잡아먹지 않게 한 겹 눌러 둔다. */}
      <div className="absolute inset-0 bg-bg/40" />
      {/* 아래로 갈수록 완전한 검정으로 — 페이지가 길어도 배경이 끊겨 보이지 않는다. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-bg to-transparent" />
    </div>
  );
}
