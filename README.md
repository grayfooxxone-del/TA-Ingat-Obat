# TB Medication Compliance System 🏥

Sistem manajemen kepatuhan minum obat Tuberkulosis dengan multi-role architecture - Flutter mobile app + NestJS backend.

**Peran**: Pasien & PMO (Penanggung Jawab Minum Obat)

---

## 🚀 Quick Start

```bash
# Backend
cd c:\Users\Lenovo\api
npm install
npm run start:dev

# Frontend
cd c:\Android\flutter_application_1
flutter pub get
flutter run
```

Buka [QUICK_START.md](QUICK_START.md) untuk panduan lengkap.

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Panduan setup 5 menit
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Desain sistem & arsitektur
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API endpoint reference lengkap
- **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** - Panduan fitur detail (Pasien & PMO)
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing & QA procedures
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment ke production
- **[CHANGELOG.md](CHANGELOG.md)** - Versi history & roadmap
- **[BACKEND_README.md](BACKEND_README.md)** - Backend-specific info
- **[FRONTEND_README.md](FRONTEND_README.md)** - Frontend-specific info (di flutter_application_1/)

---

## ✨ Key Features

### Pasien
✅ Registrasi & Login
✅ Manajemen jadwal minum obat
✅ Upload bukti (foto/video)
✅ Laporan kepatuhan dengan grafik
✅ Sistem gamifikasi (poin, badge, reward)
✅ Materi edukasi TB
✅ Profil & pengaturan

### PMO
✅ Dashboard monitoring
✅ Hubungkan dengan pasien
✅ Monitor jadwal pasien
✅ Verifikasi bukti pasien
✅ Materi edukasi PMO
✅ Laporan kepatuhan

---

## 📁 Project Structure

```
api/
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication
│   │   ├── users/          # User management
│   │   ├── medicines/      # Medicine CRUD
│   │   ├── schedules/      # Schedule & compliance
│   │   ├── evidence/       # Evidence upload
│   │   ├── gamification/   # Points & badges
│   │   └── pmo/           # PMO management
│   └── common/dtos/        # Data Transfer Objects
├── QUICK_START.md
├── ARCHITECTURE.md
├── API_DOCUMENTATION.md
├── FEATURES_GUIDE.md
├── TESTING_GUIDE.md
├── DEPLOYMENT.md
└── CHANGELOG.md

flutter_application_1/
├── lib/
│   ├── models/
│   ├── services/
│   ├── screens/
│   │   ├── auth/
│   │   ├── patient/
│   │   └── pmo/
│   └── main.dart
└── FRONTEND_README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Flutter 3.11.5
- **Language**: Dart
- **HTTP**: Dio 5.3.0
- **State**: Provider 6.0.0
- **Charts**: FL Chart 0.64.0
- **Storage**: SharedPreferences 2.2.0
- **Media**: ImagePicker 1.0.0

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript
- **Runtime**: Node.js >= 14
- **Database**: In-memory (demo) → PostgreSQL (production)
- **Auth**: Token-based → JWT (upgrade)

---

## 📋 API Endpoints

**Base URL**: `http://localhost:3000/api`

### Auth
```
POST   /auth/register      - Register user
POST   /auth/login         - Login
GET    /auth/me            - Get current user
POST   /auth/logout        - Logout
```

### Medicines
```
POST   /medicines              - Create
GET    /medicines/user/:id     - Get user medicines
PUT    /medicines/:id          - Update
DELETE /medicines/:id          - Delete
```

### Schedules
```
POST   /schedules              - Create
GET    /schedules/user/:id     - Get schedules
PUT    /schedules/:id          - Update
DELETE /schedules/:id          - Delete
GET    /schedules/compliance/:id - Compliance report
```

### Evidence
```
POST   /evidence               - Upload
GET    /evidence/user/:id      - Get evidence
PUT    /evidence/:id/verify    - Verify
GET    /evidence/pmo/:id/pending - Get pending
```

### Gamification
```
POST   /gamification           - Create
GET    /gamification/:id       - Get data
PUT    /gamification/:id/add-points - Add points
POST   /gamification/:id/check-monthly-reward - Check reward
```

