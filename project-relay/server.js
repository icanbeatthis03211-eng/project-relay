import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Project Relay API server is running.");
});

const allowedTags = [
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

const makeShortText = (text, maxLength = 120) => {
  if (!text) return "";

  const cleanText = String(text).replace(/\s+/g, " ").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength)}...`;
};

const toClientFeedback = (row) => {
  return {
    id: row.id,
    userId: row.user_id,
    project: row.project,
    source: row.source,
    text: row.text,
    summary: row.summary,
    shareSummary: row.share_summary,
    problemSummary: row.problem_summary,
    actionSummary: row.action_summary,
    tags: row.tags || [],
    improvementPoint: row.improvement_point,
    checklist: row.checklist || [],
    isShared: row.is_shared,
    shareMode: row.share_mode || "summary",
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleDateString("ko-KR")
      : "",
  };
};

const toDbFeedback = (feedback) => {
  return {
    user_id: feedback.userId,
    project: feedback.project || "선택되지 않음",
    source: feedback.source || "선택되지 않음",
    text: feedback.text || "입력된 피드백이 없습니다.",
    summary: feedback.summary || "",
    share_summary: feedback.shareSummary || "",
    problem_summary: feedback.problemSummary || "",
    action_summary: feedback.actionSummary || "",
    tags: Array.isArray(feedback.tags) ? feedback.tags : [],
    improvement_point: feedback.improvementPoint || "",
    checklist: Array.isArray(feedback.checklist) ? feedback.checklist : [],
    is_shared: Boolean(feedback.isShared),
    share_mode: feedback.shareMode || "summary",
  };
};

/* =========================
   GPT 피드백 분석 API
========================= */

app.post("/api/analyze-feedback", async (req, res) => {
  try {
    const { feedbackText, selectedProject, selectedSource } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY가 설정되어 있지 않습니다.",
      });
    }

    if (!feedbackText || feedbackText.trim() === "") {
      return res.status(400).json({
        error: "피드백 내용이 비어 있습니다.",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
너는 PM/서비스기획 부트캠프 수강생의 피드백을 분석하는 도우미다.

중요한 목표:
긴 피드백을 그대로 요약하지 말고, 공유 피드백 카드에서 사람들이 빠르게 읽을 수 있는 짧은 문장으로 압축해야 한다.

반드시 지켜야 할 규칙:
1. 반드시 JSON 형식으로만 답한다.
2. JSON 바깥에 설명을 쓰지 않는다.
3. tags는 제공된 태그 목록 중에서만 고른다.
4. summary는 내 기록용 요약이다. 최대 2문장으로 작성한다.
5. shareSummary는 공유 카드용 요약이다. 반드시 2줄 이내로 작성한다.
6. problemSummary는 "무엇이 문제인지"만 한 문장으로 작성한다.
7. actionSummary는 "다음 프로젝트에서 무엇을 해야 하는지"만 한 문장으로 작성한다.
8. problemSummary와 actionSummary는 각각 70자 이내로 작성한다.
9. shareSummary는 problemSummary와 actionSummary를 합친 느낌으로 작성한다.
10. 피드백 원문을 길게 풀어쓰지 않는다.
11. 개인 이름, 팀명, 회사명 등 개인 식별 정보는 제거한다.
12. checklist는 다음 프로젝트에서 바로 확인 가능한 질문형 문장으로 작성한다.
          `,
        },
        {
          role: "user",
          content: `
프로젝트 유형: ${selectedProject || "선택되지 않음"}
피드백 출처: ${selectedSource || "선택되지 않음"}

피드백 원문:
${feedbackText}

아래 JSON 형식으로만 답해줘.

{
  "summary": "내 기록용 요약. 최대 2문장.",
  "shareSummary": "공유 카드용 요약. 최대 2줄.",
  "problemSummary": "문제만 한 문장으로 요약. 70자 이내.",
  "actionSummary": "다음 프로젝트에서 할 일을 한 문장으로 요약. 70자 이내.",
  "tags": ["문제 정의", "우선순위"],
  "improvementPoint": "다음 프로젝트에서 개선해야 할 점. 최대 1문장.",
  "checklist": [
    "다음 프로젝트 시작 전에 확인할 체크리스트 1",
    "다음 프로젝트 시작 전에 확인할 체크리스트 2",
    "다음 프로젝트 시작 전에 확인할 체크리스트 3"
  ]
}

사용 가능한 태그:
문제 정의, 타깃 설정, 리서치 근거, KPI, 우선순위, 발표 흐름, 기능 논리, 장표 표현, 데이터 해석, 사용자 관점
          `,
        },
      ],
    });

    const outputText = response.output_text;

    let analysisResult;

    try {
      analysisResult = JSON.parse(outputText);
    } catch {
      return res.status(500).json({
        error: "AI 응답을 JSON으로 변환하지 못했습니다.",
        raw: outputText,
      });
    }

    const filteredTags = Array.isArray(analysisResult.tags)
      ? analysisResult.tags.filter((tag) => allowedTags.includes(tag))
      : [];

    const problemSummary = makeShortText(
      analysisResult.problemSummary ||
        analysisResult.summary ||
        "피드백의 핵심 문제가 정리되지 않았습니다.",
      70
    );

    const actionSummary = makeShortText(
      analysisResult.actionSummary ||
        analysisResult.improvementPoint ||
        "다음 프로젝트에서 개선 방향을 다시 확인해야 합니다.",
      70
    );

    const shareSummary =
      analysisResult.shareSummary && analysisResult.shareSummary.length <= 160
        ? analysisResult.shareSummary
        : `${problemSummary}\n${actionSummary}`;

    const safeResult = {
      summary: makeShortText(
        analysisResult.summary || `${problemSummary} ${actionSummary}`,
        180
      ),
      shareSummary,
      problemSummary,
      actionSummary,
      tags: filteredTags.length > 0 ? filteredTags : ["문제 정의"],
      improvementPoint: makeShortText(
        analysisResult.improvementPoint ||
          actionSummary ||
          "다음 프로젝트에서 개선 포인트를 다시 확인해야 합니다.",
        120
      ),
      checklist: Array.isArray(analysisResult.checklist)
        ? analysisResult.checklist.slice(0, 3)
        : ["다음 프로젝트에서 같은 피드백이 반복되지 않도록 확인했는가?"],
    };

    return res.json(safeResult);
  } catch (error) {
    console.error("OpenAI API Error:", error);

    return res.status(500).json({
      error: "피드백 분석 중 오류가 발생했습니다.",
      detail: error.message,
    });
  }
});

