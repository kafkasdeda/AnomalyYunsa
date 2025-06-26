# 📝 SESSION01 - Project Foundation & Architecture Design

**Tarih:** 26 Haziran 2025  
**Süre:** ~2 saat  
**Katılımcılar:** Kullanıcı + Claude (Technical Advisor)  
**Amaç:** Proje vizyonu netleştirme & teknik mimari tasarımı

---

## 🎯 Session Özeti

Kumaş kalite kontrol sistemi için **simulation-first approach** ile geliştirme stratejisi belirlendi. Tamamen sanal ortamda test edilebilen, gerçek sisteme sorunsuz geçiş yapabilen modular mimari tasarlandı.

---

## 💡 Ana Kavramlar ve Kararlar

### 🧠 **Proje Vizyonu**
- **150m × 1.5m kumaş rulolarında** gerçek zamanlı anomali tespiti
- **Teach-in aşaması:** İlk 1-3m hatasız bölgeyi referans alma
- **AI + İnsan işbirliği:** Şüpheli durumda operatöre sorma
- **Öğrenen sistem:** Onaylanan anomali türlerini hatırlama

### 🏗️ **Sim-to-Real Strategy**
```
Sanal Ortam (Geliştirme)     →    Gerçek Sistem (Üretim)
├── Kumaş = Three.js texture     →    Kumaş = Fiziksel rulo
├── Konveyör = Math simulation   →    Konveyör = PLC kontrol
├── Kamera = WebGL framebuffer   →    Kamera = Basler line-scan
└── API'lar = Aynı kalıyor ✅    →    API'lar = Aynı kalıyor ✅
```

### ⚡ **Kritik Optimizasyon: Procedural Generation**
**Problem:** 150m × 1.5m kumaş = ~45GB hafıza  
**Çözüm:** Sadece görünen kısmı real-time generate et  
**Sonuç:** 45GB → 50MB (900x hafıza tasarrufu)

```javascript
// ❌ Kötü: Tüm kumaşı hafızaya yükle
const fullFabric = new Uint8Array(150m * 1.5m * DPI²) 

// ✅ İyi: Sadece görünen kısmı üret
generatePatch(position_m, size_px) {
  const basePatch = tilePattern(position_m)
  const defects = defectMap.getDefectsInRange(position_m)
  return blendDefects(basePatch, defects)
}
```

---

## 🔧 Teknoloji Stack Kararları

### **Backend: Python FastAPI**
**Seçim nedenleri:**
- 🧠 ML/AI: PyTorch, OpenCV kolay entegrasyon
- ⚡ FastAPI: Async WebSocket + otomatik API docs
- 🔧 Hardware: PLC/kamera SDK'ları Python-friendly

### **Frontend: React + TypeScript**
**Seçim nedenleri:**
- 🎨 Graphics: Konva.js (2D) + Three.js (3D) mükemmel
- ⚡ Performance: Vite ile hızlı development
- 🔧 Types: Büyük proje için type safety

### **Architecture Patterns**
- **Monorepo:** pnpm + Turbo (unified development)
- **Config Management:** Pydantic BaseSettings + .env
- **Type Safety:** OpenAPI → TypeScript autogen
- **Testing:** pytest + React Testing Library

---

## 🎨 User Experience Design

### **Pattern Creation Flow**
1. Kullanıcı 10×10cm seamless pattern çizer (Konva.js)
2. VEYA hazır pattern yükler (import)
3. Pattern 150m×1.5m kumaşa tessellate edilir
4. JSON ile defect'ler eklenir: `{45.2m: "stain_3cm"}`

### **Anomaly Detection Flow**
1. AI konveyörde akan kumaşı tarar
2. Anomali bulunca **konveyör durur**
3. AI tahmini gösterir: "Çizgili desen + Leke"
4. Kullanıcı: ✅ Doğru / ❌ Yeni tip oluştur
5. **Learning:** AI bir sonraki benzer durumu hatırlar

