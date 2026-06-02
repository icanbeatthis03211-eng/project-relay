function ExampleSharedCard() {
  return (
    <div className="box shared-card">
      <div className="shared-card-header">
        <p className="card-eyebrow">예시 공유 피드백</p>

        <div className="tag-row">
          <span className="project-chip">역기획</span>
          <span className="tag-chip">문제 정의</span>
        </div>
      </div>

      <div className="shared-summary">
        <div className="summary-block problem">
          <span className="summary-label">핵심 문제</span>
          <p className="summary-text">
            문제 정의의 범위가 넓어 핵심 문제가 흐려졌다는 피드백입니다.
          </p>
        </div>

        <div className="summary-block action">
          <span className="summary-label">다음 액션</span>
          <p className="summary-text">
            다음 프로젝트에서는 해결할 문제를 한 문장으로 좁혀야 합니다.
          </p>
        </div>
      </div>

      <p className="shared-note">18명이 비슷한 피드백을 받았어요.</p>
    </div>
  );
}

export default ExampleSharedCard;