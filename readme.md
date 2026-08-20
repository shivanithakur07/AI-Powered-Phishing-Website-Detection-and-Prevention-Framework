# AI-Powered Phishing Website Detection and Prevention Framework

**A Hybrid Ensemble Approach Combining URL-Based, Content-Based, and Reputation-Based Threat Intelligence**

## PhishShield UI
<img width="1917" height="830" alt="image" src="https://github.com/user-attachments/assets/d6ad6262-4dc5-4493-93ce-bd3b16da1bb8" />


---

## Abstract

Phishing remains one of the most prevalent and financially damaging forms of cyber fraud, exploiting user trust through deceptive URLs and impersonated web content. Existing detection approaches typically rely on a single signal — either lexical/structural URL features, webpage content analysis, or static blacklists — each of which is individually vulnerable to evasion. This project proposes a **hybrid, multi-layered phishing detection framework** that fuses three complementary detection modules: (A) a URL heuristic risk scorer using rule-based checks (HTTPS, IP-as-domain, subdomains, TLDs, keyword analysis), (B) a content-based NLP classifier analyzing live-scraped webpage HTML/text via TF-IDF and Linear SVM, and (C) a real-time reputation check against URLhaus and VirusTotal threat intelligence feeds. Outputs from all three modules are combined via weighted fusion to produce a final verdict with confidence score. The framework includes a known-legitimate domain override to prevent false positives on minimalist pages (e.g., Google's homepage) and graceful degradation when modules are unavailable. The system is deployed as a Flask-based web application with a protocol dropdown UI for real-time, user-facing phishing detection.

**Keywords:** Phishing Detection, Machine Learning, Ensemble Learning, Cybersecurity, Natural Language Processing, Web Security, Threat Intelligence

---

## 1. Introduction

### 1.1 Motivation
Phishing attacks continue to be a dominant attack vector in cybercrime, costing individuals and organizations billions annually through credential theft, financial fraud, and data breaches. Attackers continuously evolve their tactics — rotating domains, spoofing brand identities, and using URL obfuscation — making static, rule-based detection systems increasingly ineffective.

### 1.2 Problem Statement
Most academic and commercial phishing detectors rely on a **single detection signal**:
- URL-only models miss content-level impersonation (e.g., a legitimate-looking domain hosting a spoofed login page).
- Content-only models are computationally expensive and fail on URL-obfuscation-based attacks.
- Blacklist-only systems (e.g., Safe Browsing) have a detection lag — new phishing domains ("zero-hour phishing") are often live for hours before being blacklisted.

### 1.3 Proposed Solution
This project builds a **three-module hybrid framework** that fuses URL heuristics, content-semantic, and reputation-based signals through a weighted fusion layer, aiming to:
1. Improve detection accuracy over any single-method baseline.
2. Reduce false negatives on zero-hour phishing (URLs not yet blacklisted).
3. Provide an interpretable, deployable, real-time system.

### 1.4 Objectives
- Design a rule-based URL heuristic scorer for fast, lightweight analysis (Module A).
- Train content/NLP classifiers for live webpage analysis (Module B).
- Integrate real-time reputation intelligence (URLhaus, VirusTotal) (Module C).
- Design a weighted fusion layer to combine module outputs with graceful degradation.
- Deploy the system as a usable web application.

---

## 2. Related Work
## 2.1 Detection Approaches — Category-Level Comparison

| Approach | Representative Method | Strength | Limitation |
|---|---|---|---|
| URL lexical/statistical features | Random Forest / XGBoost on hand-engineered URL features | Fast, lightweight, no page load required | Misses content-level impersonation |
| Content-based detection | TF-IDF / DOM structure / visual similarity | Detects brand impersonation, fake login forms | Requires live page fetch; slower |
| Deep learning on URLs | Character-level CNN/LSTM on raw URL strings | No manual feature engineering | Requires larger data, less interpretable |
| Blacklist/reputation systems | URLhaus, VirusTotal, Google Safe Browsing | High precision on known threats | High latency in flagging new ("zero-hour") phishing |
| Hybrid/ensemble systems | Combining 2+ of the above | Higher robustness, reduced single-point failure | Increased system complexity |



**Research Gap:** Few systems combine all three signal types (URL heuristics + content/NLP + reputation) with graceful degradation and known-legitimate domain handling — this is the gap this project addresses.

## 2.2 Comparison with Prior Papers (2020–2026)
Phishing detection research over the past six years (2020–2026) has moved through three broad waves: (1) classical and hybrid ensemble ML on URL/lexical features, (2) deep learning on content and structural page features (CNNs, RNNs, transformers), and (3) graph-based and multi-modal hybrids that combine URL structure with HTML/hyperlink context. The table below positions this project's three-signal (URL + content + reputation) fusion approach against representative published work from each wave — full references are listed in Appendix C.
| Year | Study | Signal(s) Used | Core Method | Reported Result | Gap vs. This Framework |
|---|---|---|---|---|---|
| 2021 | Indrasiri et al. | URL (lexical/statistical) | Expandable Random Gradient Stacked Voting Classifier (ERG-SVC) ensemble | Robust, high-accuracy prediction with low error rate on URL feature sets | URL-only ensemble; no live content or reputation signal, no real-time page fetch |
| 2022 | Kalabarige et al. | URL (lexical/statistical) | Multilayer stacked ensemble learning | High detection accuracy on benchmark URL feature datasets | URL-only; single-signal stacking, no fusion with content or reputation modules |
| 2021 | Mourtaji et al. | URL | Hybrid rule-based scoring + CNN | Reported strong detection on curated URL sets | Combines a rule layer with a model, similar in spirit to this project's fusion, but stays URL-only — no content or threat-intel confirmation |
| 2022 | Bilot et al. (PhishGNN) | URL + hyperlink graph structure | Graph Neural Network (GCN/ClusterGCN variants) | ~99.7% accuracy on a custom PhishTank/Tranco-derived dataset | State-of-the-art accuracy but requires crawling a site's link graph — heavier, less interpretable, and still has no external reputation check |
| 2022 | Ariyadasa et al. | URL + HTML | Long-term Recurrent Convolutional Network + Graph Convolutional Network | Evaluated on tens of thousands of pages | Two-signal deep hybrid; no rule-based fast path and no reputation-feed fusion |
| 2022 | Elsadig et al. | Content (page/URL text) | BERT-based deep learning | Reported strong precision on phishing text classification | Content-only; misses reputation/zero-hour blacklist confirmation and lightweight URL pre-screening |
| 2024 | Opara et al. | Raw URL + HTML | Deep hybrid model | Reported improved robustness over URL-only baselines | Two-signal only; no fusion with external threat intelligence, no known-domain override |
| 2024 | Agagu et al. | URL | Hybrid ensemble ML | Benchmarked on labeled URL datasets | URL-only, no content or reputation module |
| 2024 | Sahingoz et al. (DEPHIDES) | Content/sequence (page & URL text) | Deep learning comparison (CNN, RNN, attention networks) | 98.74% accuracy with the CNN variant | Content/sequence-only; heavier training/inference cost than a TF-IDF + linear model pipeline, no reputation-feed fusion |
| 2025 | Lightweight hybrid MLP framework | Structural URL features | MLP tuned for real-time inference | Optimized for low-latency, real-time scoring | URL-only; trades signal breadth for speed, with no content or reputation fusion |
 
**Where this project sits:** A large-scale survey covering more than 130 phishing-detection studies published between 2020 and 2024 found that most work concentrates on URL-only or URL+HTML hybrids, with comprehensive treatment of reputation/threat-intelligence fusion still uncommon. Consistent with that observation, nearly every table entry above uses at most **two** signal types (a model plus, at best, one other feature source), and none of them combine a rule-based fast path, a trained content classifier, *and* a live reputation feed in one pipeline. This project's fusion layer differs in three concrete ways:
 
1. **Three independent signal families** (URL heuristics, content/NLP, reputation APIs) rather than one or two, so a weakness in one module (e.g., a page that fails to load) doesn't stall the whole verdict.
2. **Graceful degradation with reweighting** — most hybrid/ensemble papers above assume all features are always available at inference time; this framework explicitly reweights toward the surviving modules when a module is unreachable.
3. **A known-legitimate domain override** to correct for content-model false positives on minimalist legitimate pages — a practical deployment concern (evaluation sets in prior work) that is rarely addressed in benchmark-only studies.

The trade-off is that this project favors an interpretable, low-latency rule layer (Module A) and a lightweight TF-IDF/linear-model layer (Module B) over the heavier GNN/transformer architectures used in some 2022–2024 work (e.g., PhishGNN, BERT-based classifiers) — prioritizing explainability and real-time deployability over squeezing out the last fraction of a percentage point of accuracy.

---

## 3. Proposed Framework

### 3.1 System Architecture

```
                    ┌───────────────────────┐
   User submits →   │   Flask Web App       │
   URL (with        │   (app.py)            │
protocol dropdown)  └───────────┬───────────┘
                                │
               ┌────────────────┼─────────────────┐
               ▼                ▼                 ▼
      ┌─────────────────┐ ┌──────────────┐ ┌───────────────────┐
      │ Module A        │ │ Module B     │ │ Module C          │
      │ URL Heuristic   │ │ Content/NLP  │ │ Reputation Check  │
      │ Risk Scorer     │ │ Model        │ │ (URLhaus,         │
      │ (Rule-based,    │ │ (TF-IDF +    │ │  VirusTotal)      │
      │  no ML)         │ │  LR + SVM)   │ │                   │
      └────────┬────────┘ └──────┬───────┘ └────────┬──────────┘
               │                 │                  │
               └────────┬────────┴──────────────────┘
                        ▼
               ┌──────────────────────┐
               │  Fusion Layer        │
               │  (Weighted Voting:   │
               │   A=5%, B=60%, C=35%)│
               │  + known domain check│
               └──────────┬───────────┘
                          ▼
               Final Verdict + Confidence Score
```

### Module A — URL Heuristic Risk Scorer
Role in the pipeline: first-pass, zero-latency screen. Runs on the raw URL string alone, before any network call is made, so it always returns a result even if the target page never loads or every external API is down.
Inputs: the raw URL string only (scheme, host, path, query).
Processing: 12 independent rule checks (HTTPS presence, IP-as-domain, subdomain count, suspicious TLD, URL length, special-character ratio, @-symbol confusion, non-standard port, known shortener domains, login/brand keywords, phishing bait keywords, excessive percent-encoding), each contributing a fixed weight toward a 0–1 risk score.
Output: a deterministic risk score (0–1) plus the list of individual checks that fired, which is what makes the module's contribution explainable to the end user.
Why it's weighted lowest (5%) in normal fusion: URL structure alone is easy for attackers to sanitize (a clean-looking URL can still host a phishing page), so it is treated as a fast corroborating signal rather than the primary decision-maker — except in the degraded-mode formula below, where it becomes the dominant signal.

### Module B — Content-Based NLP Classifier
Role in the pipeline: the primary decision-maker (60% fusion weight), because page content is what actually reveals brand impersonation and credential-harvesting intent.
Inputs: live-fetched HTML — visible text, form actions, iframe usage, password-field presence, favicon domain, and title/brand-domain match.
Processing: visible page text is vectorized with TF-IDF; this is combined with 10 hand-engineered structural/DOM features (num_forms, has_password_field, num_iframes, num_scripts, num_links, external_form_action, title_brand_mismatch, favicon_mismatch, has_meta_refresh, right_click_disabled). Two models — Logistic Regression and Linear SVM — are trained on this representation and their outputs are averaged into an ensemble score.
Output: a phishing-probability score plus the specific structural flags that were triggered (e.g., "external form action" or "title/domain mismatch"), again for explainability.
Operational note: because this module requires a live page fetch, it is the slowest and least reliable of the three (pages can be offline, geo-blocked, or timeout) — page fetches are parallelized with a ThreadPoolExecutor (10 workers) to keep latency reasonable, and the fusion layer has an explicit fallback for when this module can't return a result.

### Module C — Reputation-Based Verification
Role in the pipeline: a high-precision confirmation signal (35% fusion weight) that catches known-bad infrastructure the other two modules might miss, and is the only module that can catch a threat purely from external intelligence rather than the URL/content of a single request.
Inputs: the normalized URL, checked against two external threat-intelligence feeds — URLhaus (malware/phishing match via an Auth-Key header) and VirusTotal (multi-engine scan results via a base64-encoded URL lookup).
Processing: each source returns a binary flag; if either source flags the URL it is marked phishing, and an all-clean result from both returns 0.0.
Output: a binary reputation flag (or "no signal" if both APIs are unreachable).
Trade-off: highest precision on already-catalogued threats, but blind to brand-new ("zero-hour") phishing domains that haven't been reported yet — which is precisely why it is not weighted higher than Module B.

### 3.2 Design Principles
- **Graceful degradation:** If Module C (external API) or Module B (page fetch) is unreachable, the system still returns a verdict using available modules with adjusted weights.
- **Explainability:** Each module's contribution and flagged signals are surfaced to the user, not just a binary verdict.
- **Known-legitimate override:** Well-known domains (Google, GitHub, Amazon, etc.) are hard-coded to prevent false positives from Module B's content model on minimalist pages.
- **Protocol-aware:** Users select https:// or http:// via a dropdown — the system defaults to https:// and validates that a protocol is always present.
 ```mermaid
flowchart TD
    A[User submits URL + protocol] --> B[Module A: URL Heuristic Score]
    B --> C{Module A score < 0.15\nAND domain in known-legit list?}
    C -->|Yes| D[Verdict: LEGITIMATE\noverride, skip Module B/C]
    C -->|No| E[Fetch live page for Module B]
    E --> F{Page fetch succeeded?}
    F -->|Yes| G[Module B: Content/NLP Score]
    F -->|No| H[Module B unavailable\nfallback formula]
    G --> I[Query Module C: URLhaus + VirusTotal]
    H --> J{Module C reachable?}
    I --> K{Module C reachable?}
    K -->|Yes| L[Fuse A=5% / B=60% / C=35%]
    K -->|No| M[Fuse A=5% / B=95%\nneutral C=0.5]
    J -->|Yes, A >= 0.35| N[Fuse A=85% / C=15%]
    J -->|Yes, A < 0.35| O[Fuse A=15% / C=85%\nweighted toward reputation]
    J -->|No| P[Insufficient signal\nreturn Module A score only]
    L --> Q{Final score}
    M --> Q
    N --> Q
    O --> Q
    Q -->|>= 0.6| R[PHISHING]
    Q -->|0.35 - 0.6| S[SUSPICIOUS]
    Q -->|< 0.35| T[LEGITIMATE]
    D --> U[Return verdict + confidence + per-module breakdown]
    R --> U
    S --> U
    T --> U
    P --> U
```

---

## 4. Methodology

### 4.1 Datasets

| Dataset | Role | Size | Notes |
|---|---|---|---|
| **urls_labeled.csv** | Module B training | 2,000 URLs | 1,000 phishing + 1,000 legitimate (url, label format) |

**Data split strategy:**
1. **Module B training:** Content features extracted from live-scraped HTML of URLs in `urls_labeled.csv`. Models (Logistic Regression + Linear SVM) trained on TF-IDF text features + 10 structural DOM features.
2. **Module A:** No training required — rule-based heuristics with fixed scoring weights.

### 4.2 Module A — URL Heuristic Risk Scorer (Rule-Based)
- **Input:** Raw URL string only — no page fetch, no ML model.
- **Method:** Rule-based scoring across 12 checks, each contributing a fixed weight to a final 0–1 risk score:
  - HTTPS presence (+0.10)
  - IP address as domain — private IPs score higher (+0.35)
  - Excessive subdomains — 3+ subdomains (+0.15)
  - Suspicious TLD (.xyz, .tk, .top, etc.) (+0.08)
  - URL length >100 characters (+0.10)
  - Special character ratio >0.35 (+0.12)
  - @ symbol in URL — confusion attack (+0.20)
  - Non-standard port (+0.10)
  - URL shortener domain (+0.15)
  - Login/brand keywords in domain (+0.15)
  - Phishing bait keywords in URL (+0.30)
  - Excessive % encoding (+0.12)
- **Rationale:** ML models trained on pre-extracted PhiUSIIL features cannot reliably replicate feature distributions for single live URLs. A transparent heuristic provides consistent, interpretable results without training data dependency.

### 4.3 Module B — Content-Based NLP Classification
- **Input:** Live-fetched HTML — visible text, form actions, iframe usage, password field presence, favicon domain, title/brand-domain mismatch.
- **Text representation:** TF-IDF vectorization of visible page text.
- **Model:** Logistic Regression + Linear SVM (ensemble average).
- **Structural features:** 10 DOM-level features (num_forms, has_password_field, num_iframes, num_scripts, num_links, external_form_action, title_brand_mismatch, favicon_mismatch, has_meta_refresh, right_click_disabled).
- **Concurrency:** ThreadPoolExecutor with 10 workers for parallel page fetching.

### 4.4 Module C — Reputation-Based Verification
- **Signals:** URLhaus API (malware/phishing match via Auth-Key header), VirusTotal API (multi-engine scan results via base64-encoded URL).
- **Output:** Binary flag per source — if any source flags the URL, it's marked as phishing; all-clean returns 0.0. Degrades gracefully to "no signal" if APIs are unreachable.

### 4.5 Fusion / Ensemble Layer
- **Method:** Weighted voting with fixed weights — Module A (5%), Module B (60%), Module C (35%).
- **Unavailable module handling:** When a module is unavailable (page unreachable, API down), it contributes a neutral 0.5 score. When Module B is unavailable, the fusion switches to a two-module formula favoring Module A's URL heuristics if it flags risk (A ≥ 0.35 → 85% A, 15% C).
- **Known legitimate domain override:** If the domain is in a hardcoded list of known legitimate sites (Google, GitHub, Amazon, etc.) and Module A score is low (< 0.15), the verdict is forced to LEGITIMATE — preventing Module B's false positives on minimalist pages (e.g., Google's homepage).
- **Thresholds:** Final score ≥ 0.6 → PHISHING, ≥ 0.35 → SUSPICIOUS, else LEGITIMATE.

