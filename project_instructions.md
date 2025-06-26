# 📋 AnomalyYunsa - Project Development Instructions

## 🎯 Project Overview
**Fabric Quality Control System** - AI-powered anomaly detection for 150m×1.5m fabric rolls with simulation-first development approach.

---

## 📏 **CRITICAL: File Size & Modularity Rules**

### 🚨 **Strict File Size Limits**
| File Type | Target Lines | Maximum Lines | Action Required |
|-----------|--------------|---------------|-----------------|
| Route handlers | 50-100 | **150** | Split into separate route files |
| Service classes | 200-300 | **400** | Extract helper functions/classes |
| React components | 100-200 | **300** | Break into atomic components |
| Utility functions | 50-150 | **200** | Split by functionality |
| Model definitions | 30-100 | **150** | Separate by domain |
| Main files | 50-100 | **100** | Keep as orchestrator only |

### 🔧 **Modularity Principles**
- **Single Responsibility:** Each file has ONE clear purpose
- **Clean Interfaces:** Clear APIs between modules
- **No God Objects:** Break down large classes/components
- **Testable Units:** Each module independently testable

### 🏗️ **Mandatory Structure Patterns**

#### Backend Services
```python
# ❌ BAD: One huge service file
services/fabric_service.py (2000+ lines)

# ✅ GOOD: Domain-specific modules  
services/fabric/
├── pattern_generator.py    # Pattern creation logic
├── tessellation_engine.py  # Tiling algorithms
├── defect_injector.py      # Defect placement
└── texture_renderer.py     # Image rendering
```

#### Frontend Components
```typescript
// ❌ BAD: Monolithic component
PatternEditor.tsx (1500+ lines)

// ✅ GOOD: Atomic design
PatternEditor/
├── Canvas.tsx              # Konva drawing surface
├── ToolPalette.tsx         # Drawing tools
├── LayerPanel.tsx          # Layer management
├── PreviewWindow.tsx       # Seamless preview
└── index.tsx               # Composition (50 lines max)
```

---

## 🤖 **AI Collaboration Strategy**

### 🎯 **Token-Heavy Tasks → ChatGPT Delegation**

When Claude approaches session limits on complex tasks, use this workflow:

#### **Step 1: Claude Prepares ChatGPT Prompt**
Claude creates structured prompt including:
- Task context & requirements
- Code standards & patterns
- File list to analyze
- Expected output format

#### **Step 2: File Transfer Protocol**
Claude specifies which files to send:
```
Send to ChatGPT:
- /backend/services/current_service.py
- /frontend/src/components/target_component.tsx  
- /docs/architecture_decisions.md
```

#### **Step 3: ChatGPT Processing**
User runs ChatGPT session with Claude's prompt + files

#### **Step 4: Result Integration**
User shares ChatGPT output → Claude integrates & continues

### 🔄 **Trigger Conditions for ChatGPT Delegation**
- **Large Refactoring:** Breaking down 500+ line files
- **Complex Algorithm Implementation:** ML/AI modules
- **Multi-file Analysis:** Architecture reviews
- **Performance Optimization:** Profiling & optimization
- **Test Suite Generation:** Comprehensive testing

---

## 🛠️ **Development Standards**

### 🎨 **Code Quality Rules**
- **Type Safety:** Full TypeScript coverage
- **Error Handling:** Comprehensive try/catch blocks
- **Logging:** Structured logging with context
- **Documentation:** JSDoc/Docstring for all public APIs
- **Testing:** Unit tests for all services/utilities

### 📁 **Project Structure Enforcement**
```
AnomalyYunsa/
├── backend/
│   ├── main.py                 # 50 lines max - app init only
│   ├── routes/                 # 100 lines max per route
│   ├── services/               # Domain-specific modules
│   ├── adapters/               # External system interfaces
│   ├── models/                 # Pydantic models by domain
│   └── utils/                  # Pure functions only
├── frontend/src/
│   ├── pages/                  # Route components (200 lines max)
│   ├── components/             # Atomic design hierarchy
│   ├── services/               # API clients (100 lines max)
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Pure functions only
└── shared/
    └── types/                  # Cross-platform interfaces
```

### 🔄 **Continuous Refactoring**
- **File Size Monitor:** Regular checks during development
- **Extract When Growing:** Proactive splitting before limits
- **Interface Consistency:** Maintain clean APIs during splits
- **Test Preservation:** Ensure tests remain valid after refactoring

---

## 🎯 **Sprint Development Process**

### 📋 **Task Breakdown Strategy**
1. **Estimate Complexity:** Lines of code prediction
2. **Identify Split Points:** Natural module boundaries
3. **Create Sub-tasks:** Each targeting specific files/modules
4. **Parallel Development:** Independent module development

### 🔍 **Code Review Checkpoints**
- **Pre-commit:** File size validation
- **Mid-sprint:** Architecture consistency review
- **Pre-merge:** Integration testing
- **Post-sprint:** Refactoring opportunities

---

## 🚀 **Performance Guidelines**

### 🧠 **Memory Management**
- **Lazy Loading:** Load components/modules on demand
- **Memory Pools:** Reuse objects where possible
- **Garbage Collection:** Explicit cleanup for large objects
- **Streaming:** Process large datasets incrementally

### ⚡ **Optimization Priorities**
1. **Algorithmic Efficiency:** O(n) improvements first
2. **Memory Usage:** Reduce footprint before speed
3. **Bundle Size:** Frontend code splitting
4. **API Response Time:** Database query optimization

---

## 📊 **Quality Metrics**

### 📏 **Maintainability Targets**
- **Cyclomatic Complexity:** < 10 per function
- **File Size:** Follow strict limits above
- **Test Coverage:** > 80% for services, > 60% for UI
- **Documentation:** 100% API coverage

### 🎯 **Performance Targets**
- **API Response:** < 200ms for standard requests
- **Frontend Bundle:** < 1MB initial load
- **Memory Usage:** < 500MB during development
- **Startup Time:** < 3 seconds for dev servers

---

## 🔧 **Development Tools**

### 🛠️ **Required Extensions/Tools**
- **ESLint + Prettier:** Code formatting
- **TypeScript Strict Mode:** Full type checking
- **Performance Profiler:** Regular performance monitoring
- **Bundle Analyzer:** Frontend size tracking

### 📋 **Daily Development Checklist**
- [ ] File sizes within limits
- [ ] New code has tests
- [ ] TypeScript errors = 0
- [ ] API endpoints documented
- [ ] Performance impact assessed

---

## 🎯 **Success Criteria**

### ✅ **Sprint Completion Definition**
- All files within size limits ✅
- Full TypeScript coverage ✅
- Tests passing ✅
- Documentation updated ✅
- Performance benchmarks met ✅

### 📈 **Project Health Indicators**
- **Code Quality:** ESLint score > 9.0
- **Test Reliability:** < 1% flaky tests
- **Build Speed:** < 30 seconds full build
- **Developer Experience:** < 5 seconds hot reload

---

*Last updated: 26 Haziran 2025*
*This document evolves with the project - update as needed*