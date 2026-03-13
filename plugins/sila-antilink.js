const { cmd } = require("../command");
const config = require("../config");

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

// Memory for warnings
const userWarnings = new Set();
const warningCount = {};

// === Anti-Link Event Handler ===
cmd({ on: "body" }, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
  try {
    // Basic checks: Only groups, no admins, no owner, must be enabled
    if (!isGroup || isAdmins || isOwner || !config.ANTI_LINK) return;

    // Accurate Regex for ALL links (http, https, www, and domains like .com, .net, .ke, etc.)
    const linkRegex = /((https?:\/\/|www\.)[^\s]+|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?)/gi;

    if (linkRegex.test(body)) {
      const mode = config.ANTILINK_MODE || 'delete';

      // 1. Delete the message first
      await client.sendMessage(from, { delete: message.key });

      // 2. Handle Actions (Warn, Kick, or just Delete)
      if (mode === 'warn') {
        warningCount[sender] = (warningCount[sender] || 0) + 1;
        
        if (warningCount[sender] >= 3) {
          await client.sendMessage(from, { 
            text: `╔════════════════════╗
║   🚫 ᴀɴᴛɪ-ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀ ʀᴇᴍᴏᴠᴇᴅ﹒✦ ───┐
│ 👤 @${sender.split("@")[0]}
│ ⚠️ ʀᴇᴀᴄʜᴇᴅ 3/3 ᴡᴀʀɴɪɴɢꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: message });
          await client.groupParticipantsUpdate(from, [sender], "remove");
          delete warningCount[sender];
        } else {
          await client.sendMessage(from, { 
            text: `╔════════════════════╗
║   ⚠️ ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ ⚠️
╚════════════════════╝

┌─── ✦﹒ᴡᴀʀɴɪɴɢ ɪɴꜰᴏ﹒✦ ───┐
│ 👤 ᴜꜱᴇʀ: @${sender.split("@")[0]}
│ 📊 ᴡᴀʀɴɪɴɢ: ${warningCount[sender]}/3
└────────────────────┘

🚫 ꜱᴇɴᴅɪɴɢ ʟɪɴᴋꜱ ɪꜱ ꜱᴛʀɪᴄᴛʟʏ ᴘʀᴏʜɪʙɪᴛᴇᴅ!

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: message });
        }
      } 
      
      else if (mode === 'kick') {
        await client.sendMessage(from, { 
          text: `╔════════════════════╗
║   🚫 ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀ ᴋɪᴄᴋᴇᴅ﹒✦ ───┐
│ 👤 @${sender.split("@")[0]}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`, 
          mentions: [sender],
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: message });
        await client.groupParticipantsUpdate(from, [sender], "remove");
      } 
      
      else {
        // Mode: Delete only
        await client.sendMessage(from, { 
          text: `╔════════════════════╗
║   🚫 ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ᴍᴇꜱꜱᴀɢᴇ ʀᴇᴍᴏᴠᴇᴅ﹒✦ ───┐
│ 📌 ʟɪɴᴋꜱ ᴀʀᴇ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ ʜᴇʀᴇ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: message });
      }
    }
  } catch (error) {
    console.error("❌ Anti-link handler error:", error);
  }
});

// === Anti-Link Command ===
cmd({
  pattern: "antilink",
  alias: ["alink", "blocklink"],
  desc: "Toggle and configure link blocking",
  category: "group",
  react: "🔗",
  filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
  try {
    if (!isGroup) {
      return await client.sendMessage(from, { 
        text: `╔════════════════════╗
║   ❌ ɢʀᴏᴜᴘ ᴏɴʟʏ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: message });
    }
    
    if (!isAdmins && !isOwner) {
      return await client.sendMessage(from, { 
        text: `╔════════════════════╗
║   🚫 ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ 🚫
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴀᴅᴍɪɴ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        mentions: [sender],
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: message });
    }

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "🔗", additionalInfo = "";

    switch (action) {
      case 'on':
        config.ANTI_LINK = true;
        statusText = "╔════════════════════╗\n║   ✅ ᴀɴᴛɪ-ʟɪɴᴋ ᴇɴᴀʙʟᴇᴅ ✅\n╚════════════════════╝";
        reaction = "✅";
        additionalInfo = "🛡️ ᴀʟʟ ʟɪɴᴋꜱ ᴡɪʟʟ ɴᴏᴡ ʙᴇ ᴍᴏɴɪᴛᴏʀᴇᴅ";
        break;

      case 'off':
        config.ANTI_LINK = false;
        statusText = "╔════════════════════╗\n║   ❌ ᴀɴᴛɪ-ʟɪɴᴋ ᴅɪꜱᴀʙʟᴇᴅ ❌\n╚════════════════════╝";
        reaction = "❌";
        additionalInfo = "🔓 ʟɪɴᴋꜱ ᴀʀᴇ ɴᴏᴡ ᴀʟʟᴏᴡᴇᴅ ɪɴ ᴛʜɪꜱ ɢʀᴏᴜᴘ";
        break;

      case 'warn':
      case 'kick':
      case 'delete':
        config.ANTI_LINK = true;
        config.ANTILINK_MODE = action;
        statusText = `╔════════════════════╗\n║   ⚙️ ᴍᴏᴅᴇ ꜱᴇᴛ ᴛᴏ ${action.toUpperCase()} ⚙️\n╚════════════════════╝`;
        reaction = "🛡️";
        additionalInfo = `🚫 ʙᴏᴛ ᴡɪʟʟ ɴᴏᴡ ${action} ᴜꜱᴇʀꜱ ꜱᴇɴᴅɪɴɢ ʟɪɴᴋꜱ`;
        break;

      default:
        const currentStatus = config.ANTI_LINK ? "✅ ᴇɴᴀʙʟᴇᴅ" : "❌ ᴅɪꜱᴀʙʟᴇᴅ";
        statusText = `╔════════════════════╗
║   🔗 ᴀɴᴛɪ-ʟɪɴᴋ ꜱᴛᴀᴛᴜꜱ 🔗
╚════════════════════╝

┌─── ✦﹒ᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ﹒✦ ───┐
│ 📌 ${currentStatus}
│ ⚙️ ᴍᴏᴅᴇ: ${config.ANTILINK_MODE || 'delete'}
└────────────────────┘

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ᴀɴᴛɪʟɪɴᴋ ᴏɴ/ᴏꜰꜰ*
│ 2️⃣ *.ᴀɴᴛɪʟɪɴᴋ ᴡᴀʀɴ*
│ 3️⃣ *.ᴀɴᴛɪʟɪɴᴋ ᴋɪᴄᴋ*
│ 4️⃣ *.ᴀɴᴛɪʟɪɴᴋ ᴅᴇʟᴇᴛᴇ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

        // Send status message
        await client.sendMessage(from, {
          text: statusText,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363402325089913@newsletter',
              newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
              serverMessageId: 143
            }
          }
        }, { quoted: message });

        // React to original command
        await client.sendMessage(from, {
          react: { text: "ℹ️", key: message.key }
        });
        return;
    }

    // Send combined image + newsletter style message
    await client.sendMessage(from, {
      image: { url: "https://files.catbox.moe/kiy0hl.jpg" },
      caption: `
${statusText}

┌─── ✦﹒ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ﹒✦ ───┐
│ 📌 ${additionalInfo}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨
      `,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402325089913@newsletter',
          newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
          serverMessageId: 143
        }
      }
    }, { quoted: message });

    // React to original command
    await client.sendMessage(from, {
      react: { text: reaction, key: message.key }
    });

  } catch (error) {
    console.error("❌ Anti-link command error:", error);
    await client.sendMessage(from, { 
      text: `╔════════════════════╗
║   ❌ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
      mentions: [sender],
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: message });
  }
});