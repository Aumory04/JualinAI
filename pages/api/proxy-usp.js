export default async function handler(req, res) {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // Ambil data dari body
  const { nama, produk, keunggulan, keunikan, target, nilai } = req.body;

  // Validasi data (ubah sesuai kebutuhan field fitur)
  if (!nama || !produk || !keunggulan || !keunikan || !target || !nilai) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  // Prompt AI (ubah sesuai fitur)
  const prompt = `Buatkan satu kalimat USP (Unique Selling Proposition) yang menarik dan mudah dipahami, berdasarkan informasi berikut: Nama brand atau produk: ${nama}. Jenis produk: ${produk}. Keunggulan: ${keunggulan}. Keunikan dibanding kompetitor: ${keunikan}. Target pasar: ${target}. Nilai yang ingin ditonjolkan: ${nilai}. Gunakan bahasa yang menarik dan singkat, cocok untuk ditampilkan di katalog atau media sosial.`;

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
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json({ result: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil respon dari AI" });
  }
}
