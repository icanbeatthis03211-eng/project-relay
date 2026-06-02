function AnalysisResult({
  selectedProject,
  selectedSource,
  feedbackText,
  analysisResult,
  getCurrentTags,
  getCurrentChecklist,
  getCurrentShareSummary,
  handleSaveFeedback,
  goToPage,
}) {
  const shareSummaryLines = getCurrentShareSummary()
    .split("\n")
    .filter(Boolean);

  return (
    <section>
      <h1>분석 결과</h1>
      <p>
        GPT가 입력한 피드백을 요약하고, 관련 역량 태그와 다음 프로젝트
        체크리스트로 정리했어요.
      </p>

      <div className="box">
        <h2>입력 정보</h2>
        <p>프로젝트 유형: {selectedProject || "선택되지 않음"}</p>
        <p>피드백 출처: {selectedSource || "선택되지 않음"}</p>
      </div>

      <div className="box">
        <h2>내 기록용 요약</h2>
        <p>
          {analysisResult?.summary ||
            feedbackText ||
            "아직 입력된 피드백이 없습니다."}
        </p>
      </div>

      <div className="box">
        <h2>공유용 핵심 요약</h2>
        <p>공유 피드백 화면에서 짧게 보여줄 내용이에요.</p>

        <div className="shared-summary">
          <div className="summary-block problem">
            <span className="summary-label">핵심 문제</span>
            <p className="summary-text">
              {shareSummaryLines[0] ||
                analysisResult?.problemSummary ||
                analysisResult?.summary ||
                feedbackText ||
                "공유용 핵심 요약이 없습니다."}
            </p>
          </div>
        </div>
      </div>

      <div className="box">
        <h2>관련 역량 태그</h2>
        <p>이 피드백이 어떤 역량과 관련되어 있는지 분류한 결과예요.</p>

        <div className="tag-row">
          {getCurrentTags().map((tag) => (
            <span className="tag-chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="box">
        <h2>개선 포인트</h2>
        <p>
          {analysisResult?.improvementPoint ||
            "다음 프로젝트에서 다시 확인해야 할 개선 포인트입니다."}
        </p>
      </div>

      <div className="box">
        <h2>다음 프로젝트 체크리스트</h2>
        <ul>
          {getCurrentChecklist().map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="box">
        <p>
          이 단계에서는 피드백을 내 기록에 저장합니다. 익명 공유는 저장된 피드백
          기록에서 할 수 있습니다.
        </p>
      </div>

      <div className="button-row">
        <button onClick={handleSaveFeedback}>내 기록에 저장하기</button>
        <button onClick={() => goToPage("input")}>다시 수정하기</button>
      </div>
    </section>
  );
}

export default AnalysisResult;