### 4.6 Evaluation Metrics
- Accuracy, Precision, Recall, F1-score, ROC-AUC (per module and for the full ensemble).
- **Ablation study:** Performance of A-only, B-only, C-only, and full ensemble — isolating the contribution of each module.
- **Known-domain evaluation:** Testing against well-known legitimate sites to verify the override prevents false positives.

---

## 5. Implementation Details

### 5.1 Technology Stack
| Layer | Technology |
|---|---|
| Language | Python 3.9+ |
| ML/Modeling | scikit-learn (Logistic Regression, Linear SVM) |
| NLP | scikit-learn (TF-IDF) |
| Web Scraping | BeautifulSoup, requests, concurrent.futures (ThreadPoolExecutor) |
| Domain Intelligence | tldextract |
| Backend | Flask |
| Frontend | HTML/CSS/JS (Inter + JetBrains Mono fonts, light/dark theme) |
| Secrets | python-dotenv (.env file) |

### 5.2 Repository Structure
```
AI-Powered Phishing Website Detection and Prevention Framework/
├── app.py                          # Flask application (routes, fusion, Module B/C integration)
├── models_db.py                    # SQLAlchemy models: ScanHistory, Feedback (SQLite)
├── moduleA.py                      # Module A: URL heuristic risk scorer (rule-based, no ML)
├── moduleB.py                      # Module B: Content/NLP classifier training + evaluation
├── moduleC.py                      # Module C: Reputation checks (URLhaus, VirusTotal)
├── ContentExtraction.py            # HTML fetching, structural features, TF-IDF text extraction
├── Datasets/
│   └── urls_labeled.csv            # Labeled URLs for Module B training
├── models/                         # Saved .pkl models (module_b_*)
├── outputs/                        # Training metrics and plots (confusion matrices, ROC, top terms)
├── templates/
│   └── index.html                  # Legacy server-rendered UI (dark/light theme, protocol dropdown)
├── frontend/                       # React + Vite SPA (primary UI)
│   ├── src/
│   │   ├── App.jsx                 # Router shell
│   │   ├── pages/
│   │   │   ├── Home.jsx            # URL submission + verdict view
│   │   │   ├── Dashboard.jsx       # Stats/trend charts (recharts)
│   │   │   └── HistoryPage.jsx     # Paginated scan history
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile                  # Multi-stage build → served via Nginx
├── Dockerfile                      # Backend image (gunicorn)
├── docker-compose.yml              # Two-service stack: backend (5000) + frontend (80)
├── database.db                     # SQLite DB (auto-created by Flask on first run)
├── .env                            # API keys (URLHAUS_API_KEY, VT_API_KEY)
├── .gitignore
├── requirements.txt
└── README.md
```
 

