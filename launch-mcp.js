#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Charger la configuration
const configPath = path.join(__dirname, 'mcp-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Fonction pour lancer un serveur
function launchServer(serverName, serverConfig) {
  if (!serverConfig.enabled) return;

  console.log(`Démarrage du serveur : ${serverName}`);

  if (serverConfig.command) {
    const serverProcess = spawn(serverConfig.command, serverConfig.args || [], {
      env: { 
        ...process.env, 
        ...(serverConfig.env || {}) 
      },
      stdio: 'inherit'
    });

    serverProcess.on('error', (error) => {
      console.error(`Erreur lors du démarrage de ${serverName}:`, error);
    });
  }
}

// Lancer tous les serveurs
Object.entries(config.mcpServers).forEach(([name, serverConfig]) => {
  launchServer(name, serverConfig);
});
