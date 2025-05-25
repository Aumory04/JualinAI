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

  const { produk, targetMarket, karakteristik, masalah } = req.body;

  const prompt = `Saya ingin membuat deskripsi yang jelas, meyakinkan, dan bisa digunakan untuk keperluan marketing dan brand positioning tentang target market saya.

  Berikut data saya:
  - Produk: ${produk}
  - Target market: ${targetMarket}
  - Karakteristik target market: ${karakteristik}
  - Masalah atau kebutuhan utama mereka: ${masalah}

  Tolong buatkan deskripsi target market saya secara deskriptif dan persuasif. Gunakan bahasa yang cocok untuk keperluan marketing, termasuk insight tentang cara berpikir, gaya hidup, dan konteks emosional dari target market tersebut agar saya bisa menggunakannya dalam strategi branding dan komunikasi yang tepat.`

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