### 5.3 Setup Instructions
```bash
git clone <repo-url>
cd "AI-Powered Phishing Website Detection and Prevention Framework"
python3 -m venv phishenv
source phishenv/bin/activate      # Windows: phishenv\Scripts\activate
pip install -r requirements.txt
```

### 5.4 API Keys
Create a `.env` file in the project root with the following keys:

| Variable | Service | Where to get it |
|---|---|---|
| `URLHAUS_API_KEY` | URLhaus (abuse.ch) | Sign up at https://urlhaus.abuse.ch/api/ — free Auth-Key |
| `VT_API_KEY` | VirusTotal | Get a free API key at https://www.virustotal.com/ |

Example `.env`:
```
URLHAUS_API_KEY=your_urlhaus_auth_key
VT_API_KEY=your_virustotal_api_key
```

### 5.5 Running the Pipeline
```bash
# 1. Run the web app (loads Module B models + starts Flask)
python3 app.py

# The app starts on http://localhost:5000
# Enter a URL in the UI, select https:// or http://, and click Analyze URL
```

---

## 6. Results

### 6.1 Module B — Content/NLP Classifier Performance

*Trained on `urls_labeled.csv` (2,000 URLs), evaluated on 20% held-out test set (286 samples).*

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|
| **Linear SVM** | **90.2%** | **87.5%** | **91.5%** | **89.5%** | **96.8%** |
| Logistic Regression | 89.2% | 85.6% | 91.5% | 88.5% | 96.9% |

