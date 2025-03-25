# ✋ Interactive Hand Gesture Reaction with p5.js & ml5.js

이 프로젝트는 **p5.js와 ml5.js를 이용해 웹캠과 손 제스처로 인터랙티브한 반응을 구현**하고,  
**OBS 가상 카메라를 통해 Zoom 등에서 실시간 효과 송출**이 가능한 시스템입니다.

---

## 🖼️ 데모 시연

[https://youtu.be/8KFzKs5OZjs](https://youtu.be/IKfJOArA3SA)

---

## 🗂️ 프로젝트 구조

![image](https://github.com/user-attachments/assets/635878bd-43c2-40da-8a5f-9dfa9dd8fb2c)

---


## 🔧 사용 기술

- **p5.js**: 그래픽 렌더링 및 UI 인터페이스
- **ml5.js**: Handpose 모델을 이용한 손가락 위치 추적
- **OBS Virtual Camera**: 완성된 화면을 Zoom 등 화상 회의 앱에 송출

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🖐️ 제스처 인식 | 손가락을 이용한 UI 버튼 인터랙션 |
| 📣 반응 버튼 4개 | '안녕하세요', 모자이크 효과, 하트 띄우기, 박수 표시 |
| ✍️ 그림판 기능 | 검지 끝으로 자유롭게 그림 그리기 |
| 🧽 지우기 버튼 | 그린 그림 전체 삭제 |
| 🎥 OBS 연동 | 가상 카메라를 통해 화상회의 앱에 출력 가능 |

---

## 🚀 실행 방법

1. VS Code에서 프로젝트 열기
2. Live Server 확장 설치 후 `index.html` 실행
3. 브라우저에서 `http://127.0.0.1:5500/` 접속
4. 카메라 접근 허용

---

## 🎥 OBS 연동 방법

1. OBS 설치 (https://obsproject.com/)
2. OBS에서 **창 캡처**로 Live Server 실행된 브라우저 추가
3. `가상 카메라 시작` 버튼 클릭
4. Zoom 등의 화상회의 앱에서 **OBS Virtual Camera** 선택

---

## 📌 코드 설명

### 🎛️ 1. 반응 버튼 생성

```js
reactionButtons = [
  new ReactionButton(20, 30, 100, 60, "인사"),
  new ReactionButton(130, 30, 100, 60, "모자이크"),
  new ReactionButton(240, 30, 100, 60, "박수"),
  new ReactionButton(350, 30, 100, 60, "하트")
];
```

- 손가락이 버튼에 닿으면 각종 반응 실행 (`trigger()` 함수)
- `"인사"` → 화면에 `"안녕하세요"` 출력
- `"모자이크"` → 배경 모자이크 효과
- `"박수"`/`"하트"` → 이모지 등장 애니메이션

---

### ✍️ 2. 그림판 관련 버튼

```js
drawButtons = [
  new ReactionButton(width - 120, 100, 100, 60, "그리기"),
  new ReactionButton(width - 120, 180, 100, 60, "그리기 종료"),
  new ReactionButton(width - 120, 260, 100, 60, "지우기")
];
```

- `"그리기"`: 검지 손끝을 따라 그림 그리기 시작  
- `"그리기 종료"`: 그리기 중단  
- `"지우기"`: 지금까지 그린 선 전부 삭제

```js
if (drawing) {
  drawingPoints.push({ x: smoothX, y: smoothY });
}
```

---

### 🎯 3. 손가락 좌표 인식 개선

```js
smoothX = lerp(smoothX, x, smoothingFactor);
smoothY = lerp(smoothY, y, smoothingFactor);
```

- `lerp()`를 통해 좌표 튐 현상 최소화  
- `handInViewConfidence > 0.8` 조건으로 신뢰도 높은 예측만 사용

---

### 📦 4. 버튼 터치 판정

```js
if (btn.isInside(smoothX, smoothY)) {
  btn.trigger();
}
```

- 버튼 내부에 손가락이 들어오면 이벤트 발생  
- `margin` 값을 줘서 터치 판정을 부드럽게 처리

---