### PMO
```
POST   /pmo/pair-patient       - Pair patient
GET    /pmo/:id/monitored-patients - Get patients
DELETE /pmo/pairing/:id        - Unpair
POST   /pmo/verify-evidence    - Verify evidence
```

Lihat [API_DOCUMENTATION.md](API_DOCUMENTATION.md) untuk detail lengkap.

---

## 🧪 Testing

### Backend Tests
```bash
npm test              # Run all tests
npm run test:cov      # With coverage
```

### Frontend Tests
```bash
flutter test          # Run unit tests
flutter test --coverage # With coverage
```

### Manual Testing
Lihat [TESTING_GUIDE.md](TESTING_GUIDE.md) untuk checklist lengkap.

---

## 🎯 Development Workflow

### 1. Setup
```bash
# Backend
cd api && npm install

# Frontend
cd flutter_application_1 && flutter pub get
```

### 2. Development
```bash
# Backend (auto hot reload)
npm run start:dev

# Frontend (auto hot reload)
flutter run
```

### 3. Testing
```bash
npm test           # Backend
flutter test       # Frontend
```

### 4. Build
```bash
# APK
flutter build apk --release

# AAB (Play Store)
flutter build appbundle --release
```

Lihat [QUICK_START.md](QUICK_START.md) untuk panduan detail.

---

## 🚀 Deployment

Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk options:
- Heroku (Cloud)
- AWS EC2 (VPS)
- Docker (Containerized)
- App Store & Play Store (Mobile)

---

## 🎓 Features Detail

### Gamification System
- **Points**: Upload (+10), Daily (+5), Monthly (+100)
- **Badges**: 
  - 🥇 Pejuang 1 Minggu
  - 🥈 Pejuang 1 Bulan
  - 🏆 Pahlawan TB (100% compliance)
  - ⭐ Konsisten (never late)
- **Rewards**: Monthly 100% completion gets special badge + 500 pts

### Compliance Tracking
- Real-time schedule marking
- Daily/monthly statistics
- Visual progress reports
- PDF export capability

### Evidence Verification
- Photo/video upload
- PMO verification workflow
- Auto-point award on verification
- Complete audit trail

---

## 🔒 Security (Current)
- [x] Token-based authentication
- [x] Role-based access control
- [ ] JWT with expiration (TODO)
- [ ] Password hashing (TODO)
- [ ] HTTPS enforcement (TODO)
- [ ] Rate limiting (TODO)

---

## 📈 Roadmap

### v1.1.0 (Q2 2024)
- PostgreSQL database integration
- JWT authentication
- File storage (S3/Cloud)
- Email notifications
- SMS reminders

### v1.2.0 (Q3 2024)
- Telemedicine integration
- Appointment scheduling
- Family/Guardian access
- Advanced analytics

### v2.0.0 (Q4 2024)
- ML-based predictions
- Government health portal integration
- Multi-language support
- Enterprise features

Lihat [CHANGELOG.md](CHANGELOG.md) untuk detail lengkap.

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

## 📞 Support

- **Documentation**: [QUICK_START.md](QUICK_START.md)
- **Issues**: GitHub Issues
- **Q&A**: [FEATURES_GUIDE.md](FEATURES_GUIDE.md#troubleshooting)
- **Email**: support@tbmanagement.app

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team

- Backend Developer: NestJS Implementation
- Frontend Developer: Flutter Implementation
- UI/UX Designer: Screens & Wireframes
- Project Manager: Requirements & Coordination

---

## 🙏 Acknowledgments

- Flutter community
- NestJS community
- WHO TB guidelines
- Patient advocates

---

**Version**: 1.0.0
**Last Updated**: 2024-05-02

---

## Next Steps

1. **Read [QUICK_START.md](QUICK_START.md)** for 5-minute setup
2. **Explore [ARCHITECTURE.md](ARCHITECTURE.md)** for system design
3. **Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)** for API reference
4. **Review [FEATURES_GUIDE.md](FEATURES_GUIDE.md)** for feature details
5. **Run tests** with `npm test` & `flutter test`
6. **Deploy** following [DEPLOYMENT.md](DEPLOYMENT.md)
