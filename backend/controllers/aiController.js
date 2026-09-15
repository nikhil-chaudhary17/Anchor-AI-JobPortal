import { generateContent } from "../utils/geminiClient.js";

// Helper: Gemini sometimes wraps JSON responses in ```json ... ``` fences
// even when told not to. Strip those before parsing so we don't crash.
const parseAIJson = (raw) => {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

export const generateJobDescription = async (req, res, next) => {
  try {
    const { title, keyPoints, jobType, location } = req.body;

    if (!title || !keyPoints) {
      return res.status(400).json({
        success: false,
        message: "title and keyPoints are required",
      });
    }

    const prompt = `You are a professional HR copywriter. Write a clear, well-structured job description for the following role.

Job Title: ${title}
Job Type: ${jobType || "Not specified"}
Location: ${location || "Not specified"}
Key points provided by the recruiter: ${keyPoints}

Write the job description in this structure:
1. A short 2-3 sentence overview of the role.
2. "Responsibilities" section with 4-6 bullet points.
3. "Requirements" section with 4-6 bullet points.
Keep it professional, concise, and free of fluff. Do not include the job title as a heading — just the body content.`;

    const description = await generateContent(prompt);

    res.status(200).json({
      success: true,
      result: {
        description
      },
    });
  } catch (error) {
    next(error);
  }
};



export const matchResumeWithJob = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "resumeText and jobDescription are required",
      });
    }

    const prompt = `
You are an AI recruitment assistant.

Analyze how well the candidate's resume matches the given job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Evaluate the candidate based on:
- Required skills
- Technical experience
- Relevant qualifications
- Overall suitability for the role

Return the result ONLY in this JSON format:

{
  "score": 85,
  "feedback": "The candidate is a strong match because..."
}

Rules:
- score must be a number between 0 and 100.
- feedback should briefly explain the main strengths and missing skills.
- Do not include markdown.
- Do not include any extra text outside the JSON.
`;

    const result = await generateContent(prompt);

    const parsedResult = parseAIJson(result);

    res.status(200).json({
      success: true,
      result: parsedResult,
    });
  } catch (error) {
    next(error);
  }
};



export const recommendJobs = async (req, res, next) => {
  try {
    const { skills, jobs } = req.body;

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skills must be a non-empty array",
      });
    }

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "jobs must be a non-empty array",
      });
    }

    const prompt = `
You are an AI job recommendation assistant.

Recommend the most suitable jobs for the candidate based on their skills.

CANDIDATE SKILLS:
${skills.join(", ")}

AVAILABLE JOBS:
${JSON.stringify(jobs)}

For each recommended job, provide:
- jobId
- matchScore (0-100)
- reason

Return ONLY valid JSON in this format:

{
  "recommendations": [
    {
      "jobId": "job_id",
      "matchScore": 90,
      "reason": "Strong match because..."
    }
  ]
}

Rules:
- Recommend only jobs that are relevant to the candidate.
- matchScore must be between 0 and 100.
- Keep the reason short.
- Do not include markdown.
- Do not include any text outside the JSON.
`;

    const result = await generateContent(prompt);

    const parsedResult = parseAIJson(result);

    res.status(200).json({
      success: true,
      result: parsedResult,
    });
  } catch (error) {
    next(error);
  }
};




export const generateCoverLetter = async (req, res, next) => {
  try {
    const { candidateName, skills, jobTitle, company, jobDescription } = req.body;

    if (!candidateName || !jobTitle || !company || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "candidateName, jobTitle, company and jobDescription are required",
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skills must be a non-empty array",
      });
    }

    const prompt = `
You are a professional career assistant.

Write a personalized cover letter for the candidate applying for the following job.

Candidate Name: ${candidateName}

Candidate Skills:
${skills.join(", ")}

Job Title: ${jobTitle}

Company: ${company}

Job Description:
${jobDescription}

Write a professional and concise cover letter.

Requirements:
- Address the hiring team professionally.
- Mention relevant candidate skills.
- Explain why the candidate is suitable for the role.
- Show genuine interest in the position.
- Keep it around 3-4 paragraphs.
- Do not use fake experience or qualifications.
- Do not include a subject line.
- Return only the cover letter text.
`;

    const coverLetter = await generateContent(prompt);

    res.status(200).json({
      success: true,
      result: {
        coverLetter,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const generateInterviewPrep = async (req, res, next) => {
  try {
    const { jobTitle, jobDescription, skills } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "jobTitle and jobDescription are required",
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skills must be a non-empty array",
      });
    }

    const prompt = `
You are an AI interview preparation assistant.

Create interview preparation material for a candidate applying for this job.

JOB TITLE:
${jobTitle}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SKILLS:
${skills.join(", ")}

Generate:
1. 5 technical interview questions
2. 3 behavioral interview questions
3. 2 practical/scenario-based questions

For every question provide:
- question
- difficulty
- whatToExpect

Return ONLY valid JSON in this format:

{
  "technicalQuestions": [
    {
      "question": "What is React?",
      "difficulty": "Easy",
      "whatToExpect": "Basic understanding of React and its core concepts."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about yourself.",
      "difficulty": "Easy",
      "whatToExpect": "A concise summary of your background, skills and career goals."
    }
  ],
  "scenarioQuestions": [
    {
      "question": "How would you optimize a slow React application?",
      "difficulty": "Medium",
      "whatToExpect": "Discussion of performance optimization techniques."
    }
  ]
}

Rules:
- Return exactly 5 technical questions.
- Return exactly 3 behavioral questions.
- Return exactly 2 scenario questions.
- Difficulty must be Easy, Medium, or Hard.
- Keep whatToExpect short.
- Questions should be relevant to the job.
- Do not include markdown.
- Do not include any text outside the JSON.
`;

    const result = await generateContent(prompt);

    const parsedResult = parseAIJson(result);

    res.status(200).json({
      success: true,
      result: parsedResult,
    });
  } catch (error) {
    next(error);
  }
};