const { cmd } = require('../command');

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

// 1. GROUP INFO COMMAND
cmd({
    pattern: "groupinfo",
    alias: ["ginfo", "infogroup"],
    react: "ℹ️",
    desc: "Get group information",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, sender, groupMetadata, groupAdmins, participants, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    const groupName = groupMetadata.subject || "No name";
    const groupDesc = groupMetadata.desc || "No description";
    const groupSize = participants.length;
    const adminCount = groupAdmins.length;
    const groupCreation = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    const groupId = from.split('@')[0];

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   📊 ɢʀᴏᴜᴘ ɪɴꜰᴏ 📊
╚════════════════════╝

┌─── ✦﹒ʙᴀꜱɪᴄ﹒✦ ───┐
│ 📛 *ɴᴀᴍᴇ:* ${groupName}
│ 🆔 *ɪᴅ:* ${groupId}
│ 📅 *ᴄʀᴇᴀᴛᴇᴅ:* ${groupCreation}
└────────────────────┘

┌─── ✦﹒ꜱᴛᴀᴛꜱ﹒✦ ───┐
│ 👥 *ᴛᴏᴛᴀʟ:* ${groupSize} ᴍᴇᴍʙᴇʀꜱ
│ 👑 *ᴀᴅᴍɪɴꜱ:* ${adminCount}
└────────────────────┘

┌─── ✦﹒ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ﹒✦ ───┐
│ 📝 ${groupDesc}
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 2. TAG ALL MEMBERS COMMAND
cmd({
    pattern: "tagall",
    alias: ["everyone", "mentionall", "all"],
    react: "📢",
    desc: "Tag all group members",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, sender, participants, reply, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴏɴʟʏ ᴀᴅᴍɪɴꜱ ᴄᴀɴ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    let message = args.join(' ') || 'ʜᴇʟʟᴏ ᴇᴠᴇʀʏᴏɴᴇ! 📢';
    let mentions = [];
    let mentionText = '';

    for (let participant of participants) {
        mentions.push(participant.id);
        mentionText += `@${participant.id.split('@')[0]} `;
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   📢 ᴍᴇɴᴛɪᴏɴ ᴀʟʟ 📢
╚════════════════════╝

📝 *ᴍᴇꜱꜱᴀɢᴇ:* ${message}

┌─── ✦﹒ᴍᴇᴍʙᴇʀꜱ﹒✦ ───┐
│ ${mentionText}
└────────────────────┘
👥 ᴛᴏᴛᴀʟ: ${participants.length} ᴍᴇᴍʙᴇʀꜱ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 3. KICK/REMOVE COMMAND
cmd({
    pattern: "kick",
    alias: ["remove", "ban"],
    react: "👢",
    desc: "Remove member from group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, isBotAdmins, sender, participants, groupAdmins, reply, quoted}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ʏᴏᴜ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isBotAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ʙᴏᴛ ɴᴇᴇᴅꜱ ᴛᴏ ʙᴇ ᴀᴅᴍɪɴ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    let usersToKick = [];

    if (m.quoted && m.quoted.sender) {
        usersToKick.push(m.quoted.sender);
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToKick = m.mentionedJid;
    } else {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮\n┃ ᴀᴄᴛɪᴏɴ\n╰━━━━━━━━╯\n\n❌ ᴛᴀɢ ᴜꜱᴇʀ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇɪʀ ᴍᴇꜱꜱᴀɢᴇ\n\n📌 ᴇxᴀᴍᴘʟᴇ: *.ᴋɪᴄᴋ @ᴜꜱᴇʀ*`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: null });
    }

    usersToKick = usersToKick.filter(user => !groupAdmins.includes(user));

    if (usersToKick.length === 0) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮\n┃ ɴᴏᴛɪᴄᴇ\n╰━━━━━━━━╯\n\n❌ ᴄᴀɴ'ᴛ ᴋɪᴄᴋ ᴀᴅᴍɪɴꜱ`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: null });
    }

    for (let user of usersToKick) {
        await conn.groupParticipantsUpdate(from, [user], 'remove');
    }

    let mentions = [];
    let mentionText = '';
    for (let user of usersToKick) {
        mentions.push(user);
        mentionText += `@${user.split('@')[0]} `;
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   👢 ᴋɪᴄᴋᴇᴅ 👢
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀꜱ﹒✦ ───┐
│ ${mentionText}
└────────────────────┘

▸ ✅ ${usersToKick.length} ᴜꜱᴇʀ(ꜱ) ʀᴇᴍᴏᴠᴇᴅ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 4. ADD COMMAND
cmd({
    pattern: "add",
    alias: ["invite"],
    react: "➕",
    desc: "Add member to group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, isBotAdmins, sender, args, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ɢʀᴏᴜᴘ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴀᴅᴍɪɴ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!args[0]) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 *.ᴀᴅᴅ 2557XXXXXXXX*\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    let number = args[0].replace(/[^0-9]/g, '');
    if (number.length < 10) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮\n┃ ɪɴᴠᴀʟɪᴅ\n╰━━━━━━━━╯\n\n❌ ɪɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: null });
    }

    let user = number + '@s.whatsapp.net';
    await conn.groupParticipantsUpdate(from, [user], 'add');

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ➕ ᴀᴅᴅᴇᴅ ➕
╚════════════════════╝

✅ @${number} ʜᴀꜱ ʙᴇᴇɴ ᴀᴅᴅᴇᴅ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: [user],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 5. GROUP LINK COMMAND
cmd({
    pattern: "grouplink",
    alias: ["link", "invitelink"],
    react: "🔗",
    desc: "Get group invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, isBotAdmins, sender, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ɢʀᴏᴜᴘ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins && !isBotAdmins) {
        return await conn.sendMessage(from, {
            text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴀᴅᴍɪɴ ᴏɴʟʏ`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: null });
    }

    const link = await conn.groupInviteCode(from);
    const inviteLink = `https://chat.whatsapp.com/${link}`;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔗 ɢʀᴏᴜᴘ ʟɪɴᴋ 🔗
╚════════════════════╝

📎 ${inviteLink}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 6. MUTE GROUP COMMAND
cmd({
    pattern: "mute",
    alias: ["lock", "close"],
    react: "🔇",
    desc: "Mute group (only admins can send messages)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, isBotAdmins, sender, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ɢʀᴏᴜᴘ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴀᴅᴍɪɴ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    await conn.groupSettingUpdate(from, 'announcement');
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔇 ɢʀᴏᴜᴘ ᴍᴜᴛᴇᴅ 🔇
╚════════════════════╝

✅ ᴏɴʟʏ ᴀᴅᴍɪɴꜱ ᴄᴀɴ ꜱᴇɴᴅ ᴍᴇꜱꜱᴀɢᴇꜱ ɴᴏᴡ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 7. UNMUTE GROUP COMMAND
cmd({
    pattern: "unmute",
    alias: ["unlock", "open"],
    react: "🔊",
    desc: "Unmute group (everyone can send messages)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, isBotAdmins, sender, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ɢʀᴏᴜᴘ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴀᴅᴍɪɴ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    await conn.groupSettingUpdate(from, 'not_announcement');
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔊 ɢʀᴏᴜᴘ ᴜɴᴍᴜᴛᴇᴅ 🔊
╚════════════════════╝

✅ ᴇᴠᴇʀʏᴏɴᴇ ᴄᴀɴ ꜱᴇɴᴅ ᴍᴇꜱꜱᴀɢᴇꜱ ɴᴏᴡ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 8. HIDE TAG COMMAND
cmd({
    pattern: "htag",
    alias: ["hidemsg", "hidetag"],
    react: "👻",
    desc: "Send hidden message to all members",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, sender, participants, args, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ɢʀᴏᴜᴘ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴀᴅᴍɪɴ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    let message = args.join(' ') || 'ʜɪᴅᴅᴇɴ ᴍᴇꜱꜱᴀɢᴇ 👻';
    let mentions = participants.map(a => a.id);

    await conn.sendMessage(from, {
        text: message,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 9. DELETE COMMAND (FOR BOT MESSAGES)
cmd({
    pattern: "del",
    alias: ["delete", "remove"],
    react: "🗑️",
    desc: "Delete bot's message",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, sender, quoted, reply}) => {
try{
    if (!m.quoted) return await conn.sendMessage(from, {
        text: `╭━━━⚠️━━━╮\n┃ ᴜꜱᴀɢᴇ\n╰━━━━━━━━╯\n\n📌 ʀᴇᴘʟʏ ᴛᴏ ʙᴏᴛ'ꜱ ᴍᴇꜱꜱᴀɢᴇ ᴡɪᴛʜ *.ᴅᴇʟ*`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    const key = {
        remoteJid: from,
        fromMe: true,
        id: m.quoted.key.id
    };

    await conn.sendMessage(from, { delete: key });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});

// 10. REVOKE GROUP LINK COMMAND
cmd({
    pattern: "revoke",
    alias: ["resetlink", "newlink"],
    react: "🔄",
    desc: "Reset group invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, isAdmins, isBotAdmins, sender, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ɢʀᴏᴜᴘ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    if (!isAdmins) return await conn.sendMessage(from, {
        text: `╭━━━❌━━━╮\n┃ ᴇʀʀᴏʀ\n╰━━━━━━━━╯\n\n❌ ᴀᴅᴍɪɴ ᴏɴʟʏ\n\n✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

    await conn.groupRevokeInvite(from);
    const newCode = await conn.groupInviteCode(from);
    const newLink = `https://chat.whatsapp.com/${newCode}`;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔄 ʟɪɴᴋ ʀᴇꜱᴇᴛ 🔄
╚════════════════════╝

📎 ɴᴇᴡ ʟɪɴᴋ: ${newLink}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: null });

} catch (e) {
    console.log(e);
    reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
}
});
