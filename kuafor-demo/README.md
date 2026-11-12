# Kuaför & Berber Randevu Sistemi — Demo

React + Tailwind CSS ile hazırlanmış, backend/veritabanı gerektirmeyen (tüm veriler `localStorage`'da tutulur) tam çalışan bir demo uygulamadır.

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın.

Üretim derlemesi için:

```bash
npm run build
npm run preview
```

## Demo Giriş Bilgileri

Açılış sayfasındaki **"İşletme Girişi"** butonuna tıklayıp:

- Kullanıcı adı: `admin`
- Şifre: `admin123`

ile "Berber Ramazan" adlı örnek dükkânın tüm verileriyle (randevular, kasa, personel, hizmetler) panele giriş yapabilirsiniz.

## Klasör Yapısı

```
src/
  components/
    admin/        -> Yönetim paneli modülleri (Takvim, Kasa, Personel, Hizmetler, Sesli Asistan)
    public/        -> Müşteri vitrini ve randevu alma akışı
    Login.jsx
  context/
    AppContext.jsx -> Tüm uygulama state'i, auth ve CRUD işlemleri (localStorage tabanlı)
  data/
    seed.js         -> Demo hesap için başlangıç (mock) verileri
  utils/
    date.js         -> Tarih/saat yardımcıları
    whatsapp.js      -> WhatsApp hatırlatma linki oluşturucu
  App.jsx            -> Vitrin / Giriş / Panel yönlendirmesi
  main.jsx
```

## Özellikler

- **Çoklu kullanıcı (multi-tenant) mantığı:** Her kullanıcı adı bir dükkâna (`shopId`) bağlıdır; giriş yapan kullanıcı yalnızca kendi dükkânının verilerini görür.
- **Randevu Takvimi:** Gün / Hafta / Ay görünümleri, boş-dolu-kapalı slot renklendirmesi, randevu ekleme/düzenleme/iptal, saat kapatma.
- **WhatsApp Hatırlatıcı:** Her randevunun yanındaki 💬 butonu `wa.me` linkiyle hazır mesaj açar.
- **Sesli Asistan (simüle):** Tarayıcı destekliyorsa gerçek Web Speech API (`webkitSpeechRecognition`) kullanılır; desteklemiyorsa metin girişiyle aynı komutlar çalışır. Örnek: *"Yarın saat 15:00 Ahmet'e saç kesimi randevusu"*, *"Mehmet 300 lira verdi"*, *"Hasan'a 200 lira veresiye yaz"*.
- **Kasa/Finans:** Gün/hafta/ay bazlı giren-çıkan özetleri, veresiye defteri, personel avans takibi.
- **Personel & Hizmet Yönetimi:** Ekle/düzenle/sil, uzmanlık alanları, çalışma saatleri/izin günleri, menüden kaldırma.
- **Müşteri Vitrini:** İşletme tanıtımı + 5 adımlı randevu alma akışı (hizmet → usta → tarih/saat → bilgiler → onay).

## Not

Bu bir **frontend demo**'dur: gerçek bir sunucu veya veritabanı yoktur. Tüm veriler tarayıcınızın `localStorage`'ında saklanır; tarayıcı verilerini temizlerseniz demo veriler sıfırlanıp yeniden oluşturulur. Gerçek bir ürüne dönüştürmek için bu context katmanının yerine bir API (Node.js/Express + PostgreSQL gibi) bağlanması yeterlidir — bileşenler zaten `AppContext` üzerinden soyutlanmış durumdadır.
