# Modal 시스템 사용 가이드

AlphaNote 프로젝트의 통일된 모달 시스템입니다.

## 📦 제공 컴포넌트

- **Modal**: 범용 모달 컴포넌트
- **Alert**: alert() 대체용 알림 모달
- **Confirm**: confirm() 대체용 확인 모달

## 🎨 디자인 시스템

모든 모달은 프로젝트의 테마(theme.js)를 기반으로 통일된 디자인을 제공합니다.

### 버튼 Variant
- `primary`: 기본 액션 (파란색)
- `success`: 성공 액션 (녹색)
- `warning`: 주의 액션 (주황색)
- `danger`: 위험 액션 (빨간색)
- `default`: 일반 액션 (회색)

---

## 🚀 사용 방법

### 1. Alert (알림 모달)

```jsx
import { Alert } from '../../components/common/Modal';
import { useAlert } from '../../hooks/useModal';

function MyComponent() {
  const { isOpen, showAlert, alertProps } = useAlert();

  const handleSave = async () => {
    // ... 저장 로직
    showAlert('저장되었습니다!', {
      title: '성공',
      variant: 'success'
    });
  };

  return (
    <>
      <button onClick={handleSave}>저장</button>
      <Alert isOpen={isOpen} {...alertProps} />
    </>
  );
}
```

**Alert Options:**
- `title`: 모달 제목 (기본: "알림")
- `confirmText`: 확인 버튼 텍스트 (기본: "확인")
- `variant`: 버튼 스타일 (기본: "primary")
- `onConfirm`: 확인 버튼 클릭 후 실행할 함수

---

### 2. Confirm (확인 모달)

```jsx
import { Confirm } from '../../components/common/Modal';
import { useConfirm } from '../../hooks/useModal';

function MyComponent() {
  const { isOpen, showConfirm, confirmProps } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await showConfirm(
      '정말로 삭제하시겠습니까?',
      {
        title: '삭제 확인',
        confirmText: '삭제',
        cancelText: '취소',
        variant: 'danger'
      }
    );

    if (confirmed) {
      // 삭제 로직 실행
      console.log('삭제됨');
    }
  };

  return (
    <>
      <button onClick={handleDelete}>삭제</button>
      <Confirm isOpen={isOpen} {...confirmProps} />
    </>
  );
}
```

**Confirm Options:**
- `title`: 모달 제목 (기본: "확인")
- `confirmText`: 확인 버튼 텍스트 (기본: "확인")
- `cancelText`: 취소 버튼 텍스트 (기본: "취소")
- `variant`: 확인 버튼 스타일 (기본: "primary")
- `onConfirm`: 확인 버튼 클릭 시 실행할 비동기 함수

---

### 3. Modal (범용 모달)

```jsx
import Modal from '../../components/common/Modal';
import useModal from '../../hooks/useModal';

function MyComponent() {
  const { isOpen, openModal, closeModal } = useModal();

  const actions = [
    {
      label: '취소',
      onClick: closeModal,
      variant: 'default'
    },
    {
      label: '저장',
      onClick: handleSave,
      variant: 'primary'
    }
  ];

  return (
    <>
      <button onClick={openModal}>열기</button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="사용자 정의 모달"
        actions={actions}
        maxWidth="600px"
      >
        <div>
          <p>여기에 원하는 컨텐츠를 넣으세요.</p>
          <input type="text" placeholder="입력..." />
        </div>
      </Modal>
    </>
  );
}
```

**Modal Props:**
- `isOpen`: 모달 표시 여부
- `onClose`: 닫기 핸들러
- `title`: 제목
- `children`: 본문 내용
- `actions`: 하단 버튼 배열 `[{ label, onClick, variant, disabled }]`
- `maxWidth`: 최대 너비 (기본: "500px")
- `showCloseButton`: X 버튼 표시 여부 (기본: true)
- `closeOnOverlayClick`: 오버레이 클릭 시 닫기 (기본: true)

---

## 🎯 기존 코드 마이그레이션

### Before (기존 alert)
```jsx
alert('저장되었습니다!');
```

### After (새로운 Alert)
```jsx
const { isOpen, showAlert, alertProps } = useAlert();

showAlert('저장되었습니다!', { variant: 'success' });

<Alert isOpen={isOpen} {...alertProps} />
```

---

### Before (기존 confirm)
```jsx
if (confirm('삭제하시겠습니까?')) {
  // 삭제 로직
}
```

### After (새로운 Confirm)
```jsx
const { isOpen, showConfirm, confirmProps } = useConfirm();

const result = await showConfirm('삭제하시겠습니까?', {
  variant: 'danger',
  confirmText: '삭제'
});

if (result) {
  // 삭제 로직
}

<Confirm isOpen={isOpen} {...confirmProps} />
```

---

## 💡 Tips

1. **애니메이션**: 모든 모달은 페이드인/슬라이드업 애니메이션을 제공합니다.

2. **테마 통합**: styled-components의 theme을 사용하여 일관된 디자인을 유지합니다.

3. **접근성**: ESC 키로 모달을 닫을 수 있도록 추가 구현 가능합니다.

4. **중첩 모달**: 여러 모달을 동시에 사용할 수 있습니다.

5. **로딩 상태**: Confirm 컴포넌트는 `isLoading` prop을 지원합니다.

---

## 🔧 커스터마이징

필요에 따라 `Modal.styled.js`에서 스타일을 수정할 수 있습니다.

```jsx
// 예: 더 큰 모달
<Modal maxWidth="800px" ...>

// 예: 위험한 액션 버튼
actions={[
  { label: '삭제', onClick: handleDelete, variant: 'danger' }
]}
```
