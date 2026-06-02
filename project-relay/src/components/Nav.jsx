export const getTags = (text = "") => {
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

export const getChecklistItems = (tags = []) => {
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

export const makeShortText = (text, maxLength = 150) => {
  if (!text) return "";

  const cleanText = String(text).replace(/\s+/g, " ").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength)}...`;
};

export const getShareSummaryText = (feedback) => {
  if (feedback?.shareSummary) {
    return feedback.shareSummary;
  }

  if (feedback?.problemSummary || feedback?.actionSummary) {
    return [feedback.problemSummary, feedback.actionSummary]
      .filter(Boolean)
      .join("\n");
  }

  if (feedback?.summary) {
    return makeShortText(feedback.summary, 150);
  }

  if (feedback?.text) {
    return makeShortText(feedback.text, 150);
  }

  return "공유용 요약이 없습니다.";
};

export const getPatternTop3 = (
  sharedFeedbackList = [],
  projectName = "전체"
) => {
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

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
};