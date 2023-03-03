import { iterateReader } from "https://deno.land/std@0.178.0/streams/iterate_reader.ts";


export type TunnelEndpoint = { host: string, port: number }

export type TunnelArguments = {
  remote: TunnelEndpoint,
  local: TunnelEndpoint,
  user: string,
  debug: boolean
}

export const startTunnel = ({ remote, local, user, debug = false }: TunnelArguments) =>
  new Promise(async (resolve, reject) => {
    const command =
      `ssh -o StrictHostKeyChecking=no -NR ${remote.port}:${local.host}:${local.port} ${user}@${remote.host}`;
    if (debug) console.log(`ℹ️ Using ssh command "${command}"`);
    const cmd = command.split(" ");
    const proc = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
    if (remote.port != 0) resolve(remote.port);

    for await (const chunk of iterateReader(proc.stderr)) {
      const found = new TextDecoder().decode(chunk).toString().match(
        /Allocated port ([0-9]+) for remote/,
      );
      if (found) {
        const [, port] = found;
        if (port) {
          proc.stdout.close();
          resolve(port);
        }
      }
    }
  });