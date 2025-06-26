# 🎯 AnomalyYunsa - Fabric Quality Control System

## 📊 Proje Durumu (Project Status)

**Proje Başlangıç:** 26 Haziran 2025  
**Mevcut Aşama:** Planning & Architecture Design  
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
| 0.5 | Foundation Setup | 🟡 **CURRENT** | Monorepo + Config |
| 1 | Pattern Editor | ⏳ Planned | Desen çizim + tessellation |
| 2 | Texture Streaming | ⏳ Planned | 150m → 3m ring buffer |
| 3 | Defect Injection | ⏳ Planned | JSON-based hata sistemi |
| 4 | Virtual Conveyor | ⏳ Planned | FOV capture + patch queue |
| 5 | AI Detection | ⏳ Planned | PatchCore + threshold |
| 6 | Learning System | ⏳ Planned | Operator feedback + FAISS |
| 7 | Optimization | ⏳ Planned | Performance + KPIs |

---

## 🎯 Mevcut Sprint (Hafta 0.5)

### ✅ Tamamlanan
- [x] Teknik tasarım dokümanı
- [x] Modular architecture planı
- [x] Technology stack seçimi
- [x] Sprint roadmap oluşturma

### 🔄 Devam Eden
- [ ] Monorepo kurulumu (pnpm + Turbo)
- [ ] Backend iskelet yapısı
- [ ] Frontend iskelet yapısı
- [ ] Environment configuration

### 🎯 Bu Sprint Hedefleri
1. **Monorepo Setup:** Unified development environment
2. **Config Foundation:** .env + BaseSettings
3. **Basic Structure:** Klasör yapısı + boilerplate
4. **Type Generation:** OpenAPI → TypeScript pipeline

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
- Modular, test-driven architecture
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

*Son güncelleme: 26 Haziran 2025*