import { runConsoleCommand, currentHost } from './commands'
import type { ConsoleWorld } from './types'

// Every action a script can take goes through the exact same, already-tested command
// logic a human typing at the terminal uses — no separate, unverified code path, and no
// verb that magically "hacks" anything. A script can call curl/hydra/ftp exactly like a
// human would; whether that succeeds depends on the same real evaluation either way.
export function handleScriptAction(method: string, args: unknown[], world: ConsoleWorld): unknown {
  const asStr = (v: unknown) => String(v)
  switch (method) {
    case 'status':
      return {
        money: world.player.money,
        rep: world.player.rep,
        xp: world.player.xp,
        currentHost: currentHost(world).hostname,
        currentUser: world.currentUser,
      }
    case 'scan':
      return runConsoleCommand('scan', world)
    case 'net':
      return runConsoleCommand('net', world)
    case 'nmap': {
      const [host, withVersion] = args
      return runConsoleCommand(`nmap ${withVersion ? '-sV ' : ''}${asStr(host)}`, world)
    }
    case 'ftp':
      return runConsoleCommand(`ftp ${asStr(args[0])}`, world)
    case 'curl': {
      const [urlArg, opts] = args as [string, { method?: string; data?: string; header?: string } | undefined]
      let cmd = `curl ${urlArg}`
      if (opts?.method) cmd += ` -X ${opts.method}`
      if (opts?.data) cmd += ` -d "${opts.data}"`
      if (opts?.header) cmd += ` -H "${opts.header}"`
      return runConsoleCommand(cmd, world)
    }
    case 'hydra': {
      const [user, wordlist, target] = args
      return runConsoleCommand(`hydra -l ${asStr(user)} -P ${asStr(wordlist)} ssh://${asStr(target)}`, world)
    }
    case 'tcpdump': {
      const [target, wordFile] = args
      return runConsoleCommand(`tcpdump ${asStr(target)} -w ${wordFile ? asStr(wordFile) : 'capture.pcap'}`, world)
    }
    case 'tshark':
      return runConsoleCommand(`tshark -r ${asStr(args[0])}`, world)
    case 'connect':
      return runConsoleCommand(`connect ${asStr(args[0])}`, world)
    case 'methodology':
      return runConsoleCommand('methodology', world)
    case 'shell':
      // Runs a real filesystem/sudo command on whatever host the script is currently connected to.
      return runConsoleCommand(asStr(args[0]), world)
    default:
      throw new Error(`unknown game API method: ${method}`)
  }
}
