from flask import Flask, render_template, request, redirect, url_for
import os, re
from pypdf import PdfReader
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# ---- Evaluation Imports ----
from sklearn.metrics.pairwise import cosine_similarity
from rouge_score import rouge_scorer
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from datetime import datetime

app = Flask(__name__)

# ---------------- MODELS ----------------
embedder = SentenceTransformer("all-MiniLM-L6-v2")

MODEL_NAME = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

qa_pipeline = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# ---------------- GLOBALS ----------------
TEXT_CHUNKS = []
CHUNK_EMBEDDINGS = None
FAISS_INDEX = None
history = []

UPLOAD_FOLDER = "uploads"
GRAPH_FOLDER = "evaluation_graphs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GRAPH_FOLDER, exist_ok=True)

# ---------------- CLEANING ----------------
def clean_text(text):
    text = re.sub(r"\b\d{1,3}\b", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# ---------------- EXTRACT ----------------
def extract_text(path):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += " " + page.extract_text()
    return clean_text(text)

# ---------------- CHUNK ----------------
def chunk_text(text, size=160, overlap=40):
    words = text.split()
    chunks = []
    for i in range(0, len(words), size - overlap):
        chunk = " ".join(words[i:i + size])
        if len(chunk.split()) > 60:
            chunks.append(chunk)
    return chunks

# ---------------- FAISS (Cosine Similarity Based) ----------------
def build_faiss(chunks):
    global CHUNK_EMBEDDINGS

    emb = embedder.encode(chunks, convert_to_numpy=True)
    faiss.normalize_L2(emb)  
    CHUNK_EMBEDDINGS = emb

    index = faiss.IndexFlatIP(emb.shape[1]) 
    index.add(emb)

    return index

# ---------------- RETRIEVAL EVALUATION ----------------
def evaluate_retrieval(question, retrieved_indices, k=5):
    """
    Pseudo evaluation:
    Most semantically similar chunk to question
    is treated as relevant.
    """

    q_emb = embedder.encode([question], convert_to_numpy=True)
    faiss.normalize_L2(q_emb)

    sims = np.dot(CHUNK_EMBEDDINGS, q_emb.T).flatten()
    relevant_index = int(np.argmax(sims))

    # Precision@5
    precision = 1 if relevant_index in retrieved_indices[:k] else 0

    # MRR
    rank = None
    for i, idx in enumerate(retrieved_indices):
        if idx == relevant_index:
            rank = i + 1
            break

    mrr = 1 / rank if rank else 0

    return {
        "Precision@5": precision,
        "MRR": round(mrr, 3)
    }

# ---------------- GENERATION EVALUATION ----------------
def evaluate_generation(question, generated):
    

    q_emb = embedder.encode([question], convert_to_numpy=True)
    faiss.normalize_L2(q_emb)

    sims = np.dot(CHUNK_EMBEDDINGS, q_emb.T).flatten()
    best_chunk_index = int(np.argmax(sims))

    ground_truth = TEXT_CHUNKS[best_chunk_index]

    # Cosine similarity between generated answer & ground truth chunk
    gen_emb = embedder.encode([generated])
    gt_emb = embedder.encode([ground_truth])

    cosine = cosine_similarity(gen_emb, gt_emb)[0][0]

    scorer = rouge_scorer.RougeScorer(['rougeL'], use_stemmer=True)
    rouge_scores = scorer.score(ground_truth, generated)

    return {
        "Cosine Similarity": round(float(cosine), 3),
        "ROUGE-L": round(rouge_scores['rougeL'].fmeasure, 3)
    }

# ---------------- GRAPH ----------------
def plot_metrics(metrics):
    names = list(metrics.keys())
    values = list(metrics.values())

    plt.figure()
    plt.bar(names, values)
    plt.title("RAG System Evaluation Metrics")
    plt.ylim(0, 1)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(GRAPH_FOLDER, f"evaluation_{timestamp}.png")

    plt.savefig(path)
    plt.close()

    print(f"\nEvaluation graph saved at: {path}")

# ---------------- ANSWER ----------------
def generate_answer(question, answer_type):
    q_emb = embedder.encode([question], convert_to_numpy=True)
    faiss.normalize_L2(q_emb)
    
    distances, indices = FAISS_INDEX.search(q_emb, 5)

    CONFIG = {
        "short": {"chunks": 1, "tokens": 60,
                "instruction": "Give a short direct answer strictly using the context."},
        "medium": {"chunks": 2, "tokens": 150,
                "instruction": "Explain clearly in one short paragraph using only the context."},
        "long": {"chunks": 4, "tokens": 300,
                "instruction": "Explain in detail using only the context without adding external knowledge."}
    }

    cfg = CONFIG.get(answer_type, CONFIG["medium"])
    context = " ".join(TEXT_CHUNKS[i] for i in indices[0][:cfg["chunks"]])

    prompt = f"""
    {cfg['instruction']}

    Context:
    {context}

    Question:
    {question}

    Answer:
    """

    result = qa_pipeline(prompt, max_new_tokens=cfg["tokens"], do_sample=False)
    final_answer = result[0]["generated_text"].strip()

    return final_answer, indices[0]

# ---------------- ROUTES ----------------
@app.route("/", methods=["GET", "POST"])
def index():
    global TEXT_CHUNKS, FAISS_INDEX, history

    answer = None
    answer_type = "short"

    if request.method == "POST":
        question = request.form.get("question")
        answer_type = request.form.get("answer_type", "short")
        file = request.files.get("book")

        if file and FAISS_INDEX is None:
            path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(path)
            text = extract_text(path)
            TEXT_CHUNKS = chunk_text(text)
            FAISS_INDEX = build_faiss(TEXT_CHUNKS)
            history.clear()

        if question and FAISS_INDEX:
            answer, retrieved_indices = generate_answer(question, answer_type)

            retrieval_metrics = evaluate_retrieval(question, retrieved_indices)
            generation_metrics = evaluate_generation(question, answer)

            all_metrics = {**retrieval_metrics, **generation_metrics}

            print("\n RAG Evaluation Metrics:")
            for k, v in all_metrics.items():
                print(f"{k}: {v}")

            plot_metrics(all_metrics)

            history.insert(0, (question, answer))
            history[:] = history[:5]

    return render_template(
        "index.html",
        answer=answer,
        history=history,
        answer_type=answer_type
    )

@app.route("/clear-history", methods=["POST"])
def clear_history():
    history.clear()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)