function Home({
  goToPage,
  feedbackList,
  sharedFeedbackList,
  homeTop3,
  handleClearAllData,
}) {
  return (
    <section>
      <h1>프로젝트 릴레이</h1>
      <p>피드백을 모아 반복 패턴을 발견하는 성장 관리 서비스</p>

      <div className="box">
        <h2>피드백을 다음 프로젝트의 힌트로 바꾸세요</h2>
        <p>
          내가 받은 피드백을 기록하고, 다른 부트캠프 수강생들의 익명 피드백을
          참고해 다음 프로젝트 체크리스트로 연결할 수 있어요.
        </p>
      </div>

      <div className="button-row">
        <button onClick={() => goToPage("input")}>피드백 입력하기</button>
        <button onClick={() => goToPage("shared")}>공유 피드백 보기</button>
      </div>

      <div className="box">
        <h2>전체 반복 피드백 TOP 3</h2>
        {sharedFeedbackList.length === 0 ? (
          <p>
            아직 공유된 피드백이 없습니다. 피드백을 공유하면 이 영역이 자동으로
            업데이트됩니다.
          </p>
        ) : (
          <ol>
            {homeTop3.map(([tag, count]) => (
              <li key={tag}>
                {tag} 관련 피드백 {count}회
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="box">
        <h2>저장 현황</h2>
        <p>내 기록: {feedbackList.length}개</p>
        <p>공유 피드백: {sharedFeedbackList.length}개</p>
      </div>

      <button onClick={handleClearAllData}>전체 데이터 초기화</button>
    </section>
  );
}

export default Home;