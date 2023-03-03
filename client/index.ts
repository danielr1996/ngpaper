import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { startTunnel } from "./tunnel.ts";

await new Command()
    .name("ngpaper")
    .version("0.1.3")
    .description("forward ports on your machine to a public host with ssh tunnels")
    .option('-u, --user', 'ssh root to establish connection with', { default: 'root' })
    .option('-P, --port <port:number>', 'port on the ssh host to expose', { default: 0 })
    .option('-d, --debug <debug:boolean>', 'port on the ssh host to expose', { default: false })
    .arguments("<port> [output:string]")
    .action(async ({ user, port, debug }, host, localPort) => {
        const assignedPort = await startTunnel({
            remote: {
                host: host as string,
                port: port as number
            },
            local: {
                host: 'localhost',
                port: (localPort as unknown) as number
            },
            user: user as string,
            debug: debug as boolean,
        });
        const res = (await fetch("http://api.ngpaper.danielrichter.codes/routes", {
            method: 'POST', body: JSON.stringify({
                hostname: host, port: assignedPort
            })
        })).text()
        console.log(res)
        console.log(`📜 started forwarding for 🔗 http://${host} => localhost:${localPort}`,);
    })
    .parse(Deno.args);