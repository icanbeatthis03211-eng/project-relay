import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "https://project-relay-x9mb.onrender.com";

const getOrCreateUserId = () => {
  const savedUserId = localStorage.getItem("projectRelayUserId");

  if (savedUserId) {
    return savedUserId;
  }

  const newUserId = crypto.randomUUID();
  localStorage.setItem("projectRelayUserId", newUserId);

  return newUserId;
};

function App() {
  const [page, setPage] = useState("home");

  const [userId] = useState(() => getOrCreateUserId());

  const [feedbackText, setFeedbackText] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const [feedbackList, setFeedbackList] = useState([]);
  const [sharedFeedbackList, setSharedFeedbackList] = useState([]);

  const [selectedFeedbackForChecklist, setSelectedFeedbackForChecklist] =
    useState(null);

  const [showPatternChecklist, setShowPatternChecklist] = useState(false);
  const [selectedPatternProject, setSelectedPatternProject] = useState("전체");

  const [logProjectFilter, setLogProjectFilter] = useState("전체");
  const [logTagFilter, setLogTagFilter] = useState("전체");
  const [logSearchInput, setLogSearchInput] = useState("");
  const [logSearchKeyword, setLogSearchKeyword] = useState("");

  const [sharedProjectFilter, setSharedProjectFilter] = useState("전체");
  const [sharedTagFilter, setSharedTagFilter] = useState("전체");
  const [sharedSearchInput, setSharedSearchInput] = useState("");
  const [sharedSearchKeyword, setSharedSearchKeyword] = useState("");

  const [checkedChecklistItems, setCheckedChecklistItems] = useState(() => {
    const savedChecklist = localStorage.getItem("projectRelayChecklistState");
    return savedChecklist ? JSON.parse(savedChecklist) : {};
  });

  const projectTypes = [
    "서비스 기획 입문 과제",
    "역기획",
    "데이터 드리븐",
    "MVP",
    "최종 프로젝트",
  ];

  const feedbackSources = ["튜터", "팀원", "발표 피드백", "자기 회고"];

  const tagOptions = [
    "문제 정의",
    "타깃 설정",
    "리서치 근거",
    "KPI",
    "우선순위",
    "발표 흐름",
    "기능 논리",
    "장표 표현",
    "데이터 해석",
    "사용자 관점",
  ];

  const fetchFeedbacksFromDB = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/feedbacks?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("DB에서 내 피드백을 불러오지 못했습니다.");
      }

      const data = await response.json();

      setFeedbackList(data);
    } catch (error) {
      console.error(error);
      alert(`내 기록 불러오기에 실패했습니다: ${error.message}`);
    }
  };

  const fetchSharedFeedbacksFromDB = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shared-feedbacks`);

      if (!response.ok) {
        throw new Error("DB에서 공유 피드백을 불러오지 못했습니다.");
      }

      const data = await response.json();

      setSharedFeedbackList(data);
    } catch (error) {
      console.error(error);
      alert(`공유 피드백 불러오기에 실패했습니다: ${error.message}`);
    }
  };

  const fetchAllFeedbackData = async () => {
    await Promise.all([fetchFeedbacksFromDB(), fetchSharedFeedbacksFromDB()]);
  };

  useEffect(() => {
    fetchAllFeedbackData();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "projectRelayChecklistState",
      JSON.stringify(checkedChecklistItems)
    );
  }, [checkedChecklistItems]);

  const goToPage = (nextPage) => {
    setPage(nextPage);

    if (nextPage !== "log") {
      setSelectedFeedbackForChecklist(null);
    }

    if (nextPage !== "pattern") {
      setShowPatternChecklist(false);
    }
  };

  const getTags = (text) => {
    const tags = [];

    if (text.includes("문제") || text.includes("정의")) {
      tags.push("문제 정의");
    }

    if (text.includes("타깃") || text.includes("사용자")) {
      tags.push("타깃 설정");
    }

    if (text.includes("KPI") || text.includes("지표")) {
      tags.push("KPI");
    }

    if (text.includes("우선순위")) {
      tags.push("우선순위");
    }

    if (text.includes("근거") || text.includes("리서치")) {
      tags.push("리서치 근거");
    }

    if (text.includes("발표") || text.includes("흐름")) {
      tags.push("발표 흐름");
    }

    if (tags.length === 0) {
      tags.push("문제 정의");
    }

    return tags;
  };

  const getChecklistItems = (tags) => {
    const checklist = [];

    if (tags.includes("문제 정의")) {
      checklist.push("타깃 사용자를 한 문장으로 정의했는가?");
      checklist.push("해결하려는 문제가 특정 상황에서 발생하는가?");
    }

    if (tags.includes("타깃 설정")) {
      checklist.push("타깃 사용자의 상황과 니즈가 구체적인가?");
    }

    if (tags.includes("KPI")) {
      checklist.push("해결안과 직접 연결되는 행동 지표를 설정했는가?");
    }

    if (tags.includes("우선순위")) {
      checklist.push("우선순위를 판단하는 기준을 정했는가?");
    }

    if (tags.includes("리서치 근거")) {
      checklist.push("주장마다 최소 1개 이상의 근거 자료가 있는가?");
    }

    if (tags.includes("발표 흐름")) {
      checklist.push("Problem → Insight → Solution 흐름이 유지되는가?");
    }

    if (tags.includes("기능 논리")) {
      checklist.push("기능이 문제 해결 흐름과 직접 연결되는가?");
    }

    if (tags.includes("장표 표현")) {
      checklist.push("핵심 메시지가 장표에서 한눈에 보이는가?");
    }

    if (tags.includes("데이터 해석")) {
      checklist.push("데이터를 단순 나열하지 않고 인사이트로 해석했는가?");
    }

    if (tags.includes("사용자 관점")) {
      checklist.push(
        "공급자 관점이 아니라 사용자 행동과 니즈를 기준으로 설명했는가?"
      );
    }

    if (checklist.length === 0) {
      checklist.push("다음 프로젝트에서 다시 확인할 포인트를 정리했는가?");
    }

    return [...new Set(checklist)];
  };

  const makeShareSummary = (text) => {
    if (!text) return "요약된 피드백이 없습니다.";

    const cleanedText = text
      .replace(/\s+/g, " ")
      .replace(/요약[:：]?/g, "")
      .trim();

    const sentences = cleanedText
      .split(/(?<=[.!?。！？다요함됨임음])\s+/)
      .filter(Boolean);

    const twoSentenceSummary = sentences.slice(0, 2).join(" ");
    const summarySource = twoSentenceSummary || cleanedText;

    if (summarySource.length <= 160) {
      return summarySource;
    }

    return `${summarySource.slice(0, 157)}...`;
  };

  const getShareSummary = () => {
    return makeShareSummary(
      analysisResult?.shareSummary || analysisResult?.summary || feedbackText
    );
  };

  const splitSummaryIntoProblemAndAction = (feedback) => {
    const summaryText =
      feedback?.shareSummary || feedback?.summary || feedback?.text || "";

    const summaryLines = String(summaryText)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const problemText =
      feedback?.problemSummary ||
      summaryLines[0] ||
      makeShareSummary(summaryText);

    const actionText =
      feedback?.actionSummary ||
      summaryLines[1] ||
      feedback?.improvementPoint ||
      "다음 프로젝트에서 같은 피드백이 반복되지 않도록 확인해야 합니다.";

    return {
      problemText: makeShareSummary(problemText),
      actionText: makeShareSummary(actionText),
    };
  };

  const getCurrentProblemAndAction = () => {
    return splitSummaryIntoProblemAndAction({
      text: feedbackText,
      summary: analysisResult?.summary,
      shareSummary: analysisResult?.shareSummary,
      problemSummary: analysisResult?.problemSummary,
      actionSummary: analysisResult?.actionSummary,
      improvementPoint: analysisResult?.improvementPoint,
    });
  };

  const getCurrentTags = () => {
    if (analysisResult?.tags?.length > 0) {
      return analysisResult.tags;
    }

    return getTags(feedbackText);
  };

  const getCurrentChecklist = () => {
    if (analysisResult?.checklist?.length > 0) {
      return analysisResult.checklist;
    }

    return getChecklistItems(getCurrentTags());
  };

  const handleAnalyzeFeedback = async () => {
    if (feedbackText.trim() === "") {
      alert("분석할 피드백을 먼저 입력해 주세요.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackText,
          selectedProject,
          selectedSource,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "분석 중 오류가 발생했습니다.");
      }

      setAnalysisResult(data);
      goToPage("analysis");
    } catch (error) {
      console.error(error);
      setAnalysisError(error.message);
      alert(`분석에 실패했습니다: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createFeedbackData = () => {
    const currentTags = getCurrentTags();
    const currentChecklist = getCurrentChecklist();
    const { problemText, actionText } = getCurrentProblemAndAction();

    return {
      userId,
      project: selectedProject || "선택되지 않음",
      source: selectedSource || "선택되지 않음",
      text: feedbackText || "입력된 피드백이 없습니다.",
      summary:
        analysisResult?.summary || feedbackText || "입력된 피드백이 없습니다.",
      shareSummary: getShareSummary(),
      problemSummary: analysisResult?.problemSummary || problemText,
      actionSummary: analysisResult?.actionSummary || actionText,
      tags: currentTags,
      improvementPoint:
        analysisResult?.improvementPoint ||
        "다음 프로젝트에서 다시 확인해야 할 개선 포인트입니다.",
      checklist: currentChecklist,
      isShared: false,
    };
  };

  const handleSaveFeedback = async () => {
    const newFeedback = createFeedbackData();

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFeedback),
      });

      const savedFeedback = await response.json();

      if (!response.ok) {
        throw new Error(
          savedFeedback.error || "DB에 피드백을 저장하지 못했습니다."
        );
      }

      setFeedbackList([savedFeedback, ...feedbackList]);

      setFeedbackText("");
      setSelectedProject("");
      setSelectedSource("");
      setAnalysisResult(null);
      setAnalysisError("");

      goToPage("log");
    } catch (error) {
      console.error(error);
      alert(`피드백 저장에 실패했습니다: ${error.message}`);
    }
  };

  const handleShareSavedFeedback = async (feedback) => {
    if (feedback.isShared) {
      alert("이미 공유된 피드백입니다.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/feedbacks/${feedback.id}/share`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isShared: true,
          }),
        }
      );

      const updatedFeedback = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedFeedback.error || "피드백 공유 상태를 변경하지 못했습니다."
        );
      }

      setFeedbackList(
        feedbackList.map((item) =>
          item.id === updatedFeedback.id ? updatedFeedback : item
        )
      );

      setSharedFeedbackList([updatedFeedback, ...sharedFeedbackList]);

      goToPage("shared");
    } catch (error) {
      console.error(error);
      alert(`피드백 공유에 실패했습니다: ${error.message}`);
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/feedbacks/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "DB에서 피드백을 삭제하지 못했습니다.");
      }

      setFeedbackList(feedbackList.filter((feedback) => feedback.id !== id));
      setSharedFeedbackList(
        sharedFeedbackList.filter((feedback) => feedback.id !== id)
      );

      if (selectedFeedbackForChecklist?.id === id) {
        setSelectedFeedbackForChecklist(null);
      }
    } catch (error) {
      console.error(error);
      alert(`피드백 삭제에 실패했습니다: ${error.message}`);
    }
  };

  const handleDeleteSharedFeedback = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/feedbacks/${id}/share`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isShared: false,
          }),
        }
      );

      const updatedFeedback = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedFeedback.error || "공유 상태를 취소하지 못했습니다."
        );
      }

      setSharedFeedbackList(
        sharedFeedbackList.filter((feedback) => feedback.id !== id)
      );

      setFeedbackList(
        feedbackList.map((feedback) =>
          feedback.id === id ? updatedFeedback : feedback
        )
      );
    } catch (error) {
      console.error(error);
      alert(`공유 취소에 실패했습니다: ${error.message}`);
    }
  };

  const handleResetInput = () => {
    setFeedbackText("");
    setSelectedProject("");
    setSelectedSource("");
    setAnalysisResult(null);
    setAnalysisError("");
  };

  const handleClearAllData = async () => {
    const isConfirmed = window.confirm(
      "내 기록에 저장된 피드백을 모두 삭제할까요? 공유 피드백 목록에서는 내가 삭제한 피드백도 함께 사라집니다."
    );

    if (!isConfirmed) return;

    try {
      await Promise.all(
        feedbackList.map((feedback) =>
          fetch(`${API_BASE_URL}/api/feedbacks/${feedback.id}`, {
            method: "DELETE",
          })
        )
      );

      setFeedbackList([]);
      setSharedFeedbackList(
        sharedFeedbackList.filter(
          (sharedFeedback) => sharedFeedback.userId !== userId
        )
      );
      setSelectedFeedbackForChecklist(null);
      setCheckedChecklistItems({});

      localStorage.removeItem("projectRelayChecklistState");

      goToPage("home");
    } catch (error) {
      console.error(error);
      alert(`전체 데이터 초기화에 실패했습니다: ${error.message}`);
    }
  };

  const handleToggleChecklist = (key) => {
    setCheckedChecklistItems({
      ...checkedChecklistItems,
      [key]: !checkedChecklistItems[key],
    });
  };

  const getPatternTop3 = (projectName = "전체") => {
    const tagCount = {};

    const targetFeedbackList =
      projectName === "전체"
        ? sharedFeedbackList
        : sharedFeedbackList.filter(
            (feedback) => feedback.project === projectName
          );

    targetFeedbackList.forEach((feedback) => {
      feedback.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

    return sortedTags.slice(0, 3);
  };

  const filteredFeedbackList = feedbackList.filter((feedback) => {
    const tags = Array.isArray(feedback.tags) ? feedback.tags : [];

    const matchesProject =
      logProjectFilter === "전체" || feedback.project === logProjectFilter;

    const matchesTag = logTagFilter === "전체" || tags.includes(logTagFilter);

    const lowerKeyword = logSearchKeyword.toLowerCase();

    const matchesSearch =
      logSearchKeyword.trim() === "" ||
      feedback.text.toLowerCase().includes(lowerKeyword) ||
      feedback.summary?.toLowerCase().includes(lowerKeyword) ||
      feedback.shareSummary?.toLowerCase().includes(lowerKeyword) ||
      feedback.project.toLowerCase().includes(lowerKeyword) ||
      feedback.source.toLowerCase().includes(lowerKeyword) ||
      tags.join(" ").toLowerCase().includes(lowerKeyword);

    return matchesProject && matchesTag && matchesSearch;
  });

  const filteredSharedFeedbackList = sharedFeedbackList.filter((feedback) => {
    const tags = Array.isArray(feedback.tags) ? feedback.tags : [];

    const matchesProject =
      sharedProjectFilter === "전체" ||
      feedback.project === sharedProjectFilter;

    const matchesTag =
      sharedTagFilter === "전체" || tags.includes(sharedTagFilter);

    const lowerKeyword = sharedSearchKeyword.toLowerCase();

    const matchesSearch =
      sharedSearchKeyword.trim() === "" ||
      feedback.text.toLowerCase().includes(lowerKeyword) ||
      feedback.summary?.toLowerCase().includes(lowerKeyword) ||
      feedback.shareSummary?.toLowerCase().includes(lowerKeyword) ||
      feedback.project.toLowerCase().includes(lowerKeyword) ||
      tags.join(" ").toLowerCase().includes(lowerKeyword);

    return matchesProject && matchesTag && matchesSearch;
  });

  const homeTop3 = getPatternTop3("전체");
  const patternTop3 = getPatternTop3(selectedPatternProject);

  const patternChecklistItems = getChecklistItems(
    patternTop3.map(([tag]) => tag)
  );

  return (
    <div className="app">
      <nav className="nav">
        <button onClick={() => goToPage("home")}>Project Relay</button>
        <button onClick={() => goToPage("input")}>피드백 입력</button>
        <button onClick={() => goToPage("log")}>내 기록</button>
        <button onClick={() => goToPage("shared")}>공유 피드백</button>
        <button onClick={() => goToPage("pattern")}>패턴 요약</button>
      </nav>

      {page === "home" && (
        <section>
          <h1>프로젝트 릴레이</h1>
          <p>피드백을 모아 반복 패턴을 발견하는 성장 관리 서비스</p>

          <div className="box">
            <h2>피드백을 다음 프로젝트의 힌트로 바꾸세요</h2>
            <p>
              내가 받은 피드백을 기록하고, 다른 부트캠프 수강생들의 익명
              피드백을 참고해 다음 프로젝트 체크리스트로 연결할 수 있어요.
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
                아직 공유된 피드백이 없습니다. 피드백을 공유하면 이 영역이
                자동으로 업데이트됩니다.
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

          <button onClick={handleClearAllData}>내 기록 전체 삭제</button>
        </section>
      )}

      {page === "input" && (
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
            <p className="selected-info">
              선택한 프로젝트 유형: {selectedProject}
            </p>
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
            <p className="selected-info">
              선택한 피드백 출처: {selectedSource}
            </p>
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
      )}

      {page === "analysis" && (
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
            <h2>피드백 요약</h2>
            <p>
              {analysisResult?.summary ||
                feedbackText ||
                "아직 입력된 피드백이 없습니다."}
            </p>
          </div>

          <div className="box">
            <h2>공유용 핵심 요약</h2>
            <div className="shared-summary">
              <div className="summary-block problem">
                <span className="summary-label">핵심 문제</span>
                <p className="summary-text">
                  {analysisResult?.problemSummary ||
                    getCurrentProblemAndAction().problemText}
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
              이 단계에서는 피드백을 내 기록에 저장합니다. 익명 공유는 저장된
              피드백 기록에서 할 수 있습니다.
            </p>
          </div>

          <div className="button-row">
            <button onClick={handleSaveFeedback}>내 기록에 저장하기</button>
            <button onClick={() => goToPage("input")}>다시 수정하기</button>
          </div>
        </section>
      )}

      {page === "log" && (
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

            <p className="selected-info">
              검색 결과: {filteredFeedbackList.length}개
            </p>
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
              <div className="box feedback-card" key={feedback.id}>
                <div className="feedback-card-header">
                  <h2 className="feedback-card-title">{feedback.project}</h2>
                  <span className="feedback-status-chip">
                    {feedback.isShared ? "공유됨" : "미공유"}
                  </span>
                </div>

                <div className="feedback-meta-grid">
                  <div className="feedback-meta-item">
                    <span className="feedback-meta-label">피드백 출처</span>
                    <span className="feedback-meta-value">
                      {feedback.source}
                    </span>
                  </div>

                  <div className="feedback-meta-item">
                    <span className="feedback-meta-label">등록일</span>
                    <span className="feedback-meta-value">
                      {feedback.createdAt}
                    </span>
                  </div>
                </div>

                <div className="feedback-section">
                  <span className="feedback-section-label">태그</span>

                  <div className="tag-row">
                    {feedback.tags?.map((tag) => (
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
                  <button
                    onClick={() => {
                      setFeedbackText(feedback.text);
                      setSelectedProject(feedback.project);
                      setSelectedSource(feedback.source);
                      setAnalysisResult({
                        summary: feedback.summary,
                        shareSummary: feedback.shareSummary,
                        problemSummary: feedback.problemSummary,
                        actionSummary: feedback.actionSummary,
                        tags: feedback.tags,
                        improvementPoint: feedback.improvementPoint,
                        checklist: feedback.checklist,
                      });
                      goToPage("analysis");
                    }}
                  >
                    상세 보기
                  </button>

                  <button
                    onClick={() => {
                      setFeedbackText(feedback.text);
                      setSelectedProject(feedback.project);
                      setSelectedSource(feedback.source);
                      setAnalysisResult({
                        summary: feedback.summary,
                        shareSummary: feedback.shareSummary,
                        problemSummary: feedback.problemSummary,
                        actionSummary: feedback.actionSummary,
                        tags: feedback.tags,
                        improvementPoint: feedback.improvementPoint,
                        checklist: feedback.checklist,
                      });
                      goToPage("input");
                    }}
                  >
                    수정하기
                  </button>

                  <button onClick={() => handleDeleteFeedback(feedback.id)}>
                    삭제하기
                  </button>

                  <button onClick={() => handleShareSavedFeedback(feedback)}>
                    익명 공유하기
                  </button>

                  <button
                    onClick={() => setSelectedFeedbackForChecklist(feedback)}
                  >
                    이 피드백으로 체크리스트 만들기
                  </button>
                </div>
              </div>
            ))
          )}

          {selectedFeedbackForChecklist && (
            <div className="box">
              <h2>개인 체크리스트</h2>
              <p>
                아래 체크리스트는 내가 저장한 피드백을 바탕으로 다음 프로젝트에서
                확인할 항목이에요.
              </p>

              <div className="checklist">
                {(selectedFeedbackForChecklist.checklist?.length > 0
                  ? selectedFeedbackForChecklist.checklist
                  : getChecklistItems(selectedFeedbackForChecklist.tags)
                ).map((item) => {
                  const key = `personal-${selectedFeedbackForChecklist.id}-${item}`;

                  return (
                    <label className="checklist-item" key={key}>
                      <input
                        type="checkbox"
                        checked={!!checkedChecklistItems[key]}
                        onChange={() => handleToggleChecklist(key)}
                      />
                      <span
                        className={
                          checkedChecklistItems[key] ? "checked-text" : ""
                        }
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={() => goToPage("input")}>새 피드백 입력하기</button>
        </section>
      )}

      {page === "shared" && (
        <section>
          <h1>공유 피드백</h1>
          <p>다른 부트캠프 수강생들이 익명으로 공유한 피드백을 확인해보세요.</p>

          <div className="box">
            <h2>공유 피드백 필터</h2>

            <label className="input-label">검색</label>
            <div className="search-bar">
              <input
                className="search-input"
                value={sharedSearchInput}
                onChange={(e) => setSharedSearchInput(e.target.value)}
                placeholder="예: KPI, 발표 흐름, 문제 정의"
              />
              <div className="search-actions">
                <button
                  onClick={() => setSharedSearchKeyword(sharedSearchInput)}
                >
                  검색하기
                </button>
                <button
                  onClick={() => {
                    setSharedSearchInput("");
                    setSharedSearchKeyword("");
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
                  onClick={() => setSharedProjectFilter(project)}
                  className={sharedProjectFilter === project ? "selected" : ""}
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
                  onClick={() => setSharedTagFilter(tag)}
                  className={sharedTagFilter === tag ? "selected" : ""}
                >
                  {tag}
                </button>
              ))}
            </div>

            <p className="selected-info">
              공유 피드백 결과: {filteredSharedFeedbackList.length}개
            </p>
          </div>

          {sharedFeedbackList.length === 0 ? (
            <div className="box">
              <h2>아직 공유된 피드백이 없습니다.</h2>
              <p>
                내 기록에 저장된 피드백을 익명으로 공유하면 이 화면에 카드가
                추가됩니다.
              </p>
            </div>
          ) : filteredSharedFeedbackList.length === 0 ? (
            <div className="box">
              <h2>조건에 맞는 공유 피드백이 없습니다.</h2>
              <p>프로젝트 유형, 태그, 검색어를 바꿔보세요.</p>
            </div>
          ) : (
            <>
              <div className="box">
                <h2>공유된 피드백 목록</h2>
                <p>저장된 피드백 중 익명 공유한 항목만 이곳에 표시됩니다.</p>
              </div>

              {filteredSharedFeedbackList.map((feedback) => {
                const { problemText } =
                  splitSummaryIntoProblemAndAction(feedback);

                return (
                  <div className="box shared-card" key={feedback.id}>
                    <div className="shared-card-header">
                      <span className="project-chip">{feedback.project}</span>

                      <h2 className="card-eyebrow">
                        {feedback.summary || "요약된 피드백이 없습니다."}
                      </h2>

                      <div className="tag-row">
                        {feedback.tags?.map((tag) => (
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
                    </div>

                    <div className="button-row">
                      <button
                        onClick={() => handleDeleteSharedFeedback(feedback.id)}
                      >
                        공유 취소하기
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <div className="button-row">
            <button onClick={() => goToPage("pattern")}>패턴 요약 보기</button>
            <button onClick={() => goToPage("home")}>홈으로 돌아가기</button>
          </div>
        </section>
      )}

      {page === "pattern" && (
        <section>
          <h1>다음 프로젝트 체크리스트</h1>
          <p>
            이전 프로젝트에서 반복된 피드백을 바탕으로, 다음 프로젝트 시작 전에
            확인할 체크리스트를 만듭니다.
          </p>

          <div className="box">
            <h2>이전 프로젝트 선택</h2>
            <p>어떤 프로젝트에서 반복된 피드백을 기준으로 볼지 선택하세요.</p>

            <div className="button-row">
              {["전체", ...projectTypes].map((project) => (
                <button
                  key={project}
                  onClick={() => setSelectedPatternProject(project)}
                  className={
                    selectedPatternProject === project ? "selected" : ""
                  }
                >
                  {project}
                </button>
              ))}
            </div>

            <p className="selected-info">
              선택한 이전 프로젝트: {selectedPatternProject}
            </p>
          </div>

          <div className="box">
            <h2>{selectedPatternProject} 반복 피드백 TOP 3</h2>

            {patternTop3.length === 0 ? (
              <p>
                아직 이 프로젝트에 공유된 피드백이 없습니다. 내 기록에서
                피드백을 익명 공유하면 이 영역에 반영됩니다.
              </p>
            ) : (
              <ol>
                {patternTop3.map(([tag, count]) => (
                  <li key={tag}>
                    {tag} 관련 피드백 {count}회
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="box">
            <h2>체크리스트 생성 기준</h2>
            <p>
              이전 프로젝트에서 반복 빈도가 높고, 다음 프로젝트에서 예방 가능하며,
              사용자가 행동으로 확인할 수 있는 피드백을 기준으로 체크리스트를
              만듭니다.
            </p>
          </div>

          {showPatternChecklist && (
            <div className="box">
              <h2>다음 프로젝트 준비 체크리스트</h2>
              <p>
                선택한 프로젝트에서 반복된 피드백을 바탕으로, 다음 프로젝트 시작
                전에 다시 확인할 항목이에요.
              </p>

              <div className="checklist">
                {patternChecklistItems.length === 0 ? (
                  <p>아직 체크리스트를 만들 수 있는 공유 피드백이 없습니다.</p>
                ) : (
                  patternChecklistItems.map((item) => {
                    const key = `pattern-${selectedPatternProject}-${item}`;

                    return (
                      <label className="checklist-item" key={key}>
                        <input
                          type="checkbox"
                          checked={!!checkedChecklistItems[key]}
                          onChange={() => handleToggleChecklist(key)}
                        />
                        <span
                          className={
                            checkedChecklistItems[key] ? "checked-text" : ""
                          }
                        >
                          {item}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className="button-row">
            <button onClick={() => setShowPatternChecklist(true)}>
              다음 프로젝트 체크리스트 만들기
            </button>

            <button onClick={() => alert("패턴 요약 공유 링크가 생성되었어요!")}>
              패턴 요약 공유하기
            </button>

            <button onClick={() => goToPage("home")}>홈으로 돌아가기</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;