const fs = require('fs');
const https = require('http'); // The HA_URL is http based on .env

async function getAutomations() {
    // Load .env
    const env = fs.readFileSync('.env', 'utf8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .reduce((acc, line) => {
            const [key, ...value] = line.split('=');
            acc[key.trim()] = value.join('=').trim();
            return acc;
        }, {});

    const baseUrl = env.HA_URL;
    const token = env.HA_TOKEN;

    async function apiRequest(path) {
        return new Promise((resolve, reject) => {
            const url = `${baseUrl}${path}`;
            const options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            const req = https.get(url, options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Failed to parse response: ${data.substring(0, 100)}`));
                    }
                });
            });
            req.on('error', reject);
        });
    }

    console.log('Fetching automation list...');
    const states = await apiRequest('/api/states');
    const automationIds = states
        .filter(s => s.entity_id.startsWith('automation.') && s.attributes.id)
        .map(s => ({ id: s.attributes.id, name: s.attributes.friendly_name }));

    console.log(`Found ${automationIds.length} UI automations. Fetching details...`);

    let output = '# Home Assistant UI Automations Export\n\n';
    output += `Exported on: ${new Date().toISOString()}\n\n`;

    for (const { id, name } of automationIds) {
        console.log(`Fetching ${name} (${id})...`);
        try {
            const config = await apiRequest(`/api/config/automation/config/${id}`);
            output += `## ${name}\n`;
            output += `**ID:** \`${id}\`\n\n`;
            output += '```yaml\n';
            
            // Convert JSON to YAML using yq
            const jsonStr = JSON.stringify(config);
            const yamlStr = require('child_process').execSync(`echo '${jsonStr.replace(/'/g, "'\\''")}' | yq r -`, { encoding: 'utf8' });
            output += yamlStr;
            
            output += '```\n\n---\n\n';
        } catch (e) {
            console.error(`Failed to fetch ${name}: ${e.message}`);
            output += `## ${name}\n`;
            output += `*Error fetching details: ${e.message}*\n\n---\n\n`;
        }
    }

    fs.writeFileSync('ui_automations_details.md', output);
    console.log('Done! Exported to ui_automations_details.md');
}

getAutomations().catch(console.error);
