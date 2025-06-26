# 🎯 AnomalyYunsa - Fabric Quality Control System

## 📊 Proje Durumu (Project Status)

**Proje Başlangıç:** 26 Haziran 2025  
**Mevcut Aşama:** Sprint 1 - Pattern Editor Development  
**Hedef Süre:** 7 hafta (Sprint-based development)  
**Mod:** Simulation-First → Production Ready

---

## 🎨 Proje Vizyonu

**150m x 1.5m kumaş rulolarında gerçek zamanlı anomali tespiti:**
- 🧠 AI-powered öğrenen sistem
- 🎮 Tamamen sanal geliştirme ortamı
- 🔄 Gerçek sisteme sorunsuz geçiş
- 👤 Kullanıcı tanımlı pattern/defect taxonomy
- 📚 Adaptive learning with operator feedback

---

## ⚙️ Teknoloji Stack

### Backend
- **Framework:** Python FastAPI
- **ML Engine:** PyTorch + PatchCore algoritması  
- **Computer Vision:** OpenCV, NumPy
- **Vector Search:** FAISS
- **Communication:** WebSocket (real-time)

### Frontend  
- **Framework:** React + TypeScript + Vite
- **2D Graphics:** Konva.js (pattern editor)
- **3D Visualization:** Three.js (fabric viewer)
- **State Management:** Zustand (planned)

### Infrastructure
- **Monorepo:** pnpm + Turbo
- **Config Management:** Pydantic BaseSettings + .env
- **Type Safety:** OpenAPI → TypeScript autogen
- **Testing:** pytest + React Testing Library

---

## 🏗️ Sistem Mimarisi

```
┌─────────── UI LAYER ──────────────┐
│ PatternEditor │ LiveViewer │ UI   │
├─────────── BUSINESS LOGIC ────────┤  
│ AnomalyEngine │ LearningSystem    │
├─────────── ABSTRACTION LAYER ─────┤
│ IFrameSource │ IConveyor │ IPLC   │
├─────────── DRIVER LAYER ──────────┤
│ SimDriver ←→ HardwareDriver       │
└───────────────────────────────────┘
```

---

## 📈 Sprint Roadmap

| Hafta | Hedef | Durum | Çıktı |
|-------|-------|-------|-------|
| 0.5 | Foundation Setup | ✅ **COMPLETED** | Monorepo + Full-stack connection |
| 1 | Pattern Editor | 🟡 **CURRENT** | Desen çizim + tessellation |
| 2 | Texture Streaming | ⏳ Planned | 150m → 3m ring buffer |
| 3 | Defect Injection | ⏳ Planned | JSON-based hata sistemi |
| 4 | Virtual Conveyor | ⏳ Planned | FOV capture + patch queue |
| 5 | AI Detection | ⏳ Planned | PatchCore + threshold |
| 6 | Learning System | ⏳ Planned | Operator feedback + FAISS |
| 7 | Optimization | ⏳ Planned | Performance + KPIs |

---

## 🎯 Mevcut Sprint (Hafta 1)

### ✅ Sprint 0.5 Tamamlanan
- [x] Teknik tasarım dokümanı
- [x] Modular architecture planı
- [x] Technology stack seçimi
- [x] Monorepo kurulumu (npm workspaces + Turbo)
- [x] Backend FastAPI + Python environment
- [x] Frontend React + TypeScript + Vite
- [x] Full-stack connection test
- [x] ProjectInstructions.md oluşturuldu

### ✅ Sprint 1 Phase 1 COMPLETED - Core Canvas Foundation
- [x] **T101a:** Konva.js Canvas Foundation (4h) ✅ **COMPLETED**
  - [x] Basic drawing canvas with grid system ✅
  - [x] Mouse drawing with black brush ✅
  - [x] Pattern state management (useCanvas hook) ✅
  - [x] Type safety with TypeScript ✅
  - [x] Live testing successful ✅

### 🔄 Sprint 1 Phase 2 CURRENT - Manual Tools
- [ ] **T101b:** Tool Palette & Advanced Controls (3-4h) 🔄 **NEXT**
  - [ ] Tool selection UI (brush, rectangle, circle, eraser)
  - [ ] Controls → useCanvas hook integration
  - [ ] Advanced brush settings
  - [ ] Shape drawing tools
- [ ] **T101c:** Image import system (3-4h)
- [ ] **T101d:** Seamless pattern preview (2h)
- [ ] **T102:** Pattern tessellation engine (8h)
- [ ] **T103:** WebSocket foundation (4h)

### 🎯 Bu Sprint Hedefleri - UPDATED STATUS
1. ✅ **Core Canvas Foundation:** Konva.js integration ✅ COMPLETE
2. ✅ **Basic Drawing:** Mouse drawing with brush ✅ COMPLETE
3. ✅ **Grid System:** Always-on professional grid ✅ COMPLETE
4. 🔄 **Tool Palette:** Advanced tool selection (Phase 2)
5. 🔄 **Manual Tools:** Rectangle, circle, eraser tools
6. ⏳ **Image Import:** Dual pattern creation system
7. ⏳ **Seamless Preview:** 2×2 tile tekrar gösterimi
8. ⏳ **Tessellation Engine:** JSON → 150m kumaş üretimi
9. ⏳ **WebSocket:** Real-time pattern sync

---

## 🚀 Teknik Innovations

### 🧠 Smart Optimizations
- **Procedural Generation:** 45GB → 50MB (900x hafıza tasarrufu)
- **Adaptive Thresholds:** Pattern-aware anomaly detection
- **Zero-Assumption Start:** Boş taxonomy, runtime learning
- **Hierarchical Defect Groups:** Visual clutter çözümü

### 🔄 Sim-to-Real Strategy
- **API Abstraction:** Driver-level değişim, üst katman korunur
- **Config-Driven Mode:** `MODE=simulation|production`
- **Identical Algorithms:** Aynı ML pipeline her iki modda

---

## 📋 Kritik Kararlar

### ✅ Onaylanmış
- Simulation-first development yaklaşımı
- User-defined taxonomy (runtime pattern/defect creation)
- **Dual pattern creation:** Manual drawing + Image import
- **Unified JSON format:** Both methods → same backend
- Modular, test-driven architecture (17 files, size-compliant)
- Monorepo structure with shared types

### ❓ Açık Sorular
- Tile size: 256px vs 512px? (Context-dependent)
- Blend operations: CPU vs GPU shader?
- Small defect threshold: <5mm detection level?

---

## 📞 İletişim & Dokümantasyon

**Proje Sahibi:** Kullanıcı  
**Teknik Danışman:** Claude (Anthropic)  
**Session Notları:** `SESSION*.md` dosyalarında  
**Teknik Detaylar:** `docs/` klasöründe  

---

*Son güncelleme: 26 Haziran 2025 - Dual Pattern Creation update*