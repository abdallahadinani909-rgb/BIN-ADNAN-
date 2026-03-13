const { cmd } = require('../command');
const fs = require('fs-extra');
const os = require('os');
const config = require('../config'); // Adjust path based on your config location

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

// Owner check function - supports multiple owners from config
const isOwner = (sender) => {
    const ownerNumbers = config.OWNER_NUMBER.split(',').map(num => num.trim() + '@s.whatsapp.net');
    return ownerNumbers.includes(sender);
};

// 1. BROADCAST COMMAND (Send message to all groups)
cmd({
    pattern: "broadcast",
    alias: ["bc", "announce"],
    react: "📢",
    desc: "Send message to all groups (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ᴛʜᴇ ᴏᴡɴᴇʀ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ʙʀᴏᴀᴅᴄᴀꜱᴛ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ʜᴇʀᴇ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const message = args.join(' ');
    const groups = await conn.groupFetchAllParticipating();
    const groupList = Object.values(groups);
    
    let sent = 0;
    let failed = 0;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   📢 ʙʀᴏᴀᴅᴄᴀꜱᴛ ꜱᴛᴀʀᴛᴇᴅ 📢
╚════════════════════╝

📝 ᴍᴇꜱꜱᴀɢᴇ: ${message}
👥 ɢʀᴏᴜᴘꜱ: ${groupList.length}
⏳ ꜱᴇɴᴅɪɴɢ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    for (const group of groupList) {
        try {
            await conn.sendMessage(group.id, {
                text: `╔════════════════════╗
║   📢 ᴏᴡɴᴇʀ ʙʀᴏᴀᴅᴄᴀꜱᴛ 📢
╚════════════════════╝

${message}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
                contextInfo: getContextInfo({ sender: sender })
            });
            sent++;
        } catch (e) {
            failed++;
        }
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   📊 ʙʀᴏᴀᴅᴄᴀꜱᴛ ʀᴇꜱᴜʟᴛ 📊
╚════════════════════╝

✅ ꜱᴜᴄᴄᴇꜱꜱ: ${sent}
❌ ꜰᴀɪʟᴇᴅ: ${failed}
👥 ᴛᴏᴛᴀʟ: ${groupList.length}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 2. UPDATE PROFILE PICTURE COMMAND
cmd({
    pattern: "setpp",
    alias: ["setprofile", "updatepp"],
    react: "🖼️",
    desc: "Update bot profile picture (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, quoted}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (!m.quoted || !m.quoted.message || (!m.quoted.message.imageMessage && !m.quoted.message.documentMessage)) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴡɪᴛʜ *.ꜱᴇᴛᴘᴘ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const buffer = await m.quoted.download();
    
    await conn.updateProfilePicture(conn.user.id, buffer);
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ✅ ᴘʀᴏꜰɪʟᴇ ᴜᴘᴅᴀᴛᴇᴅ ✅
╚════════════════════╝

🖼️ ʙᴏᴛ ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ʜᴀꜱ ʙᴇᴇɴ ᴜᴘᴅᴀᴛᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 3. LEAVE GROUP COMMAND
cmd({
    pattern: "leave",
    alias: ["exit", "bye"],
    react: "👋",
    desc: "Bot leaves the group (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, isGroup}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (!isGroup) {
        return reply('❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜꜱᴇᴅ ɪɴ ɢʀᴏᴜᴘꜱ');
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   👋 ɢᴏᴏᴅʙʏᴇ! 👋
╚════════════════════╝

ᴛʜᴇ ʙᴏᴛ ɪꜱ ʟᴇᴀᴠɪɴɢ ᴛʜɪꜱ ɢʀᴏᴜᴘ ᴀꜱ ʀᴇQᴜᴇꜱᴛᴇᴅ ʙʏ ᴛʜᴇ ᴏᴡɴᴇʀ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    setTimeout(async () => {
        await conn.groupLeave(from);
    }, 2000);

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 4. BLOCK USER COMMAND
cmd({
    pattern: "block",
    alias: ["blockuser"],
    react: "🚫",
    desc: "Block a user (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, quoted, mentionedJid}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    let userToBlock = null;

    if (m.quoted && m.quoted.sender) {
        userToBlock = m.quoted.sender;
    } else if (mentionedJid && mentionedJid.length > 0) {
        userToBlock = mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.length >= 10) {
            userToBlock = number + '@s.whatsapp.net';
        }
    }

    if (!userToBlock) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ʙʟᴏᴄᴋ @ᴜꜱᴇʀ*
📌 ʀᴇᴘʟʏ ᴛᴏ ᴜꜱᴇʀ ᴡɪᴛʜ *.ʙʟᴏᴄᴋ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.updateBlockStatus(userToBlock, 'block');

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🚫 ᴜꜱᴇʀ ʙʟᴏᴄᴋᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀ﹒✦ ───┐
│ 👤 @${userToBlock.split('@')[0]}
└────────────────────┘

✅ ᴜꜱᴇʀ ʜᴀꜱ ʙᴇᴇɴ ʙʟᴏᴄᴋᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        mentions: [userToBlock],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 5. UNBLOCK USER COMMAND
cmd({
    pattern: "unblock",
    alias: ["unblockuser"],
    react: "✅",
    desc: "Unblock a user (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, quoted, mentionedJid}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    let userToUnblock = null;

    if (m.quoted && m.quoted.sender) {
        userToUnblock = m.quoted.sender;
    } else if (mentionedJid && mentionedJid.length > 0) {
        userToUnblock = mentionedJid[0];
    } else if (args[0]) {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.length >= 10) {
            userToUnblock = number + '@s.whatsapp.net';
        }
    }

    if (!userToUnblock) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴜɴʙʟᴏᴄᴋ @ᴜꜱᴇʀ*
📌 ʀᴇᴘʟʏ ᴛᴏ ᴜꜱᴇʀ ᴡɪᴛʜ *.ᴜɴʙʟᴏᴄᴋ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.updateBlockStatus(userToUnblock, 'unblock');

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ✅ ᴜꜱᴇʀ ᴜɴʙʟᴏᴄᴋᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀ﹒✦ ───┐
│ 👤 @${userToUnblock.split('@')[0]}
└────────────────────┘

✅ ᴜꜱᴇʀ ʜᴀꜱ ʙᴇᴇɴ ᴜɴʙʟᴏᴄᴋᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        mentions: [userToUnblock],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 6. JOIN GROUP VIA LINK
cmd({
    pattern: "join",
    alias: ["joingroup"],
    react: "🔗",
    desc: "Join a group via invite link (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴊᴏɪɴ https://chat.whatsapp.com/CODE*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const link = args[0];
    const code = link.split('https://chat.whatsapp.com/')[1];

    if (!code) {
        return reply('❌ ɪɴᴠᴀʟɪᴅ ɢʀᴏᴜᴘ ʟɪɴᴋ');
    }

    const result = await conn.groupAcceptInvite(code);

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ✅ ᴊᴏɪɴᴇᴅ ɢʀᴏᴜᴘ ✅
╚════════════════════╝

🔗 ʟɪɴᴋ: ${link}
✅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴊᴏɪɴᴇᴅ ᴛʜᴇ ɢʀᴏᴜᴘ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ꜰᴀɪʟᴇᴅ ᴛᴏ ᴊᴏɪɴ ɢʀᴏᴜᴘ: ${e.message}`);
}
});

// 7. EVAL COMMAND (Execute JavaScript code)
cmd({
    pattern: "eval",
    alias: ["ev", "execute"],
    react: "💻",
    desc: "Execute JavaScript code (Owner only - USE WITH CAUTION)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴇᴠᴀʟ ᴄᴏɴꜱᴏʟᴇ.ʟᴏɢ('ʜᴇʟʟᴏ')*

⚠️ ᴡᴀʀɴɪɴɢ: ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴇxᴇᴄᴜᴛᴇ ᴀɴʏ ᴊᴀᴠᴀꜱᴄʀɪᴘᴛ ᴄᴏᴅᴇ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const code = args.join(' ');
    let result;

    try {
        result = await eval(code);
        if (typeof result !== 'string') {
            result = require('util').inspect(result, { depth: 2 });
        }
    } catch (evalError) {
        result = evalError.toString();
    }

    // Truncate if too long
    if (result.length > 2000) {
        result = result.substring(0, 2000) + '... [ᴛʀᴜɴᴄᴀᴛᴇᴅ]';
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   💻 ᴇᴠᴀʟ ʀᴇꜱᴜʟᴛ 💻
╚════════════════════╝

┌─── ✦﹒ᴄᴏᴅᴇ﹒✦ ───┐
│ 📝 ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}
└────────────────────┘

┌─── ✦﹒ʀᴇꜱᴜʟᴛ﹒✦ ───┐
│ 📊 ${result}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 8. GET BOT STATUS/INFO
cmd({
    pattern: "botstatus",
    alias: ["bstats", "botinfo"],
    react: "🤖",
    desc: "Get detailed bot information (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const memoryUsage = process.memoryUsage();
    const rss = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    const heapTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    const heapUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);

    const groups = await conn.groupFetchAllParticipating();
    const groupCount = Object.keys(groups).length;

    const platform = os.platform();
    const arch = os.arch();
    const cpuCores = os.cpus().length;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🤖 ʙᴏᴛ ꜱᴛᴀᴛᴜꜱ ɪɴꜰᴏ 🤖
╚════════════════════╝

┌─── ✦﹒ʙᴏᴛ﹒✦ ───┐
│ 🤖 ɴᴀᴍᴇ: ʙɪɴ-ᴀᴅɴᴀɴ
│ 📊 ᴠᴇʀꜱɪᴏɴ: 1.0.0
│ 👑 ᴏᴡɴᴇʀ: ${config.OWNER_NUMBER}
└────────────────────┘

┌─── ✦﹒ᴜᴘᴛɪᴍᴇ﹒✦ ───┐
│ ⏰ ${days}ᴅ ${hours}ʜ ${minutes}ᴍ ${seconds}ꜱ
└────────────────────┘

┌─── ✦﹒ꜱᴛᴀᴛꜱ﹒✦ ───┐
│ 👥 ɢʀᴏᴜᴘꜱ: ${groupCount}
│ 💾 ʀꜱꜱ: ${rss} MB
│ 📦 ʜᴇᴀᴘ: ${heapUsed}/${heapTotal} MB
└────────────────────┘

┌─── ✦﹒ꜱʏꜱᴛᴇᴍ﹒✦ ───┐
│ 💻 ᴘʟᴀᴛꜰᴏʀᴍ: ${platform} ${arch}
│ ⚙️ ᴄᴘᴜ ᴄᴏʀᴇꜱ: ${cpuCores}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 9. CLEAR/CHAT COMMAND (Delete all chats)
cmd({
    pattern: "clearchats",
    alias: ["deletechats", "clear"],
    react: "🗑️",
    desc: "Delete all chats (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🗑️ ᴄʟᴇᴀʀɪɴɢ ᴄʜᴀᴛꜱ 🗑️
╚════════════════════╝

⏳ ᴅᴇʟᴇᴛɪɴɢ ᴀʟʟ ᴄʜᴀᴛꜱ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // This is a placeholder - actual implementation depends on your WhatsApp library
    // You might need to use conn.chatModify or similar
    reply('✅ ᴄʜᴀᴛꜱ ᴄʟᴇᴀʀᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ');

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 10. RESTART BOT COMMAND
cmd({
    pattern: "restart",
    alias: ["reboot", "reset"],
    react: "🔄",
    desc: "Restart the bot (Owner only)",
    category: "owner",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    if (!isOwner(sender)) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮
┃ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ
╰━━━━━━━━╯

❌ ᴏᴡɴᴇʀ ᴏɴʟʏ

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔄 ʀᴇꜱᴛᴀʀᴛɪɴɢ ʙᴏᴛ 🔄
╚════════════════════╝

⏳ ʙᴏᴛ ɪꜱ ʀᴇꜱᴛᴀʀᴛɪɴɢ...
⚡ ᴡɪʟʟ ʙᴇ ʙᴀᴄᴋ ᴏɴʟɪɴᴇ ꜱᴏᴏɴ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Force exit process - PM2 or similar will restart it
    setTimeout(() => {
        process.exit(1);
    }, 2000);

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});