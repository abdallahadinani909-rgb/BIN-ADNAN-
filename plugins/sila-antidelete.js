// 🌟 AntiDelete Command — Stylish Edition
const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const {
    getAnti,
    setAnti,
    initializeAntiDeleteSettings
} = require('../data/antidel');

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

// 🔁 Ensure AntiDelete settings exist on startup
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ["antidel", "ad"],
    desc: "Configure AntiDelete settings",
    category: "settings",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe, sender }) => {

    // 🔐 Owner-only access
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    try {
        const command = q?.toLowerCase();

        switch (command) {

            // 🔴 Turn OFF AntiDelete everywhere
            case "on":
                await setAnti("gc", false);
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   🛡️ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴅɪꜱᴀʙʟᴇᴅ 🛡️
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ɢʀᴏᴜᴘ ᴄʜᴀᴛꜱ: ᴏꜰꜰ
│ 📌 ᴅɪʀᴇᴄᴛ ᴍᴇꜱꜱᴀɢᴇꜱ: ᴏꜰꜰ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });

            // 🔕 Disable AntiDelete for Group Chats
            case "off gc":
                await setAnti("gc", false);
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ɢʀᴏᴜᴘ ᴄʜᴀᴛꜱ﹒✦ ───┐
│ 📌 ᴀɴᴛɪᴅᴇʟᴇᴛᴇ: ᴏꜰꜰ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });

            // 🔕 Disable AntiDelete for DMs
            case "off dm":
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴅɪʀᴇᴄᴛ ᴍᴇꜱꜱᴀɢᴇꜱ﹒✦ ───┐
│ 📌 ᴀɴᴛɪᴅᴇʟᴇᴛᴇ: ᴏꜰꜰ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });

            // 🔁 Toggle Group Chat AntiDelete
            case "set gc": {
                const gcStatus = await getAnti("gc");
                await setAnti("gc", !gcStatus);
                const newStatus = !gcStatus;
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   🔄 ꜱᴇᴛᴛɪɴɢ ᴛᴏɢɢʟᴇᴅ 🔄
╚════════════════════╝

┌─── ✦﹒ɢʀᴏᴜᴘ ᴄʜᴀᴛꜱ﹒✦ ───┐
│ 📌 ᴀɴᴛɪᴅᴇʟᴇᴛᴇ: ${newStatus ? 'ᴏɴ ✅' : 'ᴏꜰꜰ ❌'}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            }

            // 🔁 Toggle DM AntiDelete
            case "set dm": {
                const dmStatus = await getAnti("dm");
                await setAnti("dm", !dmStatus);
                const newStatus = !dmStatus;
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   🔄 ꜱᴇᴛᴛɪɴɢ ᴛᴏɢɢʟᴇᴅ 🔄
╚════════════════════╝

┌─── ✦﹒ᴅɪʀᴇᴄᴛ ᴍᴇꜱꜱᴀɢᴇꜱ﹒✦ ───┐
│ 📌 ᴀɴᴛɪᴅᴇʟᴇᴛᴇ: ${newStatus ? 'ᴏɴ ✅' : 'ᴏꜰꜰ ❌'}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            }

            // ✅ Enable AntiDelete everywhere
            case "set all":
                await setAnti("gc", true);
                await setAnti("dm", true);
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   ✅ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴇɴᴀʙʟᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ɢʀᴏᴜᴘ ᴄʜᴀᴛꜱ: ᴏɴ ✅
│ 📌 ᴅɪʀᴇᴄᴛ ᴍᴇꜱꜱᴀɢᴇꜱ: ᴏɴ ✅
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });

            // 📊 Show current status
            case "status": {
                const currentDmStatus = await getAnti("dm");
                const currentGcStatus = await getAnti("gc");

                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   📊 ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ꜱᴛᴀᴛᴜꜱ 📊
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴇᴛᴛɪɴɢꜱ﹒✦ ───┐
│ 👤 ᴅᴍ: ${currentDmStatus ? 'ᴇɴᴀʙʟᴇᴅ ✅' : 'ᴅɪꜱᴀʙʟᴇᴅ ❌'}
│ 👥 ɢʀᴏᴜᴘ: ${currentGcStatus ? 'ᴇɴᴀʙʟᴇᴅ ✅' : 'ᴅɪꜱᴀʙʟᴇᴅ ❌'}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            }

            // 📖 Help Menu
            default:
                return await conn.sendMessage(from, { 
                    text: `╔════════════════════╗
║   🛡️ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ɢᴜɪᴅᴇ 🛡️
╚════════════════════╝

┌─── ✦﹒ᴄᴏᴍᴍᴀɴᴅꜱ﹒✦ ───┐
│ 1️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴏɴ* - ᴅɪꜱᴀʙʟᴇ ᴀʟʟ
│ 2️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴏꜰꜰ ɢᴄ* - ᴅɪꜱᴀʙʟᴇ ɢʀᴏᴜᴘ
│ 3️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴏꜰꜰ ᴅᴍ* - ᴅɪꜱᴀʙʟᴇ ᴅᴍ
│ 4️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ꜱᴇᴛ ɢᴄ* - ᴛᴏɢɢʟᴇ ɢʀᴏᴜᴘ
│ 5️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ꜱᴇᴛ ᴅᴍ* - ᴛᴏɢɢʟᴇ ᴅᴍ
│ 6️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ꜱᴇᴛ ᴀʟʟ* - ᴇɴᴀʙʟᴇ ᴀʟʟ
│ 7️⃣ *.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ꜱᴛᴀᴛᴜꜱ* - ᴄʜᴇᴄᴋ ꜱᴛᴀᴛᴜꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
        }

    } catch (error) {
        console.error("❌ AntiDelete Command Error:", error);
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❌ ᴄᴏᴍᴍᴀɴᴅ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});