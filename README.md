# Smart Document Query System Using NLP

## About the Project
The Smart Document Query System is an AI-based application that enables users to interact with documents using natural language. Instead of manually searching through large PDFs or reports, users can simply ask questions and receive precise, context-aware answers.

This system leverages modern NLP techniques and semantic search to understand the intent behind queries rather than relying on keyword matching.

---

##  Problem
Searching information in large documents is inefficient:
- Users must read entire documents manually  
- Keyword search often returns irrelevant results  
- No understanding of context or meaning  

---

## Solution
This project introduces an intelligent pipeline that:
- Extracts and processes document content  
- Converts text into semantic embeddings  
- Matches user queries with relevant document sections  
- Returns accurate answers instantly  

---

## ⚙️ How It Works

1. **Document Upload**  
   Users upload PDF or text documents  

2. **Text Extraction & Cleaning**  
   Removes noise and prepares structured text  

3. **Chunking**  
   Splits large text into smaller meaningful chunks  

4. **Embedding Generation**  
   Converts chunks into vector representations  

5. **Vector Storage**  
   Stores embeddings for efficient retrieval  

6. **Query Processing**  
   Converts user question into embedding  

7. **Similarity Matching**  
   Finds the most relevant text chunks  

8. **Answer Retrieval**  
   Displays context-based response  

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Flask / FastAPI)  
- **AI/NLP:** Transformer Models (BERT), Sentence Embeddings  
- **Vector Database:** FAISS / ChromaDB  

---

##  Key Features

- Document upload and processing  
- Semantic (meaning-based) search  
- AI-powered question answering  
- Fast and scalable retrieval  
- Handles large documents efficiently  

---

## Run Locally

```bash
git clone https://github.com/your-username/smart-document-query-system.git
cd smart-document-query-system
pip install -r requirements.txt
python app.py
