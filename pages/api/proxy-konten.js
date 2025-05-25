export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { namaBrand, produk, tujuan, platform, format, audiens, gaya, keterbatasan } = req.body;

  const prompt = `
  Buatkan 5 ide konten kreatif dan bisa langsung dieksekusi untuk brand bernama "${namaBrand}" yang menjual produk "${produk}".
  Tujuan utama konten ini adalah: ${tujuan}.
  Platform yang digunakan: ${platform}.
  Format konten yang diinginkan: ${format}.
  Target audiens: ${audiens}.
  Gaya konten yang diinginkan: ${gaya}.
  ${keterbatasan ? `Perlu diperhatikan keterbatasan berikut: ${keterbatasan}.` : ""}

  Setiap ide harus:
  - Relevan dengan tujuan dan audiens
  - Menyesuaikan karakteristik platform dan format
  - Disusun dalam format daftar 1 sampai 5
  - Masing-masing ide cukup 2 sampai 3 kalimat, singkat tapi jelas
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json({ result: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil respon dari AI" });
  }
}
