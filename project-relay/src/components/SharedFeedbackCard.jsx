import { getShareSummaryText } from "../utils/feedbackUtils";

function SharedFeedbackCard({ feedback, onDelete }) {
  const summaryLines = getShareSummaryText(feedback)
    .split("\n")
    .filter(Boolean);

  const problemText =
    feedback.problemSummary || summaryLines[0] || getShareSummaryText(feedback);

  const actionText =
    feedback.actionSummary ||
    summaryLines[1] ||
    "다음 프로젝트에서 같은 피드백이 반복되지 않도록 확인해야 합니다.";

  return (
    <div className="box shared-card">
      <div className="shared-card-header">
        <p className="card-eyebrow">공유 피드백</p>

        <div className="tag-row">
          <span className="project-chip">{feedback.project}</span>

          {feedback.tags.map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="shared-summary">
        <div className="summary-block problem">
          <span className="summary-label">핵심 문제</span>
          <p className="summary-text">{problemText}</p>
        </div>

        <div className="summary-block action">
          <span className="summary-label">다음 액션</span>
          <p className="summary-text">{actionText}</p>
        </div>
      </div>

      <div className="button-row">
        <button onClick={() => onDelete(feedback.id)}>공유 삭제하기</button>
      </div>
    </div>
  );
}

export default SharedFeedbackCard;