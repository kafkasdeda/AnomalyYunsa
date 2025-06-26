# 📋 AnomalyYunsa - Task Management

## 🚀 SPRINT 0.5 - Foundation Setup (26 Haziran - 3 Temmuz)

### ⚡ HIGH PRIORITY

#### 🏗️ **T001: Monorepo Infrastructure**
- [ ] **T001a:** pnpm workspace kurulumu
  - `package.json` (root) oluştur
  - `turbo.json` konfigürasyonu
  - Scripts: `dev:back`, `dev:front`, `build`, `test`
- [ ] **T001b:** Directory structure oluştur
  ```
  C:\projeler\AnomalyYunsa\
  ├── package.json
  ├── turbo.json  
  ├── backend/
  ├── frontend/
  ├── shared/
  ├── docs/
  └── scripts/
  ```
- [ ] **T001c:** Git repository initialize
  - `.gitignore` (Node.js + Python)
  - Initial commit

**Tahmini süre:** 2 saat  
**Öncelik:** 🔴 Critical  
**Assigned:** -

---

#### ⚙️ **T002: Backend Foundation**
- [ ] **T002a:** Python environment setup
  - `requirements.txt` oluştur
  - Virtual environment kurulumu
  - FastAPI + PyTorch + OpenCV kurulumu
- [ ] **T002b:** Project structure
  ```
  backend/
  ├── main.py
  ├── routes/
  ├── services/
  ├── models/
  ├── utils/
  ├── adapters/
  └── tests/
  ```
- [ ] **T002c:** Config system
  - `utils/config.py` → BaseSettings
  - `.env.example` template
  - Development/Production mode switching

**Tahmini süre:** 3 saat  
**Öncelik:** 🔴 Critical  
**Assigned:** -

---

#### 🎨 **T003: Frontend Foundation**
- [ ] **T003a:** React + TypeScript setup
  - Vite project initialization
  - Konva.js + Three.js dependency kurulumu
  - TypeScript configuration
- [ ] **T003b:** Project structure
  ```
  frontend/src/
  ├── pages/
  ├── components/
  ├── services/
  ├── hooks/
  ├── types/
  └── utils/
  ```
- [ ] **T003c:** Basic routing
  - React Router setup
  - Page placeholders

**Tahmini süre:** 2 saat  
**Öncelik:** 🔴 Critical  
**Assigned:** -

---

### 🎯 MEDIUM PRIORITY

#### 🔗 **T004: Type Safety Pipeline**
- [ ] **T004a:** OpenAPI schema setup
  - FastAPI automatic schema generation
  - Swagger UI configuration
- [ ] **T004b:** TypeScript autogen
  - `openapi-typescript` kurulumu
  - Build script integration
  - `shared/types/` structure

**Tahmini süre:** 2 saat  
**Öncelik:** 🟡 Medium  
**Assigned:** -

---

#### 🧪 **T005: Testing Foundation**
- [ ] **T005a:** Backend testing
  - `pytest` setup
  - `conftest.py` fixtures
  - Basic adapter tests
- [ ] **T005b:** Frontend testing  
  - React Testing Library setup
  - Component test examples

**Tahmini süre:** 1.5 saat  
**Öncelik:** 🟡 Medium  
**Assigned:** -

---

## 🚀 SPRINT 1 - Pattern Editor (3-10 Temmuz)

### ⚡ HIGH PRIORITY

#### 🎨 **T101: Pattern Design Canvas**
- [ ] **T101a:** Konva.js canvas setup
  - Variable canvas size (cm-based)
  - Grid system + snap functionality
  - Basic drawing tools (brush, shapes)
- [ ] **T101b:** Seamless pattern preview
  - Tile preview window
  - Seamless edge detection
  - Pattern repeat visualization

**Tahmini süre:** 6 saat  
**Öncelik:** 🔴 Critical

---

#### 🔄 **T102: Fabric Tessellation Engine**
- [ ] **T102a:** Backend pattern generator
  - `services/fabric_generator.py`
  - Tile → 150m×1.5m tessellation
  - Memory-efficient patch generation
- [ ] **T102b:** Pattern API endpoints
  - POST `/api/fabric/generate-pattern`
  - GET `/api/fabric/pattern/{id}`
  - Pattern metadata storage

**Tahmini süre:** 8 saat  
**Öncelik:** 🔴 Critical

---

#### 🌐 **T103: WebSocket Foundation**
- [ ] **T103a:** Basic WebSocket connection
  - Backend WebSocket handler
  - Frontend WebSocket client
  - Connection status management
- [ ] **T103b:** Message protocol
  - JSON message structure
  - Binary data handling (PNG patches)
  - Error handling & reconnection

**Tahmini süre:** 4 saat  
**Öncelik:** 🔴 Critical

---

## 📋 BACKLOG - Future Sprints

### Sprint 2: Texture Streaming
- **T201:** Ring buffer implementation
- **T202:** GPU texture management  
- **T203:** 3D fabric viewer (Three.js)

### Sprint 3: Defect Injection
- **T301:** JSON-based defect definition
- **T302:** Defect placement UI
- **T303:** Defect rendering system

### Sprint 4: Virtual Conveyor
- **T401:** Conveyor physics simulation
- **T402:** Camera FOV simulation
- **T403:** Speed control interface

### Sprint 5: AI Detection
- **T501:** PatchCore implementation
- **T502:** Teach-in controller
- **T503:** Real-time anomaly detection

### Sprint 6: Learning System  
- **T601:** Operator feedback UI
- **T602:** FAISS vector storage
- **T603:** Adaptive threshold learning

### Sprint 7: Optimization
- **T701:** Performance profiling
- **T702:** Memory optimization
- **T703:** KPI dashboard

---

## 📊 Task Templates

### 🏷️ Task Labeling System
- **🔴 Critical:** Blocking other tasks
- **🟡 Medium:** Important but not blocking  
- **🟢 Low:** Nice to have
- **🔵 Research:** Investigation needed
- **⚫ Technical Debt:** Refactoring/cleanup

### 📈 Task Status
- **📋 Todo:** Not started
- **🔄 In Progress:** Currently working
- **🔍 Review:** Needs testing/review
- **✅ Done:** Completed
- **❌ Blocked:** Cannot proceed
- **⏸️ Paused:** Temporarily stopped

### ⏱️ Time Estimates
- **XS:** < 1 hour
- **S:** 1-2 hours  
- **M:** 2-4 hours
- **L:** 4-8 hours
- **XL:** 8+ hours (break down further)

---

## 🎯 Current Sprint Focus

**Sprint 0.5 Completion Criteria:**
1. ✅ Monorepo successfully building
2. ✅ Backend serving on localhost:8000
3. ✅ Frontend serving on localhost:3000  
4. ✅ Basic WebSocket connection working
5. ✅ OpenAPI → TypeScript pipeline functional

**Definition of Done:**
- [ ] Code works on fresh clone
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No broken dependencies

---

*Last updated: 26 Haziran 2025*