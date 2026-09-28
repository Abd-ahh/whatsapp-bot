import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update
    if(qr) qrcode.generate(qr, {small: true})
    if(connection === 'open') console.log('البوت متصل!')
    if(connection === 'close') startBot()
  })
  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]
    if(!msg.message || msg.key.fromMe) return
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    if(text === 'السلام') {
      await sock.sendMessage(msg.key.remoteJid, { text: 'وعليكم السلام! البوت شغال 🔥' })
    }
  })
}
startBot()