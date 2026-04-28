# AI Resume Screener

## Overview
The AI Resume Screener is an intelligent application designed to streamline the recruitment process by automatically parsing and analyzing resumes against specific job descriptions. By leveraging state-of-the-art Generative AI, the tool evaluates candidates based on their skills, experience, and fitness for a role, providing objective matching scores and qualitative insights.

## Importance of the Project

The AI Resume Screener addresses several critical pain points in modern recruitment and human resources operations:

- **Hyper-Efficiency and Time Savings:** Traditional resume screening is a notoriously time-consuming bottleneck, often taking recruiters minutes per resume to manually parse. This application automates the initial screening phase, allowing organizations to process hundreds of applications in seconds. This shift enables HR professionals to focus on higher-value tasks such as conducting interviews and engaging with top talent.
- **Mitigation of Human Bias (Objectivity):** Unconscious bias can inadvertently affect the candidate screening process. By relying on an AI-driven, criteria-based evaluation, this tool standardizes the review process. Candidates are scored purely on their alignment with the documented job description, ensuring a fairer and more equitable screening process.
- **Deep Actionable Insights:** Beyond simple keyword matching, the use of Generative AI enables semantic understanding of a candidate's experience. The system doesn't just return a score; it generates a holistic analysis containing specific strengths, potential weaknesses or knowledge gaps, and an overall justification of the candidate's fitness for the role.
- **Scalability for High-Volume Hiring:** For enterprise-level recruitment or high-turnover roles, the sheer volume of applications can be overwhelming. This tool scales effortlessly to meet high-volume demands without a drop in evaluation quality.
- **Seamless Data Ingestion (Multi-format Support):** Candidates submit resumes in varying formats. By integrating robust parsing tools, the system seamlessly extracts text from both PDF and DOCX files without losing crucial context, lowering the barrier for candidate submission.

## Technologies Used & Architecture Overview

This project is built using a modern, decoupled microservices-like architecture to ensure separation of concerns, scalability, and high performance.

- **Frontend: React.js & Vite**
  - **Why:** React allows for a component-based, highly dynamic user interface that responds instantly to user interactions. Vite is used as the build tool to provide an ultra-fast development environment and optimized production builds. 
  - **Role:** Handles the presentation layer, allowing users to upload documents, input job descriptions, and visualize the AI-generated results, including matching scores and detailed feedback.

- **Backend: Python & FastAPI**
  - **Why:** FastAPI is a modern, high-performance web framework for building APIs with Python. It is incredibly fast and ideal for building robust, machine-learning-adjacent microservices.
  - **Role:** Serves as the core processing engine. It exposes RESTful endpoints for the frontend, manages file uploads securely, coordinates document parsing, and orchestrates the calls to the AI engine.

- **AI Engine: Google Gemini API (`google-generativeai`)**
  - **Why:** Google's Gemini is a state-of-the-art Large Language Model (LLM) capable of deep contextual understanding and reasoning.
  - **Role:** Acts as the "brain" of the screener. It ingests the parsed resume text and the job description, performs semantic comparison, and generates human-like, structured evaluation reports and match scores.

- **Document Parsing: `PyMuPDF` (fitz) & `python-docx`**
  - **Why:** Reliable text extraction is critical for the AI to function correctly. `PyMuPDF` is exceptionally fast and accurate at reading PDF content, while `python-docx` safely extracts paragraphs from Word documents.
  - **Role:** Converts binary file uploads (PDF/DOCX) into clean, readable text strings that the Gemini model can process.

- **Middleware: Node.js & Express**
  - **Why:** Node.js offers an asynchronous, event-driven runtime ideal for handling concurrent I/O operations.
  - **Role:** Handles intermediate routing, acts as an API gateway, and provides additional server-side logic to bridge the frontend and backend when necessary.

## Implementation Details

The system is divided into three main components: Frontend, Backend, and Middleware. They work together to process the uploaded resume against a job description.

1.  **Frontend Interaction:** The user interacts with the React interface to upload a resume file (PDF or DOCX) and paste a job description.
2.  **Request Routing:** The frontend sends these details via the Node.js Middleware (acting as a gateway/router), or directly to the Backend API.
3.  **Document Parsing:** The Python backend receives the file, uses `PyMuPDF` or `python-docx` to extract text from the document.
4.  **AI Processing:** The extracted resume text and the provided job description are formatted into a precise prompt. This prompt is sent to the Google Gemini API.
5.  **Result Generation:** Gemini analyzes the match, determining a percentage fit and extracting qualitative insights.
6.  **Response:** The backend returns the structured JSON response back to the frontend, which renders it beautifully for the user.

## How to Run the Project Locally

To run the full application locally, you will need to start the frontend, backend, and middleware servers.

### 1. Backend (Python/FastAPI)
The backend is responsible for parsing documents and communicating with the Gemini AI.
- Open a terminal and navigate to the `backend` folder:
  ```bash
  cd backend
  ```
- Activate the virtual environment (on Windows):
  ```bash
  .\venv\Scripts\activate
  ```
- Install the required dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Set up environment variables: Create a `.env` file in the `backend` directory and add your Google Gemini API key:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  ```
- Start the backend server:
  ```bash
  python main.py
  ```
- The backend will run on `http://localhost:8000`

### 2. Frontend (React/Vite)
The frontend provides the user interface for uploading resumes and viewing the AI's analysis.
- Open a new terminal and navigate to the `frontend` folder:
  ```bash
  cd frontend
  ```
- Install the Node dependencies:
  ```bash
  npm install
  ```
- Start the Vite development server:
  ```bash
  npm run dev
  ```
- The application will be accessible in your browser (usually at `http://localhost:5173`).

### 3. Middleware (Node.js)
The middleware handles additional server-side logic and routing.
- Open a new terminal and navigate to the `middleware` folder:
  ```bash
  cd middleware
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the middleware server:
  ```bash
  node server.js
  ```
