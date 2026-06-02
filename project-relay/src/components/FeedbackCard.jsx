function FeedbackCard({
  feedback,
  onViewDetail,
  onEdit,
  onDelete,
  onShare,
  onMakeChecklist,
}) {
  return (
    <div className="box feedback-card">
      <div className="feedback-card-header">
        <h2 className="feedback-card-title">{feedback.project}</h2>

        <div className="feedback-status-chip">
          {feedback.isShared ? "공유됨" : "미공유"}
        </div>
      </div>

      <div className="feedback-meta-grid">
        <div className="feedback-meta-item">
          <span className="feedback-meta-label">피드백 출처</span>
          <span className="feedback-meta-value">{feedback.source}</span>
        </div>

        <div className="feedback-meta-item">
          <span className="feedback-meta-label">등록일</span>
          <span className="feedback-meta-value">{feedback.createdAt}</span>
        </div>
      </div>

      <div className="feedback-section">
        <span className="feedback-section-label">태그</span>

        <div className="tag-row">
          {feedback.tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="feedback-section">
        <span className="feedback-section-label">요약</span>

        <div className="feedback-content-box feedback-summary-box">
          <p className="feedback-content-text">
            {feedback.summary || feedback.text}
          </p>
        </div>
      </div>

      <div className="feedback-section">
        <span className="feedback-section-label">원문 메모</span>

        <div className="feedback-content-box feedback-raw-box">
          <p className="feedback-content-text">{feedback.text}</p>
        </div>
      </div>

      <div className="button-row">
        <button onClick={() => onViewDetail(feedback)}>상세 보기</button>
        <button onClick={() => onEdit(feedback)}>수정하기</button>
        <button onClick={() => onDelete(feedback.id)}>삭제하기</button>
        <button onClick={() => onShare(feedback)}>익명 공유하기</button>
        <button onClick={() => onMakeChecklist(feedback)}>
          이 피드백으로 체크리스트 만들기
        </button>
      </div>
    </div>
  );
}

export default FeedbackCard;