/* =========================
   Supabase DB API
========================= */

// 내 피드백만 불러오기
app.get("/api/feedbacks", async (req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: "Supabase 환경변수가 설정되어 있지 않습니다.",
      });
    }

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId가 필요합니다.",
      });
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data.map(toClientFeedback));
  } catch (error) {
    console.error("Supabase GET Error:", error);

    return res.status(500).json({
      error: "피드백 목록을 불러오지 못했습니다.",
      detail: error.message,
    });
  }
});

// 공유 피드백 전체 불러오기
app.get("/api/shared-feedbacks", async (req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: "Supabase 환경변수가 설정되어 있지 않습니다.",
      });
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("is_shared", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data.map(toClientFeedback));
  } catch (error) {
    console.error("Supabase Shared GET Error:", error);

    return res.status(500).json({
      error: "공유 피드백 목록을 불러오지 못했습니다.",
      detail: error.message,
    });
  }
});

// 피드백 저장하기
app.post("/api/feedbacks", async (req, res) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: "Supabase 환경변수가 설정되어 있지 않습니다.",
      });
    }

    const feedback = req.body;

    if (!feedback.userId) {
      return res.status(400).json({
        error: "userId가 필요합니다.",
      });
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .insert([toDbFeedback(feedback)])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(toClientFeedback(data));
  } catch (error) {
    console.error("Supabase POST Error:", error);

    return res.status(500).json({
      error: "피드백을 저장하지 못했습니다.",
      detail: error.message,
    });
  }
});

// 공유 상태 및 공유 방식 변경하기
app.patch("/api/feedbacks/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const { isShared, shareMode } = req.body;

    const updateData = {
      is_shared: Boolean(isShared),
    };

    if (isShared) {
      updateData.share_mode = shareMode === "full" ? "full" : "summary";
    }

    if (!isShared) {
      updateData.share_mode = "summary";
    }

    const { data, error } = await supabase
      .from("feedbacks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.json(toClientFeedback(data));
  } catch (error) {
    console.error("Supabase PATCH Error:", error);

    return res.status(500).json({
      error: "공유 상태를 변경하지 못했습니다.",
      detail: error.message,
    });
  }
});

// 피드백 삭제하기
app.delete("/api/feedbacks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("feedbacks").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return res.json({
      message: "피드백이 삭제되었습니다.",
      id,
    });
  } catch (error) {
    console.error("Supabase DELETE Error:", error);

    return res.status(500).json({
      error: "피드백을 삭제하지 못했습니다.",
      detail: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});