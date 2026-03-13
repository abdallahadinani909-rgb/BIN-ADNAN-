const { cmd } = require('../command');
const axios = require('axios');
const ytdl = require('ytdl-core');
const fs = require('fs-extra');

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

// 1. YT-DL API (Alternative working API)
cmd({
    pattern: "song",
    alias: ["ytmp3", "mp3"],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "song",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ꜱᴏɴɢ [song name]*
📌 *.ꜱᴏɴɢ https://youtu.be/xxxx*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ꜱᴇᴀʀᴄʜɪɴɢ... 🔍
╚════════════════════╝

⏳ ᴛᴀꜰᴜᴛᴀ ᴡɪᴍʙᴏ: *${args.join(' ')}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Search for song using YouTube search API
    const searchQuery = args.join(' ');
    const searchApi = `https://weebapi.onrender.com/api/ytsearch?query=${encodeURIComponent(searchQuery)}&apikey=weebdev`;
    
    const searchRes = await axios.get(searchApi);
    const results = searchRes.data.result;
    
    if (!results || results.length === 0) {
        return reply('❌ ʜᴀᴋᴜᴘᴀᴛɪᴋᴀɴᴀ ᴡɪᴍʙᴏ');
    }

    const video = results[0];
    const videoUrl = video.url;

    // Try different working APIs
    const apis = [
        `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`,
        `https://restapi.dhinesh.workers.dev/yt?url=${encodeURIComponent(videoUrl)}&type=mp3`,
        `https://api.shamix4545.my.id/api/download/ytmp3?url=${encodeURIComponent(videoUrl)}`
    ];

    let downloadUrl = null;
    let apiError = null;

    for (const api of apis) {
        try {
            const res = await axios.get(api);
            if (res.data && res.data.status === true) {
                downloadUrl = res.data.result?.downloadUrl || res.data.download?.url || res.data.url;
                if (downloadUrl) break;
            }
        } catch (e) {
            apiError = e;
            continue;
        }
    }

    if (!downloadUrl) {
        return reply('❌ ᴀᴘɪ ᴢᴏᴛᴇ ʜᴀᴢɪꜰᴀɴʏɪ ᴋᴀᴢɪ. ᴊᴀʀʙᴜ ᴛᴇɴᴀ ʙᴀᴀᴅᴀᴇ');
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎵 ᴡɪᴍʙᴏ ɪᴍᴇᴘᴀᴛɪᴋᴀ 🎵
╚════════════════════╝

┌─── ✦﹒ᴛᴀᴀʀɪꜰᴀ﹒✦ ───┐
│ 📝 ᴊɪɴᴀ: ${video.title}
│ ⏱ ᴍᴜᴅᴀ: ${video.duration}
└────────────────────┘

⏳ ɪɴᴀᴘᴀᴋɪʟɪᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Download and send audio
    const audioStream = await axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'stream'
    });

    await conn.sendMessage(from, {
        audio: audioStream.data,
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`,
        caption: `╔════════════════════╗
║   🎵 ᴡɪᴍʙᴏ ʏᴀᴋᴏ 🎵
╚════════════════════╝

📌 *ᴊɪɴᴀ:* ${video.title}
📌 *ᴍᴜᴅᴀ:* ${video.duration}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴋᴏꜱᴀ: ${e.message}`);
}
});

// 2. SPOTIFY DOWNLOAD (via spotify-downloader)
cmd({
    pattern: "spotify",
    alias: ["sp", "spotifydl"],
    react: "🎧",
    desc: "Download song from Spotify",
    category: "song",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ꜱᴘᴏᴛɪꜰʏ [song name]*
📌 *.ꜱᴘᴏᴛɪꜰʏ https://open.spotify.com/track/xxxx*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const query = args.join(' ');
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ɪɴᴀᴛᴀꜰᴜᴛᴀ... 🔍
╚════════════════════╝

⏳ ᴛᴀꜰᴜᴛᴀ ᴡɪᴍʙᴏ ᴋᴜᴛᴏᴋᴀ ꜱᴘᴏᴛɪꜰʏ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Using public Spotify API
    const api = `https://api.shamix4545.my.id/api/search/spotify?query=${encodeURIComponent(query)}`;
    const searchRes = await axios.get(api);
    
    if (!searchRes.data || !searchRes.data.result || searchRes.data.result.length === 0) {
        return reply('❌ ʜᴀᴋᴜᴘᴀᴛɪᴋᴀɴᴀ ᴡɪᴍʙᴏ');
    }

    const song = searchRes.data.result[0];
    
    // Get download link
    const downloadApi = `https://api.shamix4545.my.id/api/download/spotify?url=${encodeURIComponent(song.url)}`;
    const downloadRes = await axios.get(downloadApi);
    
    if (!downloadRes.data || !downloadRes.data.result || !downloadRes.data.result.downloadUrl) {
        return reply('❌ ʜᴀɪᴋᴜᴡᴇᴢᴀ ᴋᴜᴘᴀᴛᴀ ʟɪɴᴋ ʏᴀ ᴋᴜᴘᴀᴋɪʟɪᴀ');
    }

    const downloadUrl = downloadRes.data.result.downloadUrl;

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎧 ꜱᴘᴏᴛɪꜰʏ ᴛʀᴀᴄᴋ 🎧
╚════════════════════╝

┌─── ✦﹒ᴛᴀᴀʀɪꜰᴀ﹒✦ ───┐
│ 📝 ᴊɪɴᴀ: ${song.title}
│ 👤 ᴍꜱᴀɴɪɪ: ${song.artist}
│ 💿 ᴀʟʙᴜᴍ: ${song.album}
└────────────────────┘

⏳ ɪɴᴀᴘᴀᴋɪʟɪᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Download and send audio
    const audioStream = await axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'stream'
    });

    await conn.sendMessage(from, {
        audio: audioStream.data,
        mimetype: 'audio/mpeg',
        fileName: `${song.title} - ${song.artist}.mp3`,
        caption: `╔════════════════════╗
║   🎧 ꜰʀᴏᴍ ꜱᴘᴏᴛɪꜰʏ 🎧
╚════════════════════╝

📌 *ᴊɪɴᴀ:* ${song.title}
📌 *ᴍꜱᴀɴɪɪ:* ${song.artist}
📌 *ᴀʟʙᴜᴍ:* ${song.album}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴋᴏꜱᴀ: ${e.message}`);
}
});