**Per-class breakdown (Linear SVM):**

| Class | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| Phishing | 93% | 89% | 91% | 156 |
| Legitimate | 88% | 92% | 89% | 130 |

### 6.2 Module A — URL Heuristic Risk Scorer

*Rule-based scorer — no training required. Scoring is deterministic based on 12 URL checks (HTTPS, IP-as-domain, subdomains, TLD, URL length, special characters, @ symbol, port, shorteners, keywords, bait words, % encoding).*

### 6.3 Module C — Reputation API Check

*Binary flag from URLhaus + VirusTotal. High precision on known threats; degrades gracefully when APIs are unreachable.*

### 6.4 Fusion Layer

*Weighted voting: A=5%, B=60%, C=35%. Includes known-legitimate domain override and unavailable-module fallback logic.*

### 6.5 Ablation Study Discussion
Module B (content/NLP) carries the most weight (60%) and achieves 90% accuracy with strong ROC-AUC (96.8%), making it the primary detection signal. Module A (URL heuristics) provides fast, lightweight risk scoring without page fetch. Module C (reputation) adds high-precision confirmation from threat intelligence feeds. The fusion layer gracefully handles module unavailability and prevents false positives on known legitimate domains.

---

## 7. Deployment

- **Backend:** Flask REST endpoint (`POST /analyze`) accepting a URL and returning verdict + confidence + per-module breakdown.
- **Frontend:** Single-page UI with protocol dropdown (https/http), dark/light theme toggle, and real-time status feed during analysis.
- **Running locally:** `python3 app.py` starts the server on `http://localhost:5000`.

