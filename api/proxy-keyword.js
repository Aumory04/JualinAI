export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    // Izinkan preflight CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Hanya POST yang diizinkan" });
  }

  const { produk, kategori, target, manfaat, platform } = req.body;

  const prompt = `Saya ingin mencari kata kunci relevan dan efektif untuk keperluan digital marketing. Informasi produk saya adalah sebagai berikut:
  - Nama Produk: ${produk}
  - Kategori: ${kategori}
  - Target Pasar: ${target}
  - Manfaat Utama: ${manfaat}
  - Platform Tujuan: ${platform}
  Tolong hasilkan 10 sampai 15 kata kunci yang sesuai dan memiliki potensi tinggi untuk meningkatkan jangkauan dan visibilitas secara online. Sertakan variasi kata kunci pendek dan panjang (long-tail keyword). Sajikan dalam format poin yang mudah dibaca.`;

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
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Tambahkan header CORS di sini juga
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json({ result: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil respon dari AI" });
  }
}
