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
| 🖐️ 제스처 인식 | 손가락을 이용한 UI 버튼 조작 |
| 📣 반응 버튼 4개 | '안녕하세요', 모자이크 효과, 하트 띄우기, 박수 표시 |
| ✍️ 그리기 기능 | 검지 끝으로 자유롭게 그림 그리기 |
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
- `"인사"` → 화면 중앙에 `"안녕하세요"` 텍스트 2초간 표시
- `"모자이크"` → 배경에 모자이크 처리 (2초간 유지)
- `"박수"` / `"하트"` → 이모지가 **위로 떠오르는 애니메이션 효과**

---

### 💖 2. 하트/박수 이모지 애니메이션

```js
if (showHeart) {
  textSize(64);
  text("❤️", width / 2, heartY);
  heartY -= 2; // Y좌표를 점점 줄이며 위로 이동
  if (heartY < -50) showHeart = false; // 화면 위로 사라지면 종료
}
```

- `heartY`는 하트의 y좌표로, `draw()` 함수에서 매 프레임마다 위로 이동
- 박수(`👏`)도 같은 방식
- 각각 버튼을 누르면 해당 이모지를 화면 아래에서 위로 날려줌 → 간단한 애니메이션 구현

---

### ✋ 3. 손가락 인식 방식

```js
handposeModel = ml5.handpose(video, () => { ... });
handposeModel.on("predict", results => predictions = results);
```

- `ml5.handpose`는 웹캠 영상에서 **손의 21개 랜드마크 좌표를 실시간 추출**
- 손가락 중 `검지 끝 (index finger tip)`은 `landmarks[8]`에 위치
- 손의 **위치 신뢰도(`handInViewConfidence`)가 0.8 이상일 때만 인식**

---

### 🎯 4. 손끝 좌표 추적 및 보정

```js
let index = landmarks[8];
let x = index[0];
let y = index[1];

// 부드럽게 보정
smoothX = lerp(smoothX, x, 0.7);
smoothY = lerp(smoothY, y, 0.7);
```

- 손끝 좌표는 `smoothX, smoothY`로 부드럽게 보간(lerp) → 튐 방지
- 이 좌표로 버튼을 터치하거나, 그림을 그림

---

### ✍️ 5. 그림 관련 버튼

```js
drawButtons = [
  new ReactionButton(width - 120, 100, 100, 60, "그리기"),
  new ReactionButton(width - 120, 180, 100, 60, "그리기 종료"),
  new ReactionButton(width - 120, 260, 100, 60, "지우기")
];
```

- `"그리기"`를 누르면 `drawing = true`
- 이후 매 프레임마다 손끝 위치를 저장

```js
if (drawing) {
  drawingPoints.push({ x: smoothX, y: smoothY });
}
```

- 저장된 좌표들을 선으로 연결해 실시간 드로잉
- `"지우기"` 버튼으로 `drawingPoints` 배열을 초기화

---

### 📦 6. 버튼 터치 판정

```js
if (btn.isInside(smoothX, smoothY)) {
  btn.trigger();
}
```

- 버튼 객체는 `x, y, width, height`로 위치 지정됨
- 손끝 좌표가 버튼 내부로 들어오면 `trigger()` 실행
- `margin` 값을 추가로 줘서 터치 판정이 더 부드럽게 처리됨

---


### 🧱 7. 모자이크 효과

```js
function mosaicEffect(videoSource) {
  let step = 20;
  for (let y = 0; y < video.height; y += step) {
    for (let x = 0; x < video.width; x += step) {
      let c = video.get(x, y);
      fill(c);
      rect(x, y, step, step);
    }
  }
}
```

- 웹캠 영상의 픽셀을 일정 크기(step) 단위로 샘플링하여 큰 블록으로 표현

- step 값이 커질수록 더 뭉개진 모자이크 효과

- "모자이크" 버튼을 누르면 2초간 이 효과가 적용됨

---
