**BookBot - AI-Powered Book Question Answering System**
**"Read Less, Learn More!"**

BookBot is an intelligent, interactive application that allows users to upload documents (PDF or TXT) and ask natural language questions about the content. It combines a clean web interface with advanced NLP techniques to provide accurate, context-based answers.

**Overview**

BookBot helps users save time by analyzing entire documents and answering specific questions directly from their content. It supports file uploads, processes the text using AI, and displays the result instantly in a modern, user-friendly UI.

**Features:**

1. Supports both PDF and text files
2. Breaks books into smaller chunks for better processing
3. Uses FAISS indexing for fast and efficient text retrieval
4. Employs transformer-based AI models for accurate answers
5. Clean and responsive interface with animations
6. Works on both desktop and mobile
7. Works well for students, researchers, and professionals
   
**Project Structure**

  bookbot/
  ├── index.html         
  ├── css/
  │   └── style.css       
  ├── js/
  │   └── main.js        
└── README.md 

**How It Works:**

Load the Book – Reads the text from a PDF or text file
Split Text into Chunks – Breaks the book into small sections
Generate Embeddings – Converts each chunk into numerical vectors
Index with FAISS – Stores the embeddings for fast searching
Retrieve Context – Finds the most relevant text chunk for a given question
Generate an Answer – Uses an AI model to extract the best answer

**Installation & Setup**

1.Clone or download the project files

2.Ensure proper folder structure as shown above

3.Open index.html in your web browser

No additional setup or dependencies required - everything runs in the browser!

**Usage**

**1. Upload a Document**

  Click the "Choose PDF or TXT file" button
  
  Select your document from your device
  
  Wait for the processing confirmation

**2. Ask Questions**

  Type your question in the input field
  
  Press Enter or click "Ask" to submit
  
  View the AI-generated response

**3. Review History**

  All questions and answers are automatically saved
  
  View your question history in the right panel
  
  Clear history when needed
  
**Sample Questions**

  Try asking questions like:
  
  "Who is the main character?"
  "What is the setting of the story?"
  "What are the main themes?"
  "Who wrote this book?"
  "What is the plot summary?"

**Example Output:**

  Loading book...
  Generating embeddings...
  Building FAISS index...
  Retrieving relevant context...
  Loading QA model...
  Answering question...
  Q: Who is the main character?
  A: Lady Catherine.

**Technologies Used:**

Python – Core programming language

PyPDF2 – Extracts text from PDF files

FAISS – Efficient text retrieval using similarity search

Sentence Transformers – Converts text into embeddings

Hugging Face Transformers – Uses RoBERTa for question answering

HTML/CSS/JS – Interactive web interface

LocalStorage – Saves question-answer history on frontend


**Future Improvements:**

1. Support multiple books in a single query

2.Add voice-based question support

3.Enable multi-language document Q&A

4.Add admin analytics dashboard

**License:**

This project is open-source and available under the MIT License.


**Contact:**

For questions or collaborations, reach out:
[sahithisrikakolapu@gmail.com]