### UI Screenshots

| Legitimate Website Analysis | Phishing Website Analysis |
| :---: | :---: |
|<img width="1222" height="641" alt="image" src="https://github.com/user-attachments/assets/9952e7ba-da9f-421a-8d79-8b2cfe50c5eb" />| <img width="1326" height="676" alt="image" src="https://github.com/user-attachments/assets/ac94983a-166a-48cf-a56f-3362d03aceb3" />|

---

## 8. Conclusion and Future Work

This framework demonstrates that combining URL-based heuristics, content-based NLP, and reputation-based signals through weighted fusion provides robust phishing detection with graceful degradation. The rule-based Module A ensures consistent URL analysis without ML model dependency, while the known-legitimate domain override prevents false positives on minimalist legitimate pages. The system handles edge cases including unreachable pages, unavailable APIs, and protocol-aware URL normalization.

**Future Work:**
- Replace TF-IDF with transformer-based (DistilBERT) content embeddings for improved brand-impersonation detection.
- Incorporate visual/screenshot-based similarity detection (e.g., perceptual hashing against known brand login pages).
- Continuously retrain Module B on rolling PhishTank/OpenPhish feeds to address concept drift.
- Add PhishTank reputation check when API registration becomes available again.

---

## Appendix

### A. Dataset Sources
- PhishTank — https://www.phishtank.com (used to build urls_labeled.csv)
- Tranco List — https://tranco-list.eu (used to build urls_labeled.csv)

### B. API Keys Required
- URLhaus API Auth-Key — https://urlhaus.abuse.ch/api/
- VirusTotal API Key — https://www.virustotal.com/
