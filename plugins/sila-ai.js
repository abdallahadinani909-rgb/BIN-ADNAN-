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

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "think", "chatgpt", "brainy", "chat"],
    react: "🤖",
    desc: "Ask AI anything - Powered by GPT",
    category: "ai",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, q, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🤖 ᴀɪ ᴀꜱꜱɪꜱᴛᴀɴᴛ 🤖
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 📌 *.ᴀɪ ᴡʜᴀᴛ ɪꜱ ᴘʏᴛʜᴏɴ?*
│ 📌 *.ɢᴘᴛ ᴛᴇʟʟ ᴍᴇ ᴀ ᴊᴏᴋᴇ*
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    // Send processing message with typing indicator
    await conn.sendPresenceUpdate('composing', from);
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🤔 ᴛʜɪɴᴋɪɴɢ... 🤔
╚════════════════════╝

⏳ ᴀɪ ɪꜱ ᴘʀᴏᴄᴇꜱꜱɪɴɢ ʏᴏᴜʀ ǫᴜᴇꜱᴛɪᴏɴ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Call AI API
    const response = await axios.get(`https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(q.trim())}`, {
        timeout: 30000 // 30 seconds timeout
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    let aiResponse = response.data.response || response.data.result || response.data.data || JSON.stringify(response.data);

    // Truncate if too long
    if (aiResponse.length > 4000) {
        aiResponse = aiResponse.substring(0, 3990) + '...\n\n📌 *ʀᴇꜱᴘᴏɴꜱᴇ ᴛʀᴜɴᴄᴀᴛᴇᴅ ᴅᴜᴇ ᴛᴏ ʟᴇɴɢᴛʜ*';
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🤖 ᴀɪ ʀᴇꜱᴘᴏɴꜱᴇ 🤖
╚════════════════════╝

┌─── ✦﹒ʏᴏᴜʀ ǫᴜᴇꜱᴛɪᴏɴ﹒✦ ───┐
│ ❓ ${q.substring(0, 100)}${q.length > 100 ? '...' : ''}
└────────────────────┘

┌─── ✦﹒ᴀɪ ᴀɴꜱᴡᴇʀ﹒✦ ───┐
│ 💡 ${aiResponse}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    console.error('AI Command Error:', e);
    
    let errorMsg = '❌ ᴀɪ ꜱᴇʀᴠɪᴄᴇ ᴛᴇᴍᴘᴏʀᴀʀɪʟʏ ᴜɴᴀᴠᴀɪʟᴀʙʟᴇ';
    
    if (e.response?.status === 429) {
        errorMsg = '❌ ʀᴀᴛᴇ ʟɪᴍɪᴛ ᴇxᴄᴇᴇᴅᴇᴅ. ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ';
    } else if (e.response?.status === 500) {
        errorMsg = '❌ ᴀɪ ꜱᴇʀᴠᴇʀ ᴇʀʀᴏʀ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = '❌ ʀᴇQᴜᴇꜱᴛ ᴛɪᴍᴇᴅ ᴏᴜᴛ. ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ';
    } else if (e.message.includes('ECONNREFUSED')) {
        errorMsg = '❌ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ᴛᴏ ᴀɪ ꜱᴇʀᴠᴇʀ ꜰᴀɪʟᴇᴅ';
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ❌ ᴀɪ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${errorMsg}
└────────────────────┘

💡 ᴘʟᴇᴀꜱᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});