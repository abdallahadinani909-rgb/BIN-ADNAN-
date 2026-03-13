//---------------------------------------------------------------------------
//           ✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        }
    };
};

//=============================================
//  𝙰𝙳𝙼𝙸𝙽 𝙴𝚅𝙴𝙽𝚃𝚂
//=============================================
cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴅᴍɪɴ ᴇᴠᴇɴᴛꜱ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴅᴍɪɴ ᴇᴠᴇɴᴛꜱ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.ADMIN_EVENTS === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ⚙️ ᴀᴅᴍɪɴ ᴇᴠᴇɴᴛꜱ ⚙️
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀᴅᴍɪɴ-ᴇᴠᴇɴᴛꜱ ᴏɴ*
│ 2️⃣ *.ᴀᴅᴍɪɴ-ᴇᴠᴇɴᴛꜱ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝚆𝙴𝙻𝙲𝙾𝙼𝙴
//=============================================
cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
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

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴡᴇʟᴄᴏᴍᴇ ᴍᴇꜱꜱᴀɢᴇꜱ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.WELCOME = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴡᴇʟᴄᴏᴍᴇ ᴍᴇꜱꜱᴀɢᴇꜱ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.WELCOME === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   👋 ᴡᴇʟᴄᴏᴍᴇ ꜱᴇᴛᴛɪɴɢꜱ 👋
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴡᴇʟᴄᴏᴍᴇ ᴏɴ*
│ 2️⃣ *.ᴡᴇʟᴄᴏᴍᴇ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝚂𝙴𝚃 𝙿𝚁𝙴𝙵𝙸𝚇
//=============================================
cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
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

    const newPrefix = args[0];
    if (!newPrefix) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🔧 ᴄʜᴀɴɢᴇ ᴘʀᴇꜰɪx 🔧
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ﹒✦ ───┐
│ 📌 ${config.PREFIX}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ *.ꜱᴇᴛᴘʀᴇꜰɪx [ɴᴇᴡ_ᴘʀᴇꜰɪx]*
│ 
│ 📌 ᴇxᴀᴍᴘʟᴇ: *.ꜱᴇᴛᴘʀᴇꜰɪx !*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    config.PREFIX = newPrefix;
    
    await conn.sendMessage(from, { 
        text: `╔════════════════════╗
║   ✅ ᴘʀᴇꜰɪx ᴄʜᴀɴɢᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ɴᴇᴡ ᴘʀᴇꜰɪx﹒✦ ───┐
│ 📌 ${newPrefix}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
});

//=============================================
//  𝚂𝙴𝚃 𝙼𝙾𝙳𝙴
//=============================================
cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
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

    if (!args[0]) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🫟 ʙᴏᴛ ᴍᴏᴅᴇ 🫟
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ᴍᴏᴅᴇ﹒✦ ───┐
│ 📌 ${config.MODE}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴄʜᴀɴɢᴇ﹒✦ ───┐
│ 1️⃣ *.ᴍᴏᴅᴇ ᴘʀɪᴠᴀᴛᴇ*
│ 2️⃣ *.ᴍᴏᴅᴇ ᴘᴜʙʟɪᴄ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const modeArg = args[0].toLowerCase();

    if (modeArg === "private") {
        config.MODE = "private";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ᴍᴏᴅᴇ ᴄʜᴀɴɢᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ɴᴇᴡ ᴍᴏᴅᴇ﹒✦ ───┐
│ 📌 ᴘʀɪᴠᴀᴛᴇ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (modeArg === "public") {
        config.MODE = "public";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ᴍᴏᴅᴇ ᴄʜᴀɴɢᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ɴᴇᴡ ᴍᴏᴅᴇ﹒✦ ───┐
│ 📌 ᴘᴜʙʟɪᴄ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ᴍᴏᴅᴇ ❌
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇ﹒✦ ───┐
│ 📌 *.ᴍᴏᴅᴇ ᴘʀɪᴠᴀᴛᴇ*
│ 📌 *.ᴍᴏᴅᴇ ᴘᴜʙʟɪᴄ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾-𝚃𝚈𝙿𝙸𝙽𝙶
//=============================================
cmd({
    pattern: "auto-typing",
    alias: ["autotyping"],
    desc: "Enable or disable auto-typing feature",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_TYPING = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.AUTO_TYPING = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_TYPING === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✍️ ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ ✍️
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ ᴏɴ*
│ 2️⃣ *.ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝙼𝙴𝙽𝚃𝙸𝙾𝙽 𝚁𝙴𝙿𝙻𝚈
//=============================================
cmd({
    pattern: "mention-reply",
    alias: ["menetionreply", "mee"],
    desc: "Enable or disable mention reply feature",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.MENTION_REPLY = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴍᴇɴᴛɪᴏɴ ʀᴇᴘʟʏ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.MENTION_REPLY = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴍᴇɴᴛɪᴏɴ ʀᴇᴘʟʏ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.MENTION_REPLY === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   👥 ᴍᴇɴᴛɪᴏɴ ʀᴇᴘʟʏ 👥
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴍᴇᴇ ᴏɴ*
│ 2️⃣ *.ᴍᴇᴇ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴
//=============================================
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.ALWAYS_ONLINE === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🌐 ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ 🌐
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀʟᴡᴀʏꜱ-ᴏɴʟɪɴᴇ ᴏɴ*
│ 2️⃣ *.ᴀʟᴡᴀʏꜱ-ᴏɴʟɪɴᴇ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳𝙸𝙽𝙶
//=============================================
cmd({
    pattern: "auto-recording",
    alias: ["autorecording"],
    desc: "Enable or disable auto-recording feature",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_RECORDING = "true";
        await conn.sendPresenceUpdate("recording", from);
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
│ 🎙️ ʙᴏᴛ ɪꜱ ʀᴇᴄᴏʀᴅɪɴɢ...
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.AUTO_RECORDING = "false";
        await conn.sendPresenceUpdate("available", from);
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_RECORDING === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🎙️ ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ 🎙️
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀᴜᴛᴏ-ʀᴇᴄᴏʀᴅɪɴɢ ᴏɴ*
│ 2️⃣ *.ᴀᴜᴛᴏ-ʀᴇᴄᴏʀᴅɪɴɢ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝙰𝚄𝚃𝙾 𝚂𝙴𝙴𝙽 (𝚂𝚃𝙰𝚃𝚄𝚂)
//=============================================
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ ꜱᴇᴇɴ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
│ 👀 ʙᴏᴛ ᴡɪʟʟ ᴀᴜᴛᴏ-ᴠɪᴇᴡ ꜱᴛᴀᴛᴜꜱᴇꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ ꜱᴇᴇɴ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_STATUS_SEEN === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   👀 ᴀᴜᴛᴏ ꜱᴇᴇɴ 👀
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀᴜᴛᴏ-ꜱᴇᴇɴ ᴏɴ*
│ 2️⃣ *.ᴀᴜᴛᴏ-ꜱᴇᴇɴ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝚂𝚃𝙰𝚃𝚄𝚂 𝚁𝙴𝙰𝙲𝚃
//=============================================
cmd({
    pattern: "status-react",
    alias: ["statusreaction"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴏᴡɴᴇʀ ᴏɴʟʏ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛᴜꜱ ʀᴇᴀᴄᴛ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
│ ❤️ ʙᴏᴛ ᴡɪʟʟ ᴀᴜᴛᴏ-ʟɪᴋᴇ ꜱᴛᴀᴛᴜꜱᴇꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛᴜꜱ ʀᴇᴀᴄᴛ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_STATUS_REACT === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ❤️ ꜱᴛᴀᴛᴜꜱ ʀᴇᴀᴄᴛ ❤️
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ꜱᴛᴀᴛᴜꜱ-ʀᴇᴀᴄᴛ ᴏɴ*
│ 2️⃣ *.ꜱᴛᴀᴛᴜꜱ-ʀᴇᴀᴄᴛ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  𝚁𝙴𝙰𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴
//=============================================
cmd({
    pattern: "read-message",
    alias: ["readmsg", "autoread"],
    desc: "Enable or disable auto-read messages",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
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

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_READ = "true";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ ʀᴇᴀᴅ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴇɴᴀʙʟᴇᴅ
│ 📖 ʙᴏᴛ ᴡɪʟʟ ᴀᴜᴛᴏ-ʀᴇᴀᴅ ᴀʟʟ ᴍᴇꜱꜱᴀɢᴇꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else if (status === "off") {
        config.AUTO_READ = "false";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   ✅ ꜱᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴀᴜᴛᴏ ʀᴇᴀᴅ﹒✦ ───┐
│ 📌 ꜱᴛᴀᴛᴜꜱ: ᴅɪꜱᴀʙʟᴇᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    } else {
        const currentStatus = config.AUTO_READ === "true" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
        return await conn.sendMessage(from, { 
            text: `╔════════════════════╗
║   📖 ᴀᴜᴛᴏ ʀᴇᴀᴅ ᴍᴇꜱꜱᴀɢᴇꜱ 📖
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ʀᴇᴀᴅ-ᴍᴇꜱꜱᴀɢᴇ ᴏɴ*
│ 2️⃣ *.ʀᴇᴀᴅ-ᴍᴇꜱꜱᴀɢᴇ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});