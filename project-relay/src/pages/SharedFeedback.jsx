function SharedFeedback({
  sharedFeedbackList,
  filteredSharedFeedbackList,
  sharedProjectFilter,
  setSharedProjectFilter,
  sharedTagFilter,
  setSharedTagFilter,
  sharedSearchInput,
  setSharedSearchInput,
  setSharedSearchKeyword,
  projectTypes,
  tagOptions,
  handleDeleteSharedFeedback,
  goToPage,
}) {
  const handleSearch = () => {
    setSharedSearchKeyword(sharedSearchInput);
  };

  const handleResetSearch = () => {
    setSharedSearchInput("");
    setSharedSearchKeyword("");
  };

  return (
    <section>
      <h1>Shared Feedback</h1>
      <p>
        다른 수강생들이 공유한 피드백을 익명으로 확인하고, 반복되는 피드백
        패턴을 찾아보세요.
      </p>

      <div className="box">
        <h2>공유 피드백 검색</h2>

        <div className="search-bar">
          <input
            className="search-input"
            value={sharedSearchInput}
            onChange={(e) => setSharedSearchInput(e.target.value)}
            placeholder="프로젝트명, 태그, 피드백 내용으로 검색"
          />

          <div className="search-actions">
            <button onClick={handleSearch}>검색</button>
            <button onClick={handleResetSearch}>초기화</button>
          </div>
        </div>

        <p className="filter-title">프로젝트 유형</p>
        <div className="button-row">
          <button
            className={sharedProjectFilter === "전체" ? "selected" : ""}
            onClick={() => setSharedProjectFilter("전체")}
          >
            전체
          </button>

          {projectTypes.map((project) => (
            <button
              key={project}
              className={sharedProjectFilter === project ? "selected" : ""}
              onClick={() => setSharedProjectFilter(project)}
            >
              {project}
            </button>
          ))}
        </div>

        <p className="filter-title">태그</p>
        <div className="button-row">
          <button
            className={sharedTagFilter === "전체" ? "selected" : ""}
            onClick={() => setSharedTagFilter("전체")}
          >
            전체
          </button>

          {tagOptions.map((tag) => (
            <button
              key={tag}
              className={sharedTagFilter === tag ? "selected" : ""}
              onClick={() => setSharedTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {sharedFeedbackList.length === 0 ? (
        <div className="box">
          <h2>아직 공유된 피드백이 없습니다.</h2>
          <p>
            나의 피드백을 저장한 뒤 공유하면 이곳에서 익명화된 피드백으로
            확인할 수 있습니다.
          </p>
          <button onClick={() => goToPage("input")}>
            피드백 입력하러 가기
          </button>
        </div>
      ) : filteredSharedFeedbackList.length === 0 ? (
        <div className="box">
          <h2>검색 결과가 없습니다.</h2>
          <p>다른 프로젝트 유형이나 태그로 다시 검색해보세요.</p>
        </div>
      ) : (
        filteredSharedFeedbackList.map((feedback) => (
          <div className="box shared-card" key={feedback.id}>
            <div className="shared-card-header">
              <span className="project-chip">{feedback.project}</span>

              <h2 className="card-eyebrow">
                {feedback.summary || "요약된 피드백이 없습니다."}
              </h2>

              <div className="tag-row">
                {feedback.tags && feedback.tags.length > 0 ? (
                  feedback.tags.map((tag) => (
                    <span className="tag-chip" key={tag}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="tag-chip">태그 없음</span>
                )}
              </div>
            </div>

            <div className="shared-summary">
              <div className="summary-block problem">
                <span className="summary-label">핵심 문제</span>
                <p className="summary-text">
                  {feedback.problemSummary ||
                    feedback.shareSummary ||
                    feedback.summary ||
                    "공유된 피드백 요약이 없습니다."}
                </p>
              </div>
            </div>

            <p className="shared-note">
              {feedback.createdAt} · 익명 공유 피드백
            </p>

            <div className="button-row">
              <button onClick={() => handleDeleteSharedFeedback(feedback.id)}>
                공유 취소
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default SharedFeedback;