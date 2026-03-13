const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd , commands } = require('../command');

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

// Auto Reply Feature
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner, sender }) => {
    try {
        const filePath = path.join(__dirname, '../assets/autoreply.json');
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error("❌ Auto Reply: autoreply.json file not found!");
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                
                if (config.AUTO_REPLY === 'true' || config.AUTO_REPLY === true) {
                    //if (isOwner) return;  
                    
                    await conn.sendMessage(from, { 
                        text: `╔════════════════════╗
║   🤖 ᴀᴜᴛᴏ ʀᴇᴘʟʏ 🤖
╚════════════════════╝

${data[text]}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: mek });
                }
            }
        }
    } catch (error) {
        console.error("❌ Auto Reply Error:", error);
    }
});

// Auto Reply Command to Toggle
cmd({
    pattern: "autoreply",
    alias: ["autores", "autorespond"],
    desc: "Toggle auto reply feature",
    category: "settings",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, isOwner, reply }) => {
    try {
        // Owner-only access
        if (!isOwner) {
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

        const action = args[0]?.toLowerCase();
        let statusText = "";
        let reaction = "🤖";

        if (action === "on" || action === "enable") {
            config.AUTO_REPLY = true;
            statusText = `╔════════════════════╗
║   ✅ ᴀᴜᴛᴏ ʀᴇᴘʟʏ ᴇɴᴀʙʟᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ᴀᴜᴛᴏ ʀᴇᴘʟʏ ɪꜱ ɴᴏᴡ ᴀᴄᴛɪᴠᴇ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;
            reaction = "✅";
        } 
        else if (action === "off" || action === "disable") {
            config.AUTO_REPLY = false;
            statusText = `╔════════════════════╗
║   ❌ ᴀᴜᴛᴏ ʀᴇᴘʟʏ ᴅɪꜱᴀʙʟᴇᴅ ❌
╚════════════════════╝

┌─── ✦﹒ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ᴀᴜᴛᴏ ʀᴇᴘʟʏ ɪꜱ ɴᴏᴡ ɪɴᴀᴄᴛɪᴠᴇ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;
            reaction = "❌";
        } 
        else {
            // Show current status
            const currentStatus = (config.AUTO_REPLY === 'true' || config.AUTO_REPLY === true) ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪꜱᴀʙʟᴇᴅ ❌";
            
            return await conn.sendMessage(from, { 
                text: `╔════════════════════╗
║   🤖 ᴀᴜᴛᴏ ʀᴇᴘʟʏ ꜱᴛᴀᴛᴜꜱ 🤖
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀᴜᴛᴏʀᴇᴘʟʏ ᴏɴ*
│ 2️⃣ *.ᴀᴜᴛᴏʀᴇᴘʟʏ ᴏꜰꜰ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        // Send status message
        await conn.sendMessage(from, { 
            text: statusText, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // React to original command
        await conn.sendMessage(from, {
            react: { text: reaction, key: mek.key }
        });

    } catch (error) {
        console.error("❌ Auto Reply Command Error:", error);
        await conn.sendMessage(from, { 
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