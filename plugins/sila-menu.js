const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

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
        externalAdReply: {
            title: `✨ ${config.BOT_NAME}`,
            body: `📋 ᴀᴜᴛᴏ ᴍᴇɴᴜ ꜱʏꜱᴛᴇᴍ`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://files.catbox.moe/chzcqk.jpeg', // Badilisha na picha yako
            sourceUrl: `https://github.com/binadnan`,
            renderLargerThumbnail: false,
        }
    };
};

// Function to scan all plugin files and extract commands
const scanPlugins = () => {
    const pluginsDir = path.join(__dirname, '../plugins'); // Adjust path as needed
    const categories = {};
    
    try {
        // Read all files in plugins directory
        const files = fs.readdirSync(pluginsDir);
        
        files.forEach(file => {
            if (file.endsWith('.js')) {
                try {
                    // Read file content
                    const filePath = path.join(pluginsDir, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Extract cmd patterns using regex
                    const cmdRegex = /cmd\(\s*{\s*pattern:\s*["']([^"']+)["']/g;
                    const aliasRegex = /alias:\s*\[([^\]]+)\]/g;
                    const descRegex = /desc:\s*["']([^"']+)["']/g;
                    const categoryRegex = /category:\s*["']([^"']+)["']/g;
                    const reactRegex = /react:\s*["']([^"']+)["']/g;
                    
                    let match;
                    const patterns = [];
                    const aliases = [];
                    const descriptions = [];
                    const categories_list = [];
                    const reacts = [];
                    
                    // Extract patterns
                    while ((match = cmdRegex.exec(content)) !== null) {
                        patterns.push(match[1]);
                    }
                    
                    // Extract aliases
                    while ((match = aliasRegex.exec(content)) !== null) {
                        const aliasList = match[1].split(',').map(a => a.trim().replace(/["']/g, ''));
                        aliases.push(aliasList);
                    }
                    
                    // Extract descriptions
                    while ((match = descRegex.exec(content)) !== null) {
                        descriptions.push(match[1]);
                    }
                    
                    // Extract categories
                    while ((match = categoryRegex.exec(content)) !== null) {
                        categories_list.push(match[1]);
                    }
                    
                    // Extract reacts
                    while ((match = reactRegex.exec(content)) !== null) {
                        reacts.push(match[1]);
                    }
                    
                    // Group by category
                    for (let i = 0; i < patterns.length; i++) {
                        const category = categories_list[i] || 'uncategorized';
                        if (!categories[category]) {
                            categories[category] = [];
                        }
                        
                        categories[category].push({
                            pattern: patterns[i],
                            alias: aliases[i] || [],
                            desc: descriptions[i] || 'No description',
                            react: reacts[i] || '🔹'
                        });
                    }
                    
                } catch (fileError) {
                    console.error(`Error reading file ${file}:`, fileError.message);
                }
            }
        });
        
    } catch (error) {
        console.error('Error scanning plugins:', error.message);
    }
    
    return categories;
};

// Format menu text
const formatMenu = (categories, pushname) => {
    let menuText = `╔════════════════════╗
║   📋 ʙᴏᴛ ᴄᴏᴍᴍᴀɴᴅꜱ ᴍᴇɴᴜ 📋
╚════════════════════╝

┌─── ✦﹒ᴜꜱᴇʀ ɪɴꜰᴏ﹒✦ ───┐
│ 👤 ɴᴀᴍᴇ: ${pushname || 'User'}
│ 🤖 ʙᴏᴛ: ${config.BOT_NAME}
│ 🔧 ᴘʀᴇꜰɪx: ${config.PREFIX}
└────────────────────┘

`;

    // Sort categories
    const sortedCategories = Object.keys(categories).sort();
    
    for (const category of sortedCategories) {
        if (categories[category].length === 0) continue;
        
        // Category header with icon
        let categoryIcon = '📁';
        switch(category.toLowerCase()) {
            case 'group': categoryIcon = '👥'; break;
            case 'downloader': categoryIcon = '📥'; break;
            case 'utility': categoryIcon = '🛠️'; break;
            case 'owner': categoryIcon = '👑'; break;
            case 'game': categoryIcon = '🎮'; break;
            case 'fun': categoryIcon = '🎉'; break;
            case 'ai': categoryIcon = '🤖'; break;
            case 'settings': categoryIcon = '⚙️'; break;
            case 'search': categoryIcon = '🔍'; break;
            case 'tools': categoryIcon = '🔧'; break;
        }
        
        menuText += `┌─── ✦﹒${categoryIcon} ${category.toUpperCase()}﹒✦ ───┐\n`;
        
        // Add commands in this category
        categories[category].forEach(cmd => {
            const aliases = cmd.alias.length > 0 ? ` [${cmd.alias.slice(0, 2).join(', ')}${cmd.alias.length > 2 ? '...' : ''}]` : '';
            menuText += `│ ${cmd.react} ${config.PREFIX}${cmd.pattern}${aliases}\n`;
        });
        
        menuText += `└────────────────────┘\n\n`;
    }

    // Add stats
    const totalCommands = Object.values(categories).reduce((acc, cat) => acc + cat.length, 0);
    
    menuText += `╔════════════════════╗
║   📊 ꜱᴛᴀᴛɪꜱᴛɪᴄꜱ 📊
╚════════════════════╝

┌─── ✦﹒ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅꜱ﹒✦ ───┐
│ 📌 ${totalCommands} ᴄᴏᴍᴍᴀɴᴅꜱ
│ 📂 ${sortedCategories.length} ᴄᴀᴛᴇɢᴏʀɪᴇꜱ
└────────────────────┘

⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ: ✨ ʙɪɴ-ᴀᴅɴᴀɴ ✨`;

    return menuText;
};

cmd({
    pattern: "menu",
    alias: ["help", "commands", "cmdlist"],
    react: "📋",
    desc: "Show all available commands",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // Send processing message
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   📋 ɢᴇɴᴇʀᴀᴛɪɴɢ ᴍᴇɴᴜ... 📋
╚════════════════════╝

⏳ ꜱᴄᴀɴɴɪɴɢ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ, ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ...

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        // Scan all plugins and get categories
        const categories = scanPlugins();
        
        // Format menu text
        const menuText = formatMenu(categories, pushname);

        // Send menu with image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/chzcqk.jpeg' }, // Replace with your image
            caption: menuText,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Menu Error:', error);
        await conn.sendMessage(from, {
            text: `╔════════════════════╗
║   ❌ ᴍᴇɴᴜ ᴇʀʀᴏʀ ❌
╚════════════════════╝

┌─── ✦﹒ᴇʀʀᴏʀ ɪɴꜰᴏ﹒✦ ───┐
│ 📋 ${error.message}
└────────────────────┘

⚡ ʙɪɴ-ᴀᴅɴᴀɴ ✨`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});