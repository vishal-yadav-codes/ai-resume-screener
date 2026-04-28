import google.generativeai as genai
import os

# Ensure you have set your GEMINI_API_KEY environment variable
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def analyze_resume_with_gemini(resume_text: str, job_description: str, additional_criteria: str) -> str:
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and senior recruiter.
    Analyze the following resume against the job description and criteria.
    
    Job Description:
    {job_description}
    
    Additional Criteria:
    {additional_criteria or 'None'}
    
    Resume Text:
    {resume_text}
    
    Respond STRICTLY with a JSON object in the following format. Do not include markdown code blocks (```json) in the output, just the raw JSON:
    {{
        "candidateName": "Extracted Name",
        "candidateEmail": "Extracted Email",
        "matchScore": 85,
        "topSkills": ["Skill 1", "Skill 2"],
        "matchedKeywords": ["keyword1", "keyword2"],
        "missingKeywords": ["keyword3", "keyword4"],
        "improvementSuggestions": ["Suggestion 1", "Suggestion 2"],
        "atsTips": ["Tip 1", "Tip 2"]
    }}
    """
    
    response = model.generate_content(prompt)
    return response.text.replace('```json', '').replace('```', '').strip()