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

  const { produk, kategori, manfaat, distribusi } = req.body;

  const prompt = `Saya adalah pelaku UMKM dan ingin mengetahui siapa target market yang paling tepat dan menjanjikan untuk produk saya.

  Berikut informasi produk saya:
  - Nama produk: ${produk}
  - Kategori produk: ${kategori}
  - Manfaat utama produk: ${manfaat}
  - Rencana distribusi produk: ${distribusi}

  Tolong bantu saya:
  1. Menentukan 2 sampai 3 segmen target market yang paling potensial untuk produk ini.
  2. Menjelaskan ciri-ciri mereka, termasuk demografi, gaya hidup, dan kebutuhan.
  3. Memberikan saran strategi komunikasi atau promosi yang sesuai.
  4. Menyarankan langkah validasi awal untuk memastikan apakah segmen tersebut benar-benar cocok, seperti uji coba, survei, atau iklan tes.`

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
