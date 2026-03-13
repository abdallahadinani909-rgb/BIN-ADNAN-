const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const getContextInfo = (m, botName) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '✨ 𝐁𝐈𝐍-𝐀𝐃𝐍𝐀𝐍 ✨',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `✨ ${botName}`,
            body: `📊 ɢʀᴏᴜᴘ ꜱᴛᴀᴛᴜꜱ ꜱʏꜱᴛᴇᴍ`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: cfg.logo || 'https://files.catbox.moe/chzcqk.jpeg',
            sourceUrl: "https://github.com/binadnan",
            renderLargerThumbnail: false,
        }
    };
};

module.exports = {
    name: 'gstatus',
    aliases: ['groupstatus', 'gs'],
    async execute(socket, msg, number, config, loadUserConfigFromMongo, activeSockets, socketCreationTime, extras) {
        const { isGroup, from, sender } = extras;
        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};
        const botName = cfg.botName || 'ʙɪɴ-ᴀᴅɴᴀɴ';

        // 1. Group Validation
        if (!isGroup) {
            return socket.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ɢʀᴏᴜᴘ ᴏɴʟʏ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪꜱ ᴏɴʟʏ ꜰᴏʀ ɢʀᴏᴜᴘꜱ
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender }, botName)
            });
        }

        try {
            // 2. Identify Media/Text
            const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage || null;
            const messageToProcess = quoted ? quoted : msg.message;
            const type = Object.keys(messageToProcess)[0];
            const mime = messageToProcess[type]?.mimetype || '';
            
            const body = (msg.message.conversation || msg.message.extendedTextMessage?.text || "");
            const caption = body.replace(new RegExp(`^\\${config.PREFIX}(gstatus|groupstatus|gs)\\s*`, 'i'), '').trim();

            const defaultCaption = `╔════════════════════╗
║   ⚡ ɢʀᴏᴜᴘ ꜱᴛᴀᴛᴜꜱ ⚡
╚════════════════════╝

✨ ᴜᴘʟᴏᴀᴅᴇᴅ ᴠɪᴀ ${botName}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

            // Helper to download media
            const downloadMedia = async (message, type) => {
                const stream = await downloadContentFromMessage(message, type.replace('Message', ''));
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                return buffer;
            };

            // Send processing message
            await socket.sendMessage(from, {
                text: `╔════════════════════╗
║   🔄 ᴘʀᴏᴄᴇꜱꜱɪɴɢ... 🔄
╚════════════════════╝

⏳ ᴘʀᴇᴘᴀʀɪɴɢ ɢʀᴏᴜᴘ ꜱᴛᴀᴛᴜꜱ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender }, botName)
            });

            // 3. Execution Logic
            if (/image/.test(mime)) {
                const buffer = await downloadMedia(messageToProcess[type], 'image');
                await socket.sendMessage(from, { 
                    groupStatusMessage: { 
                        image: buffer, 
                        caption: caption || defaultCaption 
                    } 
                });
            } else if (/video/.test(mime)) {
                const buffer = await downloadMedia(messageToProcess[type], 'video');
                await socket.sendMessage(from, { 
                    groupStatusMessage: { 
                        video: buffer, 
                        caption: caption || defaultCaption 
                    } 
                });
            } else if (/audio/.test(mime)) {
                const buffer = await downloadMedia(messageToProcess[type], 'audio');
                await socket.sendMessage(from, { 
                    groupStatusMessage: { 
                        audio: buffer, 
                        mimetype: 'audio/mp4',
                        caption: caption || defaultCaption
                    } 
                });
            } else if (caption) {
                await socket.sendMessage(from, { 
                    groupStatusMessage: { 
                        text: caption 
                    } 
                });
            } else {
                return socket.sendMessage(from, { 
                    text: `╔════════════════════╗
║   ⚠️ ᴜꜱᴀɢᴇ ⚠️
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 📌 ʀᴇᴘʟʏ ᴛᴏ ᴍᴇᴅɪᴀ ᴡɪᴛʜ *.ɢꜱᴛᴀᴛᴜꜱ*
│ 📌 ᴏʀ ᴛʏᴘᴇ: *.ɢꜱᴛᴀᴛᴜꜱ ʏᴏᴜʀ ᴛᴇxᴛ*
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                    contextInfo: getContextInfo({ sender }, botName)
                });
            }

            // 4. Success Response with Styling
            const mediaType = mime ? mime.split('/')[0].toUpperCase() : 'TEXT';
            const successText = `╔════════════════════╗
║   ✅ ꜱᴛᴀᴛᴜꜱ ʙʀᴏᴀᴅᴄᴀꜱᴛᴇᴅ ✅
╚════════════════════╝

┌─── ✦﹒ᴜᴘʟᴏᴀᴅ ʀᴇᴘᴏʀᴛ﹒✦ ───┐
│ 📁 ᴛʏᴘᴇ: ${mediaType}
│ 📤 ꜱᴛᴀᴛᴜꜱ: ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟ
│ ⏱️ ᴛɪᴍᴇ: ${new Date().toLocaleString()}
└────────────────────┘

✨ ʏᴏᴜʀ ꜱᴛᴀᴛᴜꜱ ɪꜱ ɴᴏᴡ ʟɪᴠᴇ ɪɴ ᴛʜᴇ ɢʀᴏᴜᴘ

⚡ ᴛʜᴀɴᴋꜱ ꜰᴏʀ ᴜꜱɪɴɢ ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

            await socket.sendMessage(from, {
                text: successText,
                contextInfo: getContextInfo({ sender }, botName)
            });

        } catch (error) {
            console.error("GStatus Error:", error);
            await socket.sendMessage(from, { 
                text: `╔════════════════════╗
║   ❌ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender }, botName)
            });
        }
    }
};