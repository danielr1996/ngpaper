import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { startTunnel } from "./tunnel.ts";
await new Command()
  .name("ngpaper")
  .version("0.1.3")
  .description("forward ports on your machine to a public host with ssh tunnels")
  .arguments("<port> [output:string]")
  .option('-u, --user','ssh root to establish connection with',{default: 'root'})
  .option('-H, --host','ssh host to establish connection with',{default: 'ssh.ngpaper.danielrichter.codes'})
  .option('-P, --port <port:number>','port on the ssh host to expose',{default: 0})
  .option('-d, --debug <debug:boolean>','port on the ssh host to expose',{default: false})
  .action(async ({user,host,port,debug},localPort)=>{
        const assignedPort = await startTunnel({
            remote:{
                host: host as string,
                port: port as number},
            local: {
                host: 'localhost',
                port: (localPort as unknown) as number},
            user: user as string,
            debug: debug as boolean,
        });
        console.log(`📜 started forwarding for 🔗 http://${host}:${assignedPort} => localhost:${localPort}`,);
    })
  .parse(Deno.args);