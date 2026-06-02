import FeedbackCard from "../components/FeedbackCard";
import ChecklistBox from "../components/ChecklistBox";
import { getChecklistItems } from "../utils/feedbackUtils";

function FeedbackLog({
  feedbackList,
  filteredFeedbackList,
  logSearchInput,
  setLogSearchInput,
  setLogSearchKeyword,
  logProjectFilter,
  setLogProjectFilter,
  logTagFilter,
  setLogTagFilter,
  projectTypes,
  tagOptions,
  handleViewFeedbackDetail,
  handleEditFeedback,
  handleDeleteFeedback,
  handleShareSavedFeedback,
  selectedFeedbackForChecklist,
  setSelectedFeedbackForChecklist,
  checkedChecklistItems,
  handleToggleChecklist,
  goToPage,
}) {
  const checklistItems = selectedFeedbackForChecklist
    ? selectedFeedbackForChecklist.checklist?.length > 0
      ? selectedFeedbackForChecklist.checklist
      : getChecklistItems(selectedFeedbackForChecklist.tags)
    : [];

  return (
    <section>
      <h1>피드백 기록</h1>
      <p>
        내가 저장한 피드백을 확인하고, 필요한 피드백만 익명으로 공유할 수
        있어요.
      </p>

      <div className="box">
        <h2>내 기록 필터</h2>

        <label className="input-label">검색</label>
        <div className="search-bar">
          <input
            className="search-input"
            value={logSearchInput}
            onChange={(e) => setLogSearchInput(e.target.value)}
            placeholder="예: KPI, 문제 정의, 타깃"
          />

          <div className="search-actions">
            <button onClick={() => setLogSearchKeyword(logSearchInput)}>
              검색하기
            </button>

            <button
              onClick={() => {
                setLogSearchInput("");
                setLogSearchKeyword("");
              }}
            >
              검색 초기화
            </button>
          </div>
        </div>

        <p className="filter-title">프로젝트 유형</p>
        <div className="button-row">
          {["전체", ...projectTypes].map((project) => (
            <button
              key={project}
              onClick={() => setLogProjectFilter(project)}
              className={logProjectFilter === project ? "selected" : ""}
            >
              {project}
            </button>
          ))}
        </div>

        <p className="filter-title">태그</p>
        <div className="button-row">
          {["전체", ...tagOptions].map((tag) => (
            <button
              key={tag}
              onClick={() => setLogTagFilter(tag)}
              className={logTagFilter === tag ? "selected" : ""}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="selected-info">검색 결과: {filteredFeedbackList.length}개</p>
      </div>

      {feedbackList.length === 0 ? (
        <div className="box">
          <h2>저장된 피드백이 없습니다.</h2>
          <p>새로운 피드백을 입력해 기록을 만들어보세요.</p>
        </div>
      ) : filteredFeedbackList.length === 0 ? (
        <div className="box">
          <h2>조건에 맞는 피드백이 없습니다.</h2>
          <p>검색어 또는 필터 조건을 바꿔보세요.</p>
        </div>
      ) : (
        filteredFeedbackList.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            onViewDetail={handleViewFeedbackDetail}
            onEdit={handleEditFeedback}
            onDelete={handleDeleteFeedback}
            onShare={handleShareSavedFeedback}
            onMakeChecklist={setSelectedFeedbackForChecklist}
          />
        ))
      )}

      {selectedFeedbackForChecklist && (
        <ChecklistBox
          title="개인 체크리스트"
          description="아래 체크리스트는 내가 저장한 피드백을 바탕으로 다음 프로젝트에서 확인할 항목이에요."
          items={checklistItems}
          getKey={(item) => `personal-${selectedFeedbackForChecklist.id}-${item}`}
          checkedChecklistItems={checkedChecklistItems}
          onToggle={handleToggleChecklist}
        />
      )}

      <button onClick={() => goToPage("input")}>새 피드백 입력하기</button>
    </section>
  );
}

export default FeedbackLog;