const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

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
    pattern: "song",
    alias: ["mp3", "play", "audio"],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "downloader",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, q, reply}) => {
try{
    if (!q) {
        return await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   🎵 ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 🎵
╚════════════════════╝

┌─── ✦﹒ʜᴏᴡ ᴛᴏ ᴜꜱᴇ﹒✦ ───┐
│ 1️⃣ *.ꜱᴏɴɢ ꜱʜᴀᴘᴇ ᴏꜰ ʏᴏᴜ*
│ 2️⃣ *.ꜱᴏɴɢ https://youtu.be/xxxx*
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
    
    // Send searching message
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ꜱᴇᴀʀᴄʜɪɴɢ... 🔍
╚════════════════════╝

⏳ ʟᴏᴏᴋɪɴɢ ꜰᴏʀ: *${q}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    // First, search for the song
    let videoData = null;
    let isDirectUrl = false;
    
    if (q.includes('youtube.com') || q.includes('youtu.be')) {
        // It's a direct URL
        isDirectUrl = true;
        const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        
        if (!videoId) {
            return await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ❌ ɪɴᴠᴀʟɪᴅ ʟɪɴᴋ ❌
╚════════════════════╝

📌 ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ʏᴏᴜᴛᴜʙᴇ ʟɪɴᴋ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
        
        // Search to get video info
        const search = await yts({ videoId: videoId });
        if (search) videoData = search;
    } else {
        // It's a search query
        const search = await yts(q);
        if (!search || !search.all || search.all.length === 0) {
            return await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   ❌ ɴᴏᴛ ꜰᴏᴜɴᴅ ❌
╚════════════════════╝

😕 ɴᴏ ʀᴇꜱᴜʟᴛꜱ ꜰᴏᴜɴᴅ ꜰᴏʀ: *${q}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
        
        videoData = search.all[0];
    }
    
    if (!videoData) {
        return await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ❌ ᴇʀʀᴏʀ ❌
╚════════════════════╝

😵 ᴄᴏᴜʟᴅ ɴᴏᴛ ɢᴇᴛ ᴠɪᴅᴇᴏ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
    
    const videoUrl = videoData.url;
    const title = videoData.title || 'Unknown Title';
    const thumbnail = videoData.thumbnail || videoData.image;
    const duration = videoData.timestamp || videoData.duration || 'N/A';
    const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
    
    // Send the cover art/thumbnail with song info
    await conn.sendMessage(from, {
        image: { url: thumbnail },
        caption: `╔════════════════════╗
║   🎵 ꜱᴏɴɢ ɪɴꜰᴏ 🎵
╚════════════════════╝

┌─── ✦﹒ᴅᴇᴛᴀɪʟꜱ﹒✦ ───┐
│ 📌 ᴛɪᴛʟᴇ: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}
│ ⏱️ ᴅᴜʀᴀᴛɪᴏɴ: ${duration}
│ 👀 ᴠɪᴇᴡꜱ: ${views}
└────────────────────┘

⏳ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴀᴜᴅɪᴏ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    try {
        // Try using the alternative API first
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData?.status && fallbackData.audio) {
            // Send ONLY audio file (no document)
            await conn.sendMessage(from, {
                audio: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.mp3`,
                caption: `╔════════════════════╗
║   ✅ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

🎵 *${title.substring(0, 50)}${title.length > 50 ? '...' : ''}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
            // No second message sent
            
        } else {
            // Fallback to other method
            const apiUrl = `https://api.shamix4545.my.id/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;
            
            let audioUrl = data?.result?.downloadUrl || data?.result?.url || data?.url;
            
            if (audioUrl) {
                // Send ONLY audio file (no document)
                await conn.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}.mp3`,
                    caption: `╔════════════════════╗
║   ✅ ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ✅
╚════════════════════╝

🎵 *${title.substring(0, 50)}${title.length > 50 ? '...' : ''}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
                
            } else {
                throw new Error('No audio URL found');
            }
        }
        
    } catch (error) {
        console.error('Download error:', error.message);
        
        // Send error message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ❌ ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ ❌
╚════════════════════╝

┌─── ✦﹒ʀᴇᴀꜱᴏɴ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

💡 ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ ᴏʀ ᴜꜱᴇ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ꜱᴏɴɢ

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
    
} catch (e) {
    console.log('Song Command Error:', e);
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ❌ ᴄᴏᴍᴍᴀɴᴅ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ﹒✦ ───┐
│ 📋 ${e.message}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}
});