### **Zero-Assumption Taxonomy**
- **Başlangıçta hiçbir pattern/defect tipi YOK**
- **Runtime'da** kullanıcı yeni tipler oluşturur
- **Hiyerarşik gruplar:** Görsel karmaşayı önler
  ```
  Renk Hataları/
  ├── Leke
  ├── Renk Değişimi  
  └── Soluk Alan
  ```

---

## 🧠 Smart Learning System

### **Adaptive Threshold Learning**
```python
# Başlangıç: Her anomaliyi sor
confidence_matrix["stripe_stain"] = 0.0

# 10 örnek sonrası: %80 doğruluk
confidence_matrix["stripe_stain"] = 0.8

# AI kararı: "Bu konuda iyiyim, artık sormam"
if confidence > 0.9:
    return False  # Don't ask operator
```

### **Context-Aware Detection**
- **Pattern complexity:** Karmaşık desende yüksek threshold
- **Defect history:** Sık görülen hataları daha kolay yakala  
- **Operator feedback:** False positive azaltma

---

## 📁 Project Structure

### **Final Directory Design**
```
C:\projeler\AnomalyYunsa\
├── package.json           # Monorepo root
├── turbo.json            # Build orchestration  
├── backend/
│   ├── routes/           # API endpoints (küçük dosyalar)
│   ├── services/         # Business logic
│   ├── models/           # Pydantic models
│   ├── adapters/         # Sim/Real drivers
│   └── tests/           # Pytest test suite
├── frontend/
│   ├── pages/           # Route components
│   ├── components/      # Reusable UI (atomic design)
│   ├── services/        # API clients, WebSocket
│   ├── hooks/           # React custom hooks
│   └── types/           # TypeScript definitions
├── shared/
│   └── types/           # Cross-platform types
├── docs/
│   ├── api.md          # OpenAPI documentation
│   └── architecture.mermaid # System diagrams
└── scripts/
    ├── generate_test_data.py
    └── benchmark_ml.py
```

---

## 🚀 Sprint Planning

### **Sprint Roadmap (7 hafta)**
| Week | Focus | Deliverable |
|------|-------|-------------|
| 0.5 | Foundation | Monorepo + Basic structure |
| 1 | Pattern Editor | Desen çizimi + tessellation |
| 2 | Texture Streaming | Ring buffer + 3D viewer |
| 3 | Defect Injection | JSON hata sistemi |
| 4 | Virtual Conveyor | FOV simulation |
| 5 | AI Detection | PatchCore + teach-in |
| 6 | Learning System | Operator feedback |
| 7 | Optimization | Performance tuning |

### **Week 0.5 Immediate Tasks**
1. **Monorepo Setup** (pnpm + Turbo)
2. **Backend Skeleton** (FastAPI + routes)
3. **Frontend Skeleton** (React + TypeScript)
4. **Config System** (.env + BaseSettings)
5. **Type Generation** (OpenAPI → TS)

---

## 🎯 Session Sonuçları

### ✅ **Kararlaştırılan**
- Simulation-first development strategy ✅
- Procedural generation optimization ✅
- User-defined taxonomy approach ✅
- Modular architecture with clean separation ✅
- Technology stack finalized ✅

### 🔄 **Açık Kalan Sorular**
- Tile size optimization (256px vs 512px)
- CPU vs GPU blend operations
- Small defect detection threshold (<5mm)

### 📋 **Action Items**
1. Monorepo kurulumu başlatılacak
2. Backend/Frontend iskelet oluşturulacak
3. Basic WebSocket connection test edilecek
4. OpenAPI type generation pipeline kurulacak

---

## 🔗 Session Referansları

**Teknik Doküman:** ChatGPT ile hazırlanan detaylı tasarım dokümanı mevcut  
**Mimari Yaklaşım:** Clean Architecture + Domain-Driven Design  
**Best Practices:** Monorepo, Type Safety, Test-First Development  

---

## 📊 Next Session Agenda

1. **Demo:** Monorepo kurulumu sonuçları
2. **Development:** İlk pattern editor prototype
3. **Technical:** WebSocket real-time connection test
4. **Planning:** Sprint 1 detay planlaması

---

*Session kaydetme tarihi: 26 Haziran 2025, 21:30*