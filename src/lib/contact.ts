import { site } from "@/content/site";

/**
 * `tel:` 링크용 전화번호.
 *
 * 표시용 번호는 하이픈과 공백을 포함하므로 그대로 링크에 쓰면 일부 단말이 인식하지 못한다.
 * 숫자와 선행 `+` 만 남긴다.
 */
export function telHref(): string {
  return `tel:${site.contactPhone.replace(/[^\d+]/g, "")}`;
}
