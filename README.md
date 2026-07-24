# Pepe · 2017–2025

pepe.tahayerdekalmazer.com — Pepe için anıt sitesi.

- 28.06.2017 – 26.07.2025 · Ballı Lokmam · Kaymağım · 2/40/8
- Statik site: `index.html` + `style.css` + `main.js`, framework yok.
- Görseller `assets/img/` (1600px web + `_t` 640px küçük boy), videolar `assets/video/` (720p, sessiz döngü).
- Açılış, mezar taşı kartının web uyarlaması: kemer ve kulak formları SVG `clipPath` (objectBoundingBox) ile.

## Yayın (GitHub Pages)

1. Bu klasörü bir repoya push'la, Pages'i aç (branch: main, root).
2. DNS'te `pepe` alt alan adı için CNAME kaydı: `pepe.tahayerdekalmazer.com → <kullanıcı>.github.io`
3. `CNAME` dosyası hazır; Pages ayarlarında custom domain otomatik görünür.

## Yerel önizleme

```
python3 -m http.server 8123
```
