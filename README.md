**BookBot - AI-Powered Book Question Answering System**
**"Read Less, Learn More!"**

BookBot is an AI-powered system that helps users quickly find answers from books. By processing books in PDF or text format, BookBot retrieves the most relevant sections and extracts precise answers using Natural Language Processing (NLP) techniques.

**Features:**
1. Supports both PDF and text files
2. Breaks books into smaller chunks for better processing
3. Uses FAISS indexing for fast and efficient text retrieval
4. Employs transformer-based AI models for accurate answers
5. Works well for students, researchers, and professionals

**How It Works:**
Load the Book – Reads the text from a PDF or text file
Split Text into Chunks – Breaks the book into small sections
Generate Embeddings – Converts each chunk into numerical vectors
Index with FAISS – Stores the embeddings for fast searching
Retrieve Context – Finds the most relevant text chunk for a given question
Generate an Answer – Uses an AI model to extract the best answer
  
**Installation:**
1️. Clone the repository

git clone https://github.com/your-username/BookBot.git
cd BookBot

2️. Install dependencies

pip install -r requirements.txt
**How to Run the Project:**
Once installed, follow these steps to run BookBot:

1️. Ensure you have a book file (PDF or TXT) in the data/ folder
2️. Run the script with the book file and a question as below.

python bookbot.py --book "data/pride_and_prejudice.pdf" --question "Who is the main character?"

3️. Example Output:

Loading book...
Generating embeddings...
Building FAISS index...
Retrieving relevant context...
Loading QA model...
Answering question...
Q: Who is the main character?
A: Lady Catherine.

-> Alternatively, modify the main() function in bookbot.py and run:

book_path = "data/pride_and_prejudice.pdf"
question = "Who is the main character?"
main(book_path, question)

**Technologies Used:**

Python – Core programming language

PyPDF2 – Extracts text from PDF files

FAISS – Efficient text retrieval using similarity search

Sentence Transformers – Converts text into embeddings

Hugging Face Transformers – Uses RoBERTa for question answering


**Future Improvements:**
1. Support for multiple books in a single query
2. Voice-based search for better user experience
3. Add support for more languages

**License:**
This project is open-source and available under the MIT License.


**Contact:**
[sahithisrikakolapu@gmail.com]