// 3. SOUNDCLOUD DOWNLOAD
cmd({
    pattern: "soundcloud",
    alias: ["sc", "scdl"],
    react: "☁️",
    desc: "Download song from SoundCloud",
    category: "song",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ꜱᴏᴜɴᴅᴄʟᴏᴜᴅ [song name]*
📌 *.ꜱᴏᴜɴᴅᴄʟᴏᴜᴅ https://soundcloud.com/xxxx*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const query = args.join(' ');
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   ☁️ ꜱᴇᴀʀᴄʜɪɴɢ... ☁️
╚════════════════════╝

⏳ ᴛᴀꜰᴜᴛᴀ ᴡɪᴍʙᴏ ᴋᴜᴛᴏᴋᴀ ꜱᴏᴜɴᴅᴄʟᴏᴜᴅ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Using SoundCloud API
    const api = `https://api.shamix4545.my.id/api/search/soundcloud?query=${encodeURIComponent(query)}`;
    const searchRes = await axios.get(api);
    
    if (!searchRes.data || !searchRes.data.result || searchRes.data.result.length === 0) {
        return reply('❌ ʜᴀᴋᴜᴘᴀᴛɪᴋᴀɴᴀ ᴡɪᴍʙᴏ');
    }

    const track = searchRes.data.result[0];
    
    // Get download link
    const downloadApi = `https://api.shamix4545.my.id/api/download/soundcloud?url=${encodeURIComponent(track.url)}`;
    const downloadRes = await axios.get(downloadApi);
    
    if (!downloadRes.data || !downloadRes.data.result || !downloadRes.data.result.downloadUrl) {
        return reply('❌ ʜᴀɪᴋᴜᴡᴇᴢᴀ ᴋᴜᴘᴀᴛᴀ ʟɪɴᴋ ʏᴀ ᴋᴜᴘᴀᴋɪʟɪᴀ');
    }

    await conn.sendMessage(from, {
        image: { url: track.thumbnail },
        caption: `╔════════════════════╗
║   ☁️ ꜱᴏᴜɴᴅᴄʟᴏᴜᴅ ᴛʀᴀᴄᴋ ☁️
╚════════════════════╝

┌─── ✦﹒ᴛᴀᴀʀɪꜰᴀ﹒✦ ───┐
│ 📝 ᴊɪɴᴀ: ${track.title}
│ 👤 ᴍꜱᴀɴɪɪ: ${track.artist}
│ ⏱ ᴍᴜᴅᴀ: ${track.duration}
└────────────────────┘

⏳ ɪɴᴀᴘᴀᴋɪʟɪᴀ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Download and send audio
    const audioStream = await axios({
        method: 'get',
        url: downloadRes.data.result.downloadUrl,
        responseType: 'stream'
    });

    await conn.sendMessage(from, {
        audio: audioStream.data,
        mimetype: 'audio/mpeg',
        fileName: `${track.title} - ${track.artist}.mp3`,
        caption: `╔════════════════════╗
║   ☁️ ꜰʀᴏᴍ ꜱᴏᴜɴᴅᴄʟᴏᴜᴅ ☁️
╚════════════════════╝

📌 *ᴊɪɴᴀ:* ${track.title}
📌 *ᴍꜱᴀɴɪɪ:* ${track.artist}
📌 *ᴍᴜᴅᴀ:* ${track.duration}

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴋᴏꜱᴀ: ${e.message}`);
}
});

// 4. LYRIC FINDER
cmd({
    pattern: "lyrics",
    alias: ["lyric", "mashairi"],
    react: "📝",
    desc: "Find song lyrics",
    category: "song",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ʟʏʀɪᴄꜱ [song name] [artist]*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const query = args.join(' ');
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ꜱᴇᴀʀᴄʜɪɴɢ ʟʏʀɪᴄꜱ... 🔍
╚════════════════════╝

⏳ ᴛᴀꜰᴜᴛᴀ ᴍᴀꜱʜᴀɪʀɪ ʏᴀ: *${query}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Using lyrics API
    const api = `https://api.lyrics.ovh/v1/${encodeURIComponent(query.split(' ').slice(1).join(' '))}/${encodeURIComponent(query.split(' ')[0])}`;
    
    try {
        const lyricsRes = await axios.get(api);
        const lyrics = lyricsRes.data.lyrics;
        
        if (!lyrics) {
            return reply('❌ ʜᴀᴋᴜᴘᴀᴛɪᴋᴀɴᴀ ᴍᴀꜱʜᴀɪʀɪ');
        }

        // Truncate if too long
        const truncatedLyrics = lyrics.length > 3000 ? lyrics.substring(0, 3000) + '...' : lyrics;

        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   📝 ꜱᴏɴɢ ʟʏʀɪᴄꜱ 📝
╚════════════════════╝

┌─── ✦﹒ꜱᴏɴɢ﹒✦ ───┐
│ 🎵 ${query}
└────────────────────┘

┌─── ✦﹒ʟʏʀɪᴄꜱ﹒✦ ───┐
│ ${truncatedLyrics}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (lyricsError) {
        // Fallback to alternative lyrics API
        const fallbackApi = `https://weebapi.onrender.com/api/lyrics?query=${encodeURIComponent(query)}&apikey=weebdev`;
        const fallbackRes = await axios.get(fallbackApi);
        
        if (fallbackRes.data && fallbackRes.data.result) {
            const lyrics = fallbackRes.data.result.lyrics;
            const truncatedLyrics = lyrics.length > 3000 ? lyrics.substring(0, 3000) + '...' : lyrics;

            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   📝 ꜱᴏɴɢ ʟʏʀɪᴄꜱ 📝
╚════════════════════╝

┌─── ✦﹒ꜱᴏɴɢ﹒✦ ───┐
│ 🎵 ${fallbackRes.data.result.title}
│ 👤 ${fallbackRes.data.result.artist}
└────────────────────┘

┌─── ✦﹒ʟʏʀɪᴄꜱ﹒✦ ───┐
│ ${truncatedLyrics}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } else {
            reply('❌ ʜᴀᴋᴜᴘᴀᴛɪᴋᴀɴᴀ ᴍᴀꜱʜᴀɪʀɪ ʏᴀ ᴡɪᴍʙᴏ ʜɪʏᴏ');
        }
    }

} catch (e) {
    console.log(e);
    reply(`❌ ᴋᴏꜱᴀ: ${e.message}`);
}
});

// 5. SHAZAM / SONG IDENTIFIER
cmd({
    pattern: "shazam",
    alias: ["identify", "whatsong"],
    react: "🔍",
    desc: "Identify song from audio",
    category: "song",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply, quoted}) => {
try{
    if (!m.quoted || !m.quoted.message || (!m.quoted.message.audioMessage && !m.quoted.message.videoMessage && !m.quoted.message.documentMessage)) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ᴀᴜᴅɪᴏ/ᴠɪᴅᴇᴏ ᴡɪᴛʜ *.ꜱʜᴀᴢᴀᴍ*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🔍 ɪᴅᴇɴᴛɪꜰʏɪɴɢ ꜱᴏɴɢ... 🔍
╚════════════════════╝

⏳ ᴛᴀꜰᴜᴛᴀ ᴊɪɴᴀ ʟᴀ ᴡɪᴍʙᴏ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Download the audio/video
    const buffer = await m.quoted.download();
    
    // Save temporarily
    const tempFile = `./temp/${Date.now()}.mp3`;
    fs.writeFileSync(tempFile, buffer);

    // Using ACRCloud or similar API (simplified - you'll need actual API)
    // For demo, using a free song recognition API
    const formData = new FormData();
    formData.append('audio', buffer, 'audio.mp3');
    
    try {
        // Note: This is a placeholder. You'll need a real song recognition API key
        // Example using Audd.io API (you need to sign up for API key)
        const apiToken = 'YOUR_AUDD_API_KEY'; // Get from https://audd.io/
        
        const response = await axios.post('https://api.audd.io/', formData, {
            params: { api_token: apiToken, return: 'apple_music,spotify' },
            headers: formData.getHeaders()
        });

        if (response.data && response.data.result) {
            const result = response.data.result;
            
            await conn.sendMessage(from, {
                text: `╔════════════════════╗
║   🎵 ꜱᴏɴɢ ɪᴅᴇɴᴛɪꜰɪᴇᴅ 🎵
╚════════════════════╝

┌─── ✦﹒ᴛᴀᴀʀɪꜰᴀ﹒✦ ───┐
│ 📝 ᴊɪɴᴀ: ${result.title}
│ 👤 ᴍꜱᴀɴɪɪ: ${result.artist}
│ 💿 ᴀʟʙᴜᴍ: ${result.album || 'Unknown'}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } else {
            reply('❌ ʜᴀɪᴋᴜᴛᴀᴍʙᴜʟɪᴋᴀɴᴀ ᴡɪᴍʙᴏ');
        }

    } catch (identifyError) {
        console.log(identifyError);
        
        // Fallback message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ⚠️ ɴᴏᴛ ɪᴅᴇɴᴛɪꜰɪᴇᴅ ⚠️
╚════════════════════╝

❌ ʜᴀɪᴋᴜᴡᴇᴢᴀ ᴋᴜᴛᴀᴍʙᴜᴀ ᴡɪᴍʙᴏ.
ᴊᴀʀʙᴜ ᴋᴜᴛᴜᴍᴀ ᴋʟɪᴘ ᴍꜰᴜᴘɪ ɪɴᴀʏᴏꜱɪᴋɪᴋᴀ ᴡᴇᴢᴀ.

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    // Clean up temp file
    fs.unlinkSync(tempFile);

} catch (e) {
    console.log(e);
    reply(`❌ ᴋᴏꜱᴀ: ${e.message}`);
}
});

// 6. PLAYLIST (Song recommendation)
cmd({
    pattern: "playlist",
    alias: ["recommend", "similar"],
    react: "🎶",
    desc: "Get song recommendations",
    category: "song",
    filename: __filename
},
async(conn, mek, m, {from, sender, args, reply}) => {
try{
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `╭━━━⚠️━━━╮
┃ ᴜꜱᴀɢᴇ
╰━━━━━━━━╯

📌 *.ᴘʟᴀʏʟɪꜱᴛ [song name]*
📌 *.ʀᴇᴄᴏᴍᴍᴇɴᴅ [artist]*

✦ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const query = args.join(' ');
    
    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎶 ʙᴜɪʟᴅɪɴɢ ᴘʟᴀʏʟɪꜱᴛ... 🎶
╚════════════════════╝

⏳ ᴛᴀꜰᴜᴛᴀ ᴡɪᴍʙᴏ ᴢɪɴᴀᴢᴏꜰᴀɴᴀ ɴᴀ: *${query}*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    // Search for similar songs
    const api = `https://weebapi.onrender.com/api/ytsearch?query=${encodeURIComponent(query)}&apikey=weebdev`;
    const searchRes = await axios.get(api);
    
    if (!searchRes.data || !searchRes.data.result || searchRes.data.result.length < 3) {
        return reply('❌ ʜᴀᴋᴜᴘᴀᴛɪᴋᴀɴᴀ ᴡɪᴍʙᴏ ᴢᴀ ᴋᴜᴛᴏꜱʜᴀ');
    }

    const results = searchRes.data.result.slice(0, 5); // Top 5 results
    
    let playlistText = '';
    results.forEach((song, index) => {
        playlistText += `   ${index + 1}. 🎵 ${song.title}\n   ⏱️ ${song.duration}\n\n`;
    });

    await conn.sendMessage(from, {
        text: `╔════════════════════╗
║   🎶 ʏᴏᴜʀ ᴘʟᴀʏʟɪꜱᴛ 🎶
╚════════════════════╝

┌─── ✦﹒ʙᴀꜱᴇᴅ ᴏɴ﹒✦ ───┐
│ 📝 ${query}
└────────────────────┘

┌─── ✦﹒ʀᴇᴄᴏᴍᴍᴇɴᴅᴇᴅ﹒✦ ───┐
${playlistText}
└────────────────────┘

📌 ᴅᴏᴡɴʟᴏᴀᴅ ᴡɪᴛʜ: *.ꜱᴏɴɢ [ɴᴜᴍʙᴇʀ]*

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✦`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`❌ ᴋᴏꜱᴀ: ${e.message}`);
}
});