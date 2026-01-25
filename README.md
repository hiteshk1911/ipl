# IPL Analytics

A professional-grade ball-by-ball cricket analytics platform built on IPL data.

This project ingests raw IPL JSON match files, normalizes them into a relational event model, and produces **explainable, coach-level cricket insights** such as batter profiles, dismissal weaknesses, matchup analysis, and recent form.

---

## What This Project Does

* Ingests raw IPL JSON data (ball-by-ball)
* Normalizes inconsistent historical schemas
* Stores data in PostgreSQL with strict integrity
* Computes analytics using SQL (not ad-hoc Python)
* Exposes clean, product-ready analytics primitives

This is **not** a fantasy stats project. It is designed for:

* Professional teams
* Analysts
* Coaches
* Cricket boards

---

## Tech Stack

* **Python**: 3.11+
* **Poetry**: Dependency & environment management
* **PostgreSQL**: Primary analytics datastore
* **psycopg2**: DB driver
* **Pydantic v2**: Data validation

---

## Project Structure

```
ipl-analytics/
├── src/
│   └── ipl_analytics/
│       ├── ingestion/        # JSON → Delivery ingestion
│       ├── models/           # Pydantic models
│       ├── db/               # DB connections & inserts
│       └── sql/              # Schema & analytics SQL
├── data/
│   └── ipl_json/             # Raw IPL JSON match files
├── pyproject.toml
└── README.md
```

---

## Prerequisites (From Absolute Scratch – macOS)

These steps assume a **fresh macOS machine** with no developer tools installed.

---

### 1️⃣ Install Homebrew (Package Manager)

Homebrew is required to install system dependencies like Python and PostgreSQL.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installation, ensure Homebrew is on your PATH:

```bash
brew --version
```

---

### 2️⃣ Install Python (3.11+)

```bash
brew install python
python3 --version
```

---

### 3️⃣ Install PostgreSQL

```bash
brew install postgresql@15
```

Start PostgreSQL as a service:

```bash
brew services start postgresql@15
```

Verify:

```bash
psql --version
```

---

### 4️⃣ Install Poetry (Python Dependency Manager)

```bash
pip3 install poetry
poetry --version
```

---

### 5️⃣ Install Git (if not present)

```bash
brew install git
git --version
```

---

## Step-by-Step Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ipl-analytics
```

---

### 2. Install Dependencies

```bash
poetry install
```

Activate the virtual environment:

```bash
poetry run python3
```

---

### 3. Create the Database

Open `psql`:

```bash
psql postgres
```

Create database:

```sql
CREATE DATABASE ipl_analytics;
\q
```

---

### 4. Create Schema

From the project root:

```bash
psql ipl_analytics < src/ipl_analytics/sql/schema.sql
```

Verify:

```bash
psql ipl_analytics
\d
```

You should see:

* players
* matches
* deliveries

---

### 5. Add IPL JSON Data

Place raw IPL JSON files here:

```
data/ipl_json/
```

Each file must be named:

```
<match_id>.json
```

Example:

```
335982.json
```

---

## Data Ingestion

### Ingest One Season (Recommended First Run)

Example: IPL 2008 (`season = "2007/08"`)

```bash
poetry run python3
```

```python
from pathlib import Path
from ipl_analytics.ingestion.ingest_season import ingest_season

ingest_season(
    folder_path=Path("data/ipl_json"),
    season="2007/08"
)
```

Expected results:

* ~58 matches
* ~13,000 deliveries
* ~160 players

---

### Verify Ingestion

```sql
SELECT COUNT(*) FROM matches;
SELECT COUNT(*) FROM deliveries;
SELECT COUNT(*) FROM players;
```

---

## Analytics Layer

### Batter Profile (Core Intelligence)

The canonical analytics surface is:

```sql
analytics.batter_profile
```

Query example:

```sql
SELECT *
FROM analytics.batter_profile
WHERE batter = 'SC Ganguly';
```

This view includes:

* Career summary
* Phase-wise performance
* Dismissal profile

---

## Design Principles (Important)

* **SQL is the source of truth**
* No analytics computed from JSON directly
* All metrics are explainable
* Ingestion is idempotent
* Schema changes are intentional and rare

---

## Common Pitfalls

* ❌ Do not rely on `event.match_number`
* ❌ Do not loosen model validation
* ❌ Do not compute analytics in Python
* ✅ Always normalize data at ingestion

---

## Next Steps

Once setup is complete, you can:

* Add recent-form analysis
* Add venue-adjusted profiles
* Add bowler matchup intelligence
* Materialize analytics views

---

**This project is intentionally built like a professional sports analytics system.**
