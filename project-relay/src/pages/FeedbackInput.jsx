function FeedbackInput({
  projectTypes,
  feedbackSources,
  feedbackText,
  setFeedbackText,
  selectedProject,
  setSelectedProject,
  selectedSource,
  setSelectedSource,
  analysisError,
  isAnalyzing,
  handleAnalyzeFeedback,
  handleResetInput,
}) {
  return (
    <section>
      <h1>피드백 입력</h1>
      <p>튜터, 팀원, 발표에서 받은 피드백을 입력하고 분석해보세요.</p>

      <h2>프로젝트 유형</h2>
      <div className="button-row">
        {projectTypes.map((project) => (
          <button
            key={project}
            onClick={() => setSelectedProject(project)}
            className={selectedProject === project ? "selected" : ""}
          >
            {project}
          </button>
        ))}
      </div>

      {selectedProject && (
        <p className="selected-info">선택한 프로젝트 유형: {selectedProject}</p>
      )}

      <h2>피드백 내용</h2>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="받은 피드백을 여기에 붙여넣어 주세요."
        className="textarea"
      />

      <h2>피드백 출처</h2>
      <div className="button-row">
        {feedbackSources.map((source) => (
          <button
            key={source}
            onClick={() => setSelectedSource(source)}
            className={selectedSource === source ? "selected" : ""}
          >
            {source}
          </button>
        ))}
      </div>

      {selectedSource && (
        <p className="selected-info">선택한 피드백 출처: {selectedSource}</p>
      )}

      {analysisError && (
        <div className="box">
          <h2>분석 오류</h2>
          <p>{analysisError}</p>
        </div>
      )}

      <div className="button-row">
        <button onClick={handleAnalyzeFeedback} disabled={isAnalyzing}>
          {isAnalyzing ? "분석 중..." : "GPT로 피드백 분석하기"}
        </button>
        <button onClick={handleResetInput}>초기화하기</button>
      </div>
    </section>
  );
}

export default FeedbackInput;