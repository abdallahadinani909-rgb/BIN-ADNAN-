const { cmd } = require('../command');
const axios = require('axios');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        },
    };
};

const flags = {
    china: '🇨🇳',
    indonesia: '🇮🇩',
    japan: '🇯🇵',
    korea: '🇰🇷',
    thailand: '🇹🇭'
};

cmd({
    pattern: "beauty",
    alias: ["china", "indonesia", "japan", "korea", "thailand", "chinese", "indo", "japanese", "korean", "thai"],
    react: "😍",
    desc: "Get random beauty image by country",
    category: "fun",
    filename: __filename
},
async(conn, mek, m, {from, command, args, q, sender}) => {
try{
    
    // Get country from command or parameter
    let country = q?.trim() || command;
    country = country.toLowerCase();

    // Map aliases to country names
    const countryMap = {
        'chinese': 'china',
        'indo': 'indonesia',
        'jp': 'japan',
        'japanese': 'japan',
        'korean': 'korea',
        'kr': 'korea',
        'thai': 'thailand'
    };

    if (countryMap[country]) {
        country = countryMap[country];
    }

    // Validate country
    const validCountries = ['china', 'indonesia', 'japan', 'korea', 'thailand'];
    if (!validCountries.includes(country)) {
        return await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ᴄᴏᴜɴᴛʀʏ ❌
╚════════════════════╝

┌─── ✦﹒ᴀᴠᴀɪʟᴀʙʟᴇ ᴄᴏᴜɴᴛʀɪᴇꜱ﹒✦ ───┐
│ 📌 china 🇨🇳
│ 📌 indonesia 🇮🇩
│ 📌 japan 🇯🇵
│ 📌 korea 🇰🇷
│ 📌 thailand 🇹🇭
└────────────────────┘

📌 ᴇxᴀᴍᴘʟᴇ: *.ʙᴇᴀᴜᴛʏ ᴋᴏʀᴇᴀ*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    // Send processing message
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ꜰᴇᴛᴄʜɪɴɢ ɪᴍᴀɢᴇ... 🔍
╚════════════════════╝

⏳ ʟᴏᴏᴋɪɴɢ ꜰᴏʀ ʀᴀɴᴅᴏᴍ ${country} ʙᴇᴀᴜᴛʏ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Show typing indicator
    await conn.sendPresenceUpdate('composing', from);

    // Call API with country parameter
    const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/${country}`, {
        timeout: 30000,
        responseType: 'arraybuffer'
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    await conn.sendPresenceUpdate('paused', from);

    const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

    // Send image
    await conn.sendMessage(from, {
        image: Buffer.from(response.data),
        caption: `╔════════════════════╗
║   😍 ʀᴀɴᴅᴏᴍ ʙᴇᴀᴜᴛʏ 😍
╚════════════════════╝

┌─── ✦﹒ɪᴍᴀɢᴇ ɪɴꜰᴏ﹒✦ ───┐
│ 🌍 ᴄᴏᴜɴᴛʀʏ: ${countryCapitalized} ${flags[country]}
│ 🎲 ᴛʏᴘᴇ: ʀᴀɴᴅᴏᴍ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = '❌ ᴀᴘɪ ꜱᴇʀᴠᴇʀ ᴇʀʀᴏʀ';
    
    if (e.response?.status === 429) {
        errorMsg = '❌ ʀᴀᴛᴇ ʟɪᴍɪᴛ ᴇxᴄᴇᴇᴅᴇᴅ';
    } else if (e.response?.status === 500) {
        errorMsg = '❌ ꜱᴇʀᴠᴇʀ ᴇʀʀᴏʀ';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = '❌ ʀᴇǫᴜᴇꜱᴛ ᴛɪᴍᴇᴅ ᴏᴜᴛ';
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ❌ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${errorMsg}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});