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

  const { brand, jenis, keunggulan, audien, gaya, platform, tujuan } = req.body;

  const prompt = `Buatkan 1 caption untuk media sosial dengan elemen berikut:
  - Brand: ${brand}
  - Jenis Produk: ${jenis}
  - Keunggulan: ${keunggulan}
  - Target Audiens: ${audien}
  - Gaya Penulisan: ${gaya}
  - Platform: ${platform}
  - Tujuan: ${tujuan}

  Gunakan gaya bahasa yang sesuai dengan platform dan audiens, sertakan call-to-action yang menarik, dan tulis caption semenarik mungkin untuk mencapai tujuan tersebut.`;

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

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json({ result: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil respon dari AI" });
  }
}
