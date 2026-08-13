# 원본 이미지 출처 (Image Attribution)

이 폴더는 **가공 전 원본 보관소**다. 사이트가 실제로 사용하는 파일은 `public/media/*.webp` 이며,
슬롯 연결과 화면 출처 표기는 `src/content/media.ts` 가 담당한다.

## 자체 제작 (self-produced)

| 파일                             | 내용                                                            |
| -------------------------------- | --------------------------------------------------------------- |
| `franka_fr3.png`                 | Isaac Sim — AMR 위 듀얼 암 매니퓰레이터, 관절 축                |
| `agility-a01_urdf.png`           | Isaac Sim — 휴머노이드 하체 충돌 메시 · 조인트                  |
| `sim_testbed.jpg`                | 시뮬레이션 테스트베드 — 7축 팔의 충돌 형상 오버레이와 파지 대상 |
| `motion_devece_mk1intestbed.png` | 이동 베이스 테스트베드 — 구동 휠·캐스터와 회전 관절 축 표시     |

## 익명화 처리 (anonymized)

현장에서 촬영한 사진이다. 원본에는 **기관 표식과 안내판**이 찍혀 있어, 크롭 자체가 익명화 수단이다.

| 파일                               | 제외한 것                                      | 남긴 것                    |
| ---------------------------------- | ---------------------------------------------- | -------------------------- |
| `KakaoTalk_20260813_175714350.jpg` | 이동 로봇 차체의 기관 마크, 유리에 비친 안내판 | 천장 반송 레일 · 조명 격자 |

> 크롭 좌표는 `scripts/build-media.py` 의 `JOBS` 에 있다. **좌표를 넓히면 익명화가 깨진다** —
> 이 파일의 크롭은 구도가 아니라 **공개 근거**다.

## 제3자 자유 라이선스 (licensed)

전부 Wikimedia Commons 출처다. **사이트 화면에도 권리자 · 라이선스 · 편집 사실이 표기된다.**

| 파일                    | 권리자            | 라이선스     | 원본 페이지                                                                                                                                                   | 이 저장소의 가공          |
| ----------------------- | ----------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| _(직접 보관 안 함)_     | Lexington Medical | CC0 1.0      | [Manufacturing Robot Arm](https://commons.wikimedia.org/wiki/File:Lexington_Medical,_Inc._Manufacturing_Robot_Arm.jpg)                                        | 리사이즈                  |
| `lidar-point-cloud.jpg` | Daniel L. Lu      | CC BY 4.0    | [Ouster OS1-64 point cloud](https://commons.wikimedia.org/wiki/File:Ouster_OS1-64_lidar_point_cloud_of_intersection_of_Folsom_and_Dore_St,_San_Francisco.png) | 리사이즈 · 채도/명도 조정 |
| `harmonic-drive.jpg`    | wdwd              | CC BY-SA 4.0 | [Harmonic Drive](https://commons.wikimedia.org/wiki/File:Harmonic_Drive.jpg)                                                                                  | 크롭 · 리사이즈 · 톤 조정 |

> `lidar-point-cloud` 원본은 3840×2160 PNG(15MB)였다. 저장소 용량을 위해 2560px JPEG 로 축소해 보관한다.
> 더 큰 원본이 필요하면 위 원본 페이지에서 다시 받는다.

## 가공 파이프라인

배포용 이미지는 `scripts/build-media.py` 가 이 폴더의 원본에서 **전부 재생성**한다.
초록 듀오톤 그레이딩(휘도 추출 → 대비 정규화 → 감마·게인 → 듀오톤 매핑)이 적용된다.

- 원본은 덮어쓰지 않는다. 톤 조정은 스크립트의 `JOBS` 값만 바꿔 재실행한다.
- `_neutral/` 은 초록 톤 도입 이전의 무채색 배포본 백업이다(되돌릴 때 사용).

## 주의

- **CC BY-SA 는 파생물에도 동일 라이선스가 붙는다.** 이 이미지를 편집한 결과물을 배포할 때는 같은 조건을 유지해야 한다. 사이트에 삽입해 사용하는 것은 문제없지만, 로고나 브랜드 자산으로 파생시키지 않는다.
- 이 이미지들은 **초안**이다. 자체 자산이 준비되면 교체한다(`docs/debt/registry.md` debt-